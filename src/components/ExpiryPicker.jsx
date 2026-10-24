import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

function pad(value) {
  return String(value).padStart(2, '0')
}

function toLocalInput(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function nowInput() {
  return toLocalInput(new Date().toISOString())
}

function presetIso(hours) {
  return new Date(Date.now() + hours * 3600000).toISOString()
}

const PRESETS = [
  { label: '1h', hours: 1 },
  { label: '1d', hours: 24 },
  { label: '1w', hours: 168 },
]

export function ExpiryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [min, setMin] = useState('')
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

  const showPicker = () => {
    setDraft(toLocalInput(value))
    setMin(nowInput())
    setOpen(true)
  }

  const apply = () => {
    if (!draft) {
      onChange(null)
      setOpen(false)
      return
    }
    const date = new Date(draft)
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return
    onChange(date.toISOString())
    setOpen(false)
  }

  const applyPreset = (hours) => {
    const iso = presetIso(hours)
    onChange(iso)
    setDraft(toLocalInput(iso))
    setOpen(false)
  }

  const clear = () => {
    onChange(null)
    setDraft('')
    setOpen(false)
  }

  return (
    <div className="expiry" ref={wrapRef}>
      <button
        type="button"
        className={`icon-btn icon-btn--tiny${value ? ' icon-btn--on' : ''}`}
        onClick={() => (open ? setOpen(false) : showPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value ? 'Change link expiry' : 'Set link expiry'}
        title={value ? `Expires ${new Date(value).toLocaleString()}` : 'Set link expiry'}
      >
        <Icon name="clock" size={17} />
      </button>

      {open ? (
        <div className="expiry__pop" role="dialog" aria-label="Link expiry">
          <div className="expiry__title">Link expires</div>

          <div className="expiry__presets">
            {PRESETS.map((preset) => (
              <button key={preset.label} type="button" className="chip chip--sm" onClick={() => applyPreset(preset.hours)}>
                {preset.label}
              </button>
            ))}
          </div>

          <input
            className="expiry__input"
            type="datetime-local"
            value={draft}
            min={min}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Expiry date and time"
          />

          <div className="expiry__actions">
            {value ? (
              <button type="button" className="btn btn--text btn--sm" onClick={clear}>
                Clear
              </button>
            ) : null}
            <button type="button" className="btn btn--sm" onClick={apply} disabled={!draft}>
              Set
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
