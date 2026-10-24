import { useState } from 'react'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useUrls } from '../hooks/useUrls'
import { useCopy } from '../hooks/useCopy'
import { UrlTable } from '../components/UrlTable'
import { Pagination } from '../components/Pagination'
import { Icon } from '../components/Icon'

export function Urls() {
  const { session } = useAuth()
  const { showToast } = useToast()
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const { copy } = useCopy()

  const { urls, hasNext, loading, error } = useUrls({
    token: session?.access_token ?? null,
    skip,
    limit,
  })

  const handleCopy = async (value) => {
    const ok = await copy(value)
    showToast(ok ? 'Copied.' : 'Copy failed — select it manually.', { variant: ok ? 'default' : 'error' })
  }

  return (
    <div>
      {error ? (
        <p className="signin__error" style={{ marginTop: 16 }}>
          {error.message}
        </p>
      ) : null}

      <div style={{ marginTop: 20 }}>
        {loading && urls.length === 0 ? (
          <UrlTable urls={[]} skeleton rows={limit} />
        ) : urls.length === 0 && !error ? (
          <div className="table-wrap">
            <div className="empty">
              <div className="empty__art">
                <Icon name="link" size={26} />
              </div>
              <p className="empty__text">No links yet. Shorten one and it shows up here.</p>
            </div>
          </div>
        ) : (
          <>
            <UrlTable urls={urls} onCopy={handleCopy} />
            <Pagination
              skip={skip}
              limit={limit}
              count={urls.length}
              hasNext={hasNext}
              busy={loading}
              onPageChange={setSkip}
              onLimitChange={(nextLimit) => {
                setLimit(nextLimit)
                setSkip(0)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
