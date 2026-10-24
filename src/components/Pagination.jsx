import { Icon } from './Icon'

const PAGE_SIZES = [5, 10, 20, 50]

export function Pagination({ skip, limit, count, hasNext, onPageChange, onLimitChange, busy = false }) {
  const page = Math.floor(skip / limit) + 1
  const rangeStart = count === 0 ? 0 : skip + 1
  const rangeEnd = skip + count

  return (
    <div className="pagination">
      <span className="pagination__status">
        {count === 0 ? 'No links on this page' : `Showing ${rangeStart}–${rangeEnd} · Page ${page}`}
      </span>

      <select
        className="select"
        value={limit}
        aria-label="Links per page"
        disabled={busy}
        onChange={(event) => onLimitChange(Number(event.target.value))}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>

      <div className="pagination__controls">
        <button
          type="button"
          
          className="pagination__page"
          onClick={() => onPageChange(Math.max(0, skip - limit))}
          disabled={busy || skip === 0}
          aria-label="Previous page"
        >
          <Icon name="chevronLeft" size={18} />
        </button>

        <button type="button" className="pagination__page pagination__page--active" disabled>
          Page {page}
        </button>

        <button
          type="button"
          className="pagination__page"
          onClick={() => onPageChange(skip + limit)}
          disabled={busy || !hasNext}
          aria-label="Next page"
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </div>
  )
}
