import { useTranslation } from 'react-i18next'
import { CourseFiltersBar } from '@/features/courses/components/CourseFilters'
import { CourseGrid } from '@/features/courses/components/CourseGrid'
import { useCourseFilters } from '@/features/courses/hooks/useCourseFilters'
import { useCoursesList } from '@/features/courses/hooks/useCoursesList'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import styles from '@/features/courses/pages/CoursesPage.module.scss'

export function CoursesPage() {
  const { t } = useTranslation()
  const { filters, update, clear } = useCourseFilters()
  const { data, isLoading, isError, refetch } = useCoursesList(filters)

  return (
    <div className={`container page ${styles.page}`}>
      <PageHeader
        kicker={t('courses.kicker')}
        title={t('courses.title')}
        description={t('courses.subtitle')}
        meta={
          data ? (
            <span className={styles.resultCount}>
              {t('courses.resultCount', { count: data.pagination.total })}
            </span>
          ) : null
        }
      />

      <Reveal className={styles.filtersSlot} variant="up" delayMs={60}>
        <CourseFiltersBar filters={filters} onChange={update} onClear={clear} />
      </Reveal>

      {isLoading ? <Spinner /> : null}
      {isError ? (
        <StateMessage
          title={t('errors.loadFailed')}
          description={t('errors.generic')}
          actionLabel={t('app.retry')}
          onAction={() => void refetch()}
        />
      ) : null}
      {data?.items.length ? (
        <Reveal variant="fade" delayMs={120}>
          <CourseGrid courses={data.items} />
        </Reveal>
      ) : null}
      {data && data.items.length === 0 ? (
        <StateMessage title={t('courses.emptyTitle')} description={t('courses.emptyBody')} />
      ) : null}

      {data && data.pagination.totalPages > 1 ? (
        <Reveal className={styles.pagination} delayMs={180} variant="up">
          <Button
            type="button"
            variant="secondary"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => update({ page: (filters.page ?? 1) - 1 })}
          >
            {t('app.back')}
          </Button>
          <span>
            {t('courses.pageOf', {
              page: data.pagination.page,
              total: data.pagination.totalPages,
            })}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={(filters.page ?? 1) >= data.pagination.totalPages}
            onClick={() => update({ page: (filters.page ?? 1) + 1 })}
          >
            {t('app.next')}
          </Button>
        </Reveal>
      ) : null}
    </div>
  )
}
