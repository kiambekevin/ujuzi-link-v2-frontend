import { useState } from 'react'

export default function PasswordToggle({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  onBlur,
  ariaInvalid
}) {
  const [show, setShow] = useState(false)

  return (
    <>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid || undefined}
        style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        <i
          className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}
          aria-hidden="true"
        ></i>
      </button>
    </>
  )
}