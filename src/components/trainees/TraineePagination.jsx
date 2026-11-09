import { useMemo } from 'react'

export default function TraineePagination({ page, totalPages, setPage }) {
  const pages = useMemo(() => {
    const list = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) list.push(i)
      return list
    }
    list.push(1)
    if (page > 3) list.push('...')
    const startP = Math.max(2, page - 1)
    const endP = Math.min(totalPages - 1, page + 1)
    for (let i = startP; i <= endP; i++) list.push(i)
    if (page < totalPages - 2) list.push('...')
    list.push(totalPages)
    return list
  }, [page, totalPages])

  if (totalPages <= 1) return null

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return
    setPage(p)
    document.querySelector('.results-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
        <i className="fas fa-chevron-left" aria-hidden="true"></i> Prev
      </button>
      {pages.map((p, idx) =>
        p === '...' ? (
          <span className="page-ellipsis" key={`e-${idx}`}>…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => goTo(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button className="page-btn" onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="Next page">
        Next <i className="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
    </nav>
  )
}