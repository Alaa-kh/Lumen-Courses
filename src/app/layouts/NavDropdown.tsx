import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import styles from '@/app/layouts/NavDropdown.module.scss'

export interface NavDropdownItem {
  label: string
  to?: string
  href?: string
  description?: string
}

interface NavDropdownProps {
  label: string
  items: NavDropdownItem[]
  active?: boolean
}

export function NavDropdown({ label, items, active = false }: NavDropdownProps) {
  const menuId = useId()
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, 180)
  }

  useEffect(() => {
    return () => clearCloseTimer()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      className={[styles.item, open ? styles.open : '', active ? styles.active : ''].join(' ')}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          scheduleClose()
        }
      }}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <em className={styles.chevron} aria-hidden="true" />
      </button>
      <div id={menuId} className={styles.menu} role="menu">
        <div className={styles.menuInner}>
          {items.map((item) => {
            const content: ReactNode = (
              <>
                <strong>{item.label}</strong>
                {item.description ? <small>{item.description}</small> : null}
              </>
            )

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className={styles.link}
                  onClick={() => setOpen(false)}
                >
                  {content}
                </a>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.to ?? '/'}
                role="menuitem"
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                {content}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
