import type { SelectHTMLAttributes } from 'react'
import styles from './SelectField.module.scss'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function SelectField({
  label,
  options,
  error,
  id,
  className,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name
  const errorId = error ? `${fieldId}-error` : undefined
  const hasValue = props.value !== undefined && props.value !== ''

  return (
    <label className={[styles.field, className ?? ''].filter(Boolean).join(' ')} htmlFor={fieldId}>
      <span
        className={styles.shell}
        data-invalid={Boolean(error) || undefined}
        data-filled={hasValue || undefined}
      >
        <select
          {...props}
          id={fieldId}
          className={styles.select}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.label}>{label}</span>
        <span className={styles.chevron} aria-hidden="true" />
        <span className={styles.underline} aria-hidden="true" />
      </span>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
