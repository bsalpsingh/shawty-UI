import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToastContext } from './toast-context'
import { Icon } from '../components/Icon'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const dismiss = useCallback(() => {
    setToast(null)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showToast = useCallback(
    (message, { variant = 'default', duration = 3200 } = {}) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ message, variant })
      timerRef.current = setTimeout(() => {
        setToast(null)
        timerRef.current = null
      }, duration)
    },
    [],
  )

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), [])

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="snackbar-host">
        {toast ? (
          <div className={`snackbar${toast.variant === 'error' ? ' snackbar--error' : ''}`} role="status" aria-live="polite">
            <Icon name={toast.variant === 'error' ? 'error' : 'check'} size={20} />
            <span>{toast.message}</span>
            <button type="button" className="snackbar__action" onClick={dismiss}>
              Dismiss
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  )
}
