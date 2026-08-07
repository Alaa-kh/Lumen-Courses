import type { ReactNode } from 'react'
import styles from '@/shared/components/Badge/Badge.module.scss'

type BadgeTone = 'neutral' | 'accent' | 'promo' | 'success'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={[styles.badge, styles[tone]].join(' ')}>{children}</span>
}
