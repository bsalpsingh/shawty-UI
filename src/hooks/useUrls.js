import { useCallback, useEffect, useMemo, useState } from 'react'
import { listUrls } from '../lib/api'

const EMPTY = { urls: [], hasNext: false, error: null }

export function useUrls({ token, skip = 0, limit = 10, order = 'desc' }) {
  const [state, setState] = useState({ key: null, ...EMPTY })
  const [reloadToken, setReloadToken] = useState(0)

  const requestKey = token ? `${token}:${skip}:${limit}:${order}:${reloadToken}` : null

  const reload = useCallback(() => setReloadToken((value) => value + 1), [])

  useEffect(() => {
    if (!requestKey) return undefined

    const controller = new AbortController()
    let active = true

    listUrls({ skip, limit, order, signal: controller.signal })
      .then((result) => {
        if (!active) return
        setState({ key: requestKey, urls: result.urls, hasNext: result.hasNext, error: null })
      })
      .catch((error) => {
        if (!active || error?.name === 'AbortError') return
        setState({ key: requestKey, ...EMPTY, error })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [requestKey, skip, limit, order])

  return useMemo(() => {
    if (!requestKey) {
      return { urls: [], hasNext: false, loading: false, error: null, reload }
    }
    const settled = state.key === requestKey
    return {
      urls: settled ? state.urls : [],
      hasNext: settled ? state.hasNext : false,
      loading: !settled,
      error: settled ? state.error : null,
      reload,
    }
  }, [requestKey, state, reload])
}
