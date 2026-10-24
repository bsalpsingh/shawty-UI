import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/auth-context'
import { Icon } from './Icon'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const label = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Account'

  return (
    <div className="user-menu" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        title={label}
      >
        {avatarUrl ? (
          <img className="user-menu__avatar" src={avatarUrl} alt="" width={20} height={20} />
        ) : (
          <Icon name="person" size={19} />
        )}
      </button>

      {open ? (
        <div className="user-menu__pop" role="menu">
          <div className="user-menu__meta">
            <div className="user-menu__name">{label}</div>
            {user?.email && user.email !== label ? <div className="user-menu__email">{user.email}</div> : null}
          </div>
          <button type="button" className="user-menu__item" role="menuitem" onClick={signOut}>
            <Icon name="logout" size={16} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
