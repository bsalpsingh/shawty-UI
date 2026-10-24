import { supabase } from './supabase'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function authHeaders() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new ApiError(error.message, { code: 'AUTH_SESSION_ERROR' })
  const token = data?.session?.access_token
  if (!token) {
    throw new ApiError('You need to sign in to continue.', { status: 401, code: 'UNAUTHORIZED' })
  }
  return { Authorization: `Bearer ${token}` }
}

function extractError(response, payload) {
  const detail = payload?.detail
  const message =
    (detail && typeof detail === 'object' && (detail.message || detail.detail)) ||
    (typeof detail === 'string' ? detail : null) ||
    payload?.message ||
    `Request failed (${response.status})`
  const code = (detail && typeof detail === 'object' && detail.code) || payload?.code || null
  return new ApiError(message, { status: response.status, code })
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(await authHeaders()),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ApiError(`Can't reach the shawty API at ${API_BASE_URL}.`, { code: 'NETWORK_ERROR' })
  }

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!response.ok) throw extractError(response, payload)
  return payload
}

export function normalizeUrl(raw) {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) return trimmed
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?([/?#].*)?$/.test(trimmed)) return `https://${trimmed}`
  return trimmed
}

export async function createShortUrl({ url, expiresAt = null }) {
  const payload = await request('/short-url', {
    method: 'POST',
    body: {
      url: normalizeUrl(url),
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    },
  })

  return {
    shortUrl: payload?.shortURL ?? '',
    originalUrl: payload?.url ?? url,
  }
}

export async function listUrls({ skip = 0, limit = 10, order = 'desc', signal } = {}) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit), order })
  const payload = await request(`/urls?${params.toString()}`, { signal })
  const urls = Array.isArray(payload?.urls) ? payload.urls : []

  return {
    urls,
    hasNext: urls.length === limit,
  }
}
