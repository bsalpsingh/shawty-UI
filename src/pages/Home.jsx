import { useEffect, useRef, useState } from 'react'
import { useToast } from '../context/toast-context'
import { createShortUrl, normalizeUrl } from '../lib/api'
import { SearchBar } from '../components/SearchBar'
import { ResultCard } from '../components/ResultCard'
import { Icon } from '../components/Icon'

export function Home() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const { showToast } = useToast()
  const inputRef = useRef(null)

  // the field is always ready for the next link
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const handleSubmit = async (raw) => {
    const url = normalizeUrl(raw)
    if (!url || !/^https?:\/\/.+/i.test(url)) {
      showToast('That does not look like a valid link yet.', { variant: 'error' })
      inputRef.current?.focus({ preventScroll: true })
      return
    }

    setLoading(true)
    try {
      setResult(await createShortUrl({ url, expiresAt }))
      showToast('Short url ready.')
    } catch (error) {
      showToast(error?.message || 'Could not create the short url.', { variant: 'error' })
    } finally {
      setLoading(false)
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="wordmark">shawty</h1>
      <p className="slogan">
        <Icon name="sparkle" size={17} className="slogan__sparkle slogan__sparkle--lead" />
        <span>
          Magic links, <span className="slogan__accent">minus the wizard.</span>
        </span>
        <Icon name="sparkle" size={12} className="slogan__sparkle slogan__sparkle--trail" />
      </p>

      <SearchBar
        ref={inputRef}
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        loading={loading}
        disabled={loading}
        expiresAt={expiresAt}
        onExpiresChange={setExpiresAt}
      />

      {result ? (
        <ResultCard
          shortUrl={result.shortUrl}
          originalUrl={result.originalUrl}
          expiresAt={expiresAt}
          onCopy={(ok) => showToast(ok ? 'Copied.' : 'Copy failed — select it manually.', { variant: ok ? 'default' : 'error' })}
        />
      ) : null}
    </div>
  )
}
