import { formatDate, hostOf, isExpired, pathOf, relativeTime, shortCode, truncateStart } from '../lib/format'
import { Icon } from './Icon'

function ExpiryBadge({ expiresAt }) {
  if (!expiresAt) return <span className="badge">Never</span>
  if (isExpired(expiresAt)) return <span className="badge badge--expired">Expired</span>
  return (
    <span className="badge badge--live" title={formatDate(expiresAt)}>
      {relativeTime(expiresAt)}
    </span>
  )
}

export function UrlTable({ urls, onCopy, skeleton = false, rows = 6 }) {
  if (skeleton) {
    return (
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="col-code">Short url</th>
              <th className="col-target">Destination</th>
              <th className="col-created">Created</th>
              <th className="col-expires">Expires</th>
              <th className="col-actions" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index}>
                <td>
                  <div className="skeleton" style={{ width: '60%' }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: '70%' }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: '55%' }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: '45%' }} />
                </td>
                <td>
                  <div className="skeleton-actions" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="col-code">Short url</th>
            <th className="col-target">Destination</th>
            <th className="col-created">Created</th>
            <th className="col-expires">Expires</th>
            <th className="col-actions" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {urls.map((row, index) => (
            <tr key={row.id ?? index} style={{ animationDelay: `${index * 40}ms` }}>
              <td>
                <div className="cell-code">
                  <a href={row.shortURL} target="_blank" rel="noreferrer" title={row.shortURL}>
                    /{shortCode(row.shortURL)}
                  </a>
                </div>
              </td>
              <td>
                <div className="cell-target" title={row.url}>
                  <a href={row.url} target="_blank" rel="noreferrer">
                    {hostOf(row.url)}
                    {pathOf(row.url) && pathOf(row.url) !== '/' ? `${truncateStart(pathOf(row.url), 32)}` : ''}
                  </a>
                </div>
              </td>
              <td className="cell-created cell-muted" title={formatDate(row.created_at)}>
                {relativeTime(row.created_at)}
              </td>
              <td className="cell-expires">
                <ExpiryBadge expiresAt={row.expires_at} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onCopy?.(row.shortURL)}
                    aria-label="Copy short url"
                    title="Copy"
                  >
                    <Icon name="copy" size={16} />
                  </button>
                  <a
                    className="icon-btn"
                    href={row.shortURL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open short url"
                    title="Open"
                  >
                    <Icon name="open" size={16} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
