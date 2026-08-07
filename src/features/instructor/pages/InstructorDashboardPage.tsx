import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCourseEnrollments } from '@/features/instructor/hooks/useCourseEnrollments'
import { useInstructorDashboard } from '@/features/instructor/hooks/useInstructorDashboard'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { courseDetailPath, ROUTES } from '@/shared/constants/routes'
import { formatDate } from '@/shared/utils/format'
import styles from '@/features/instructor/pages/InstructorDashboardPage.module.scss'

export function InstructorDashboardPage() {
  const { t, i18n } = useTranslation()
  const { data, isLoading, isError, refetch } = useInstructorDashboard()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const enrollmentsQuery = useCourseEnrollments(selectedCourseId)

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return (
      <div className="container page">
        <StateMessage
          title={t('errors.loadFailed')}
          description={t('errors.generic')}
          actionLabel={t('app.retry')}
          onAction={() => void refetch()}
        />
      </div>
    )
  }

  const selectedCourse = data.courses.find((course) => course.id === selectedCourseId)

  return (
    <div className={`container page ${styles.page}`}>
      <PageHeader
        kicker={t('instructor.kicker')}
        title={t('instructor.title')}
        description={t('instructor.subtitle')}
        actions={
          <Link to={ROUTES.createCourse}>
            <Button type="button">{t('instructor.createCourse')}</Button>
          </Link>
        }
      />

      <Reveal className={`${styles.stats} stagger`} variant="up" delayMs={40}>
        <div>
          <strong>{data.stats.courseCount}</strong>
          <span>{t('instructor.stats.courses')}</span>
        </div>
        <div>
          <strong>{data.stats.enrollmentCount}</strong>
          <span>{t('instructor.stats.enrollments')}</span>
        </div>
        <div>
          <strong>{data.stats.certificateCount}</strong>
          <span>{t('instructor.stats.certificates')}</span>
        </div>
        <div>
          <strong>{data.stats.averageProgress}%</strong>
          <span>{t('instructor.stats.avgProgress')}</span>
        </div>
      </Reveal>

      <Reveal as="section" className={styles.courses} variant="up" delayMs={120}>
        <header className={styles.sectionHead}>
          <h2>{t('instructor.myCourses')}</h2>
          <p>{t('instructor.myCoursesSubtitle')}</p>
        </header>
        {!data.courses.length ? (
          <div className={styles.emptyPanel}>
            <p className={styles.empty}>{t('instructor.noCourses')}</p>
            <Link to={ROUTES.createCourse}>
              <Button type="button">{t('instructor.createCourse')}</Button>
            </Link>
          </div>
        ) : (
          <ul className="stagger">
            {data.courses.map((course) => (
              <li key={course.id}>
                <div className={styles.courseRow}>
                  <img src={course.thumbnailUrl} alt="" />
                  <Link to={courseDetailPath(course.id)} className={styles.courseMain}>
                    <strong>{course.title}</strong>
                    <span>
                      {t(`courses.categories.${course.category}`)} ·{' '}
                      {t(`courses.levels.${course.level}`)} ·{' '}
                      {t('instructor.enrollmentCount', { count: course.enrollmentCount })}
                    </span>
                  </Link>
                  <button
                    type="button"
                    className={styles.enrollmentsToggle}
                    aria-expanded={selectedCourseId === course.id}
                    onClick={() =>
                      setSelectedCourseId((current) =>
                        current === course.id ? null : course.id,
                      )
                    }
                  >
                    {t('instructor.viewEnrollments')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      {selectedCourseId ? (
        <Reveal as="section" className={styles.enrollments} variant="up">
          <header className={styles.enrollmentsHeader}>
            <h2>
              {t('instructor.enrollmentsTitle', {
                course: selectedCourse?.title ?? '',
              })}
            </h2>
            <button type="button" onClick={() => setSelectedCourseId(null)}>
              {t('app.closeMenu')}
            </button>
          </header>

          {enrollmentsQuery.isLoading ? <Spinner /> : null}
          {enrollmentsQuery.isError ? (
            <StateMessage
              title={t('errors.loadFailed')}
              description={t('errors.generic')}
              actionLabel={t('app.retry')}
              onAction={() => void enrollmentsQuery.refetch()}
            />
          ) : null}
          {enrollmentsQuery.data && enrollmentsQuery.data.length === 0 ? (
            <p className={styles.empty}>{t('instructor.noEnrollments')}</p>
          ) : null}
          {enrollmentsQuery.data && enrollmentsQuery.data.length > 0 ? (
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>{t('instructor.student')}</th>
                    <th>{t('auth.email')}</th>
                    <th>{t('instructor.progress')}</th>
                    <th>{t('instructor.enrolledAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentsQuery.data.map((row) => (
                    <tr key={row.id}>
                      <td>{row.studentName}</td>
                      <td>{row.studentEmail}</td>
                      <td>{row.progressPercent}%</td>
                      <td>{formatDate(row.enrolledAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Reveal>
      ) : null}
    </div>
  )
}
