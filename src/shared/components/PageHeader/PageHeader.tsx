import type { ReactNode } from 'react'
import styles from '@/shared/components/PageHeader/PageHeader.module.scss'

interface PageHeaderProps {
  kicker?: string
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
}

export function PageHeader({ kicker, title, description, actions, meta }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  )
}
