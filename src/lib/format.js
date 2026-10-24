export function shortCode(shortUrl) {
  if (!shortUrl) return ''
  try {
    const { pathname } = new URL(shortUrl)
    const segments = pathname.split('/').filter(Boolean)
    return segments[segments.length - 1] ?? ''
  } catch {
    return String(shortUrl).split('/').filter(Boolean).pop() ?? ''
  }
}

export function hostOf(url) {
  try {
    return new URL(url).host
  } catch {
    return url ?? ''
  }
}

export function pathOf(url) {
  try {
    return new URL(url).pathname
  } catch {
    return ''
  }
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function relativeTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(seconds)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  for (const [unit, unitSeconds] of units) {
    if (abs >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit)
    }
  }
  return formatter.format(seconds, 'second')
}

export function isExpired(value) {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() < Date.now()
}

export function truncateMiddle(value, max = 58) {
  if (!value) return ''
  if (value.length <= max) return value
  const head = Math.ceil((max - 1) / 2)
  const tail = Math.floor((max - 1) / 2)
  return `${value.slice(0, head)}…${value.slice(value.length - tail)}`
}

export function truncateStart(value, max = 34) {
  if (!value) return ''
  if (value.length <= max) return value
  return `…${value.slice(value.length - (max - 1))}`
}
