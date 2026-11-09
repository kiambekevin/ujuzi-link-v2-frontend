import { useEffect, useMemo, useRef, useState } from 'react'

export default function SearchableMultiSelect({
  label,
  options,
  selected,
  onToggle,
  onClear,
  placeholder = 'Search...',
  emptyLabel = 'No results found',
  showCount = true
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    setHighlighted(-1)
  }, [query, open])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setHighlighted((i) => Math.min(i + 1, filteredOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && highlighted >= 0 && filteredOptions[highlighted]) {
        onToggle(filteredOptions[highlighted])
        setQuery('')
      } else if (!open) {
        setOpen(true)
      }
    } else if (e.key === 'Backspace' && !query && selected.size > 0) {
      const last = Array.from(selected).pop()
      onToggle(last)
    }
  }

  const selectedArr = Array.from(selected)

  return (
    <div className={`sms-wrap ${open ? 'open' : ''}`} ref={wrapRef}>
      <div
        className="sms-control"
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
      >
        <i className="fas fa-search sms-icon" aria-hidden="true"></i>

        {selectedArr.map((value) => (
          <span className="sms-tag" key={value}>
            <span className="sms-tag-label" title={value}>
              {value}
            </span>
            <button
              type="button"
              className="sms-tag-remove"
              onClick={(e) => {
                e.stopPropagation()
                onToggle(value)
              }}
              aria-label={`Remove ${value}`}
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="sms-input"
          placeholder={selectedArr.length === 0 ? placeholder : ''}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label={`Search ${label}`}
          autoComplete="off"
        />

        {selectedArr.length > 0 && (
          <button
            type="button"
            className="sms-clear"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            aria-label="Clear all"
            title="Clear all"
          >
            <i className="fas fa-times-circle" aria-hidden="true"></i>
          </button>
        )}

        <i
          className={`fas fa-chevron-${open ? 'up' : 'down'} sms-caret`}
          aria-hidden="true"
        ></i>
      </div>

      {open && (
        <div className="sms-dropdown" role="listbox" aria-multiselectable="true">
          {filteredOptions.length === 0 ? (
            <div className="sms-empty">{emptyLabel}</div>
          ) : (
            filteredOptions.map((option, idx) => {
              const isSelected = selected.has(option)
              return (
                <div
                  key={option}
                  className={`sms-option ${isSelected ? 'selected' : ''} ${
                    idx === highlighted ? 'highlighted' : ''
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onToggle(option)
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  onMouseEnter={() => setHighlighted(idx)}
                >
                  <span className="sms-checkbox" aria-hidden="true">
                    {isSelected && <i className="fas fa-check"></i>}
                  </span>
                  <span className="sms-option-text">{option}</span>
                </div>
              )
            })
          )}
        </div>
      )}

      {showCount && selectedArr.length > 0 && (
        <span className="sms-count">{selectedArr.length} selected</span>
      )}
    </div>
  )
}