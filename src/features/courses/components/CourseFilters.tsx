import { useTranslation } from 'react-i18next'
import type { CourseCategory, CourseFilters, CourseLevel } from '@/features/courses/types/course'
import styles from '@/features/courses/components/CourseFilters.module.scss'

interface CourseFiltersProps {
  filters: CourseFilters
  onChange: (patch: Partial<CourseFilters>) => void
  onClear: () => void
}

const CATEGORIES: Array<CourseCategory | ''> = [
  '',
  'programming',
  'design',
  'business',
  'languages',
]

const LEVELS: Array<CourseLevel | ''> = ['', 'beginner', 'intermediate', 'advanced']

export function CourseFiltersBar({ filters, onChange, onClear }: CourseFiltersProps) {
  const { t } = useTranslation()
  const activeCategory = filters.category ?? ''
  const activeLevel = filters.level ?? ''
  const hasActive = Boolean(filters.q || filters.category || filters.level)

  return (
    <div className={styles.panel}>
      <div className={styles.searchRow}>
        <label className={styles.searchLabel} htmlFor="course-search">
          {t('app.search')}
        </label>
        <div className={styles.searchField}>
          <span className={styles.searchIcon} aria-hidden="true" />
          <input
            id="course-search"
            className={styles.searchInput}
            value={filters.q ?? ''}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder={t('courses.searchPlaceholder')}
            type="search"
            autoComplete="off"
          />
          {(filters.q ?? '').length > 0 ? (
            <button
              type="button"
              className={styles.clearQuery}
              onClick={() => onChange({ q: '' })}
              aria-label={t('app.clearFilters')}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.groups}>
        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('courses.category')}</p>
          <div className={styles.chips} role="group" aria-label={t('courses.category')}>
            {CATEGORIES.map((value) => {
              const selected = activeCategory === value
              const label =
                value === '' ? t('courses.allCategories') : t(`courses.categories.${value}`)
              return (
                <button
                  key={`cat-${value || 'all'}`}
                  type="button"
                  className={[styles.chip, selected ? styles.chipActive : ''].join(' ')}
                  aria-pressed={selected}
                  onClick={() => onChange({ category: value })}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('courses.level')}</p>
          <div className={styles.segment} role="group" aria-label={t('courses.level')}>
            {LEVELS.map((value) => {
              const selected = activeLevel === value
              const label = value === '' ? t('courses.allLevels') : t(`courses.levels.${value}`)
              return (
                <button
                  key={`lvl-${value || 'all'}`}
                  type="button"
                  className={[styles.segmentBtn, selected ? styles.segmentActive : ''].join(' ')}
                  aria-pressed={selected}
                  onClick={() => onChange({ level: value })}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {hasActive ? (
        <div className={styles.footer}>
          <button type="button" className={styles.reset} onClick={onClear}>
            {t('app.clearFilters')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
