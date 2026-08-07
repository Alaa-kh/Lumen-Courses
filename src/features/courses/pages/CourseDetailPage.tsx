import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCourse } from '@/features/courses/hooks/useCourse'
import { useEnroll } from '@/features/learn/hooks/useEnroll'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Badge } from '@/shared/components/Badge/Badge'
import { Button } from '@/shared/components/Button/Button'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { ROUTES, learnPath, quizPath } from '@/shared/constants/routes'
import styles from '@/features/courses/pages/CourseDetailPage.module.scss'

export function CourseDetailPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { data: course, isLoading, isError, refetch } = useCourse(id)
  const { enroll, isPending, errorKey } = useEnroll()

  if (isLoading) return <Spinner />
  if (isError || !course) {
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

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        <img src={course.thumbnailUrl} alt="" className={styles.bannerImage} />
        <div className={styles.bannerScrim} />
        <div className={`container ${styles.bannerContent}`}>
          <div className={styles.meta}>
            <Badge tone="accent">{t(`courses.categories.${course.category}`)}</Badge>
            <Badge>{t(`courses.levels.${course.level}`)}</Badge>
            {course.hasQuiz ? <Badge tone="promo">{t('courses.quizBadge')}</Badge> : null}
          </div>
          <h1>{course.title}</h1>
          <p className={styles.description}>{course.description}</p>
          <p className={styles.byline}>
            {t('courses.taughtBy', { name: course.instructorName })}
          </p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <Reveal className={`${styles.specs} stagger`} variant="up">
          <div>
            <span>{t('courses.specLessons')}</span>
            <strong>{course.lessonCount}</strong>
          </div>
          <div>
            <span>{t('courses.specDuration')}</span>
            <strong>{t('courses.duration', { minutes: course.totalDurationMinutes })}</strong>
          </div>
          <div>
            <span>{t('courses.specLevel')}</span>
            <strong>{t(`courses.levels.${course.level}`)}</strong>
          </div>
          <div>
            <span>{t('courses.specAssessment')}</span>
            <strong>
              {course.hasQuiz ? t('courses.assessmentIncluded') : t('courses.assessmentNone')}
            </strong>
          </div>
        </Reveal>

        <div className={styles.layout}>
          <Reveal as="section" className={styles.lessons} variant="left" delayMs={80}>
            <header className={styles.sectionHead}>
              <h2>{t('courses.curriculum')}</h2>
              <p>{t('courses.curriculumSubtitle')}</p>
            </header>
            <ol className="stagger">
              {(course.lessons ?? []).map((lesson, index) => (
                <li key={lesson.id}>
                  <span className={styles.lessonIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{lesson.title}</strong>
                    <p>{lesson.description}</p>
                  </div>
                  <em>
                    {lesson.durationMinutes} {t('courses.minutes')}
                  </em>
                </li>
              ))}
            </ol>
            {course.quiz ? (
              <p className={styles.quizNote}>
                {t('courses.quizIncluded', {
                  title: course.quiz.title,
                  count: course.quiz.questionCount,
                })}
              </p>
            ) : null}
          </Reveal>

          <Reveal as="aside" className={styles.aside} variant="right" delayMs={140}>
            <div className={styles.enrollPanel}>
              <h2>{t('courses.startLearning')}</h2>
              <p>{t('courses.startLearningBody')}</p>
              <div className={styles.actions}>
                {isAuthenticated ? (
                  <Button
                    type="button"
                    fullWidth
                    disabled={isPending}
                    onClick={async () => {
                      await enroll(course.id)
                    }}
                  >
                    {t('learn.enroll')}
                  </Button>
                ) : (
                  <Link to={ROUTES.login} className={styles.fullLink}>
                    <Button type="button" fullWidth>
                      {t('learn.signInToEnroll')}
                    </Button>
                  </Link>
                )}
                <Link to={learnPath(course.id)} className={styles.fullLink}>
                  <Button type="button" variant="secondary" fullWidth>
                    {t('learn.openPlayer')}
                  </Button>
                </Link>
                {course.hasQuiz ? (
                  <Link to={quizPath(course.id)} className={styles.fullLink}>
                    <Button type="button" variant="ghost" fullWidth>
                      {t('learn.takeQuiz')}
                    </Button>
                  </Link>
                ) : null}
              </div>
              {errorKey ? <p className={styles.error}>{t(errorKey)}</p> : null}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
