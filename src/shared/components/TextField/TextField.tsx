import { useId, useState, type InputHTMLAttributes, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './TextField.module.scss'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({
  label,
  error,
  hint,
  id,
  className,
  placeholder,
  type = 'text',
  ...props
}: TextFieldProps) {
  const { t } = useTranslation()
  const generatedId = useId()
  const fieldId = id ?? props.name ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined
  const isPassword = type === 'password'
  const [passwordVisible, setPasswordVisible] = useState(false)

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setPasswordVisible((current) => !current)
  }

  return (
    <label className={[styles.field, className ?? ''].filter(Boolean).join(' ')} htmlFor={fieldId}>
      <span
        className={styles.shell}
        data-invalid={Boolean(error) || undefined}
        data-password={isPassword || undefined}
      >
        <input
          {...props}
          id={fieldId}
          className={styles.input}
          type={isPassword ? (passwordVisible ? 'text' : 'password') : type}
          placeholder={placeholder ?? ' '}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
        <span className={styles.label}>{label}</span>
        {isPassword ? (
          <button
            type="button"
            className={styles.reveal}
            onClick={togglePassword}
            aria-label={passwordVisible ? t('auth.hidePassword') : t('auth.showPassword')}
            aria-pressed={passwordVisible}
            tabIndex={0}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
        <span className={styles.underline} aria-hidden="true" />
        <span className={styles.sheen} aria-hidden="true" />
      </span>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
      <path
        d="M3 3l18 18M10.5 10.6a2.75 2.75 0 0 0 3.9 3.9M9.4 5.6C10.2 5.4 11.1 5.5 12 5.5c6 0 9.5 6.5 9.5 6.5a16.6 16.6 0 0 1-3.2 3.6M6.2 6.7C4.1 8.2 2.5 12 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.6-.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
