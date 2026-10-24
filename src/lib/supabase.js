import { createClient } from '@supabase/supabase-js'
import { getEnv } from './runtime-config'

const supabaseUrl = getEnv('SUPABASE_URL')
const supabaseAnonKey = getEnv('SUPABASE_PUBLISHABLE_KEY')

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(supabaseUrl ?? 'http://localhost', supabaseAnonKey ?? 'public-anon-key', {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
})

export function stripAuthParamsFromUrl() {
  if (typeof window === 'undefined') return
  const { hash, search, pathname } = window.location
  const hashParams = new URLSearchParams(hash.replace(/^#/, ''))
  const searchParams = new URLSearchParams(search)

  const hasHashToken =
    hashParams.has('access_token') ||
    hashParams.has('refresh_token') ||
    hashParams.has('error_description') ||
    hashParams.has('error_code')
  const hasCode = searchParams.has('code')

  if (!hasHashToken && !hasCode) return

  const clean = `${pathname}${searchParams.has('code') ? '' : search}`
  window.history.replaceState({}, document.title, clean)
}
