import styles from '@/shared/components/ProgressBar/ProgressBar.module.scss'

interface ProgressBarProps {
  value: number
  label?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ value, label, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={[styles.wrap, styles[size]].join(' ')}>
      {label ? (
        <div className={styles.labelRow}>
          <span>{label}</span>
          <strong>{clamped}%</strong>
        </div>
      ) : null}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
