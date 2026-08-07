import styles from '@/shared/components/Avatar/Avatar.module.scss'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md'
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'L'
  const first = parts[0] ?? 'L'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const second = parts[1] ?? first
  return `${first[0] ?? 'L'}${second[0] ?? ''}`.toUpperCase()
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <span className={[styles.avatar, styles[size]].join(' ')} aria-hidden="true">
      {initials(name)}
    </span>
  )
}
