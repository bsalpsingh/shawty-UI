import { Icon } from './Icon'
import { useCopy } from '../hooks/useCopy'
import { relativeTime } from '../lib/format'

export function ResultCard({ shortUrl, originalUrl, expiresAt = null, onCopy }) {
  const { copied, copy } = useCopy()

  const handleCopy = async () => {
    const ok = await copy(shortUrl)
    onCopy?.(ok)
  }

  return (
    <div className="result">
      <a className="result__url" href={shortUrl} target="_blank" rel="noreferrer" title={originalUrl}>
        {shortUrl}
      </a>

      {expiresAt ? (
        <span className="badge badge--live">
          <Icon name="clock" size={12} />
          expires {relativeTime(expiresAt)}
        </span>
      ) : null}

      <div className="result__actions">
        <button type="button" className="btn btn--ghost" onClick={handleCopy} aria-label="Copy short url">
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a className="icon-btn" href={shortUrl} target="_blank" rel="noreferrer" aria-label="Open short url">
          <Icon name="open" size={18} />
        </a>
      </div>
    </div>
  )
}
