import { forwardRef } from 'react'
import { Icon } from './Icon'
import { ExpiryPicker } from './ExpiryPicker'

export const SearchBar = forwardRef(function SearchBar(
  {
    value,
    onChange,
    onSubmit,
    loading = false,
    disabled = false,
    expiresAt = null,
    onExpiresChange,
    placeholder = 'Get short url — paste a long link',
  },
  ref,
) {
  const handleSubmit = (event) => {
    event.preventDefault()
    if (loading || disabled) return
    onSubmit?.(value)
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <div className="search__field">
        <div className="search__line">
          <span className="search__icon">
            <Icon name="search" size={20} />
          </span>
          <input
            ref={ref}
            className="search__input"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck="false"
            placeholder={placeholder}
            aria-label="Long URL to shorten"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange?.(event.target.value)}
          />
          <ExpiryPicker value={expiresAt} onChange={onExpiresChange} />
        </div>

        <button className="search__submit" type="submit" disabled={loading || disabled || !value.trim()}>
         
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </div>
    </form>
  )
})
