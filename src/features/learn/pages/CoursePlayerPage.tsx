import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isArticleLesson, LessonArticle } from '@/features/learn/components/LessonArticle'
import { useCompleteLesson } from '@/features/learn/hooks/useLearnActions'
import { useCourseProgress } from '@/features/learn/hooks/useProgress'
import { useEnroll } from '@/features/learn/hooks/useEnroll'
import { Button } from '@/shared/components/Button/Button'
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { isAppError } from '@/shared/errors/AppError'
import { certificateDetailPath, quizPath, ROUTES } from '@/shared/constants/routes'
import styles from '@/features/learn/pages/CoursePlayerPage.module.scss'

export function CoursePlayerPage() {
  const { courseId = '' } = useParams()
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch, error } = useCourseProgress(courseId)
  const { enroll, isPending: enrolling } = useEnroll()
  const { complete, isPending, lastCertificate } = useCompleteLesson(courseId)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  if (isLoading) return <Spinner />

  const notEnrolled = isError && isAppError(error) && error.code === 'NOT_ENROLLED'

  if (isError && !data) {
    return (
      <div className="container page">
        <StateMessage
          title={notEnrolled ? t('learn.notEnrolledTitle') : t('errors.loadFailed')}
          description={notEnrolled ? t('learn.notEnrolledBody') : t('errors.generic')}
          actionLabel={notEnrolled ? t('learn.enroll') : t('app.retry')}
          onAction={() => {
            if (notEnrolled) void enroll(courseId)
            else void refetch()
          }}
        />
        {enrolling ? <Spinner /> : null}
      </div>
    )
  }

  if (!data) return null

  const activeIndex = Math.max(
    0,
    data.lessons.findIndex((lesson) => lesson.id === (activeLessonId ?? data.lessons[0]?.id)),
  )
  const activeLesson = data.lessons[activeIndex] ?? data.lessons[0]
  const prevLesson = activeIndex > 0 ? data.lessons[activeIndex - 1] : null
  const nextLesson =
    activeIndex < data.lessons.length - 1 ? data.lessons[activeIndex + 1] : null
  const certificate = data.certificate ?? lastCertificate
  const completedCount = data.lessons.filter((lesson) => lesson.completed).length
  const totalLessons = data.lessons.length
  const courseComplete = data.enrollment.progressPercent >= 100 || Boolean(certificate)

  return (
    <div className={`container page ${styles.page}`}>
      <Reveal as="header" className={styles.header} variant="up">
        <div className={styles.headerCopy}>
          <p className={styles.kicker}>{t('learn.playerKicker')}</p>
          <h1>{data.course?.title}</h1>
        </div>
        <ProgressBar
          value={data.enrollment.progressPercent}
          label={t('learn.progressLabel', { percent: data.enrollment.progressPercent })}
        />
      </Reveal>

      <div className={styles.certBanner} data-ready={certificate ? 'true' : 'false'}>
        {certificate ? (
          <>
            <div>
              <strong>{t('learn.certificateReadyTitle')}</strong>
              <p>{t('learn.certificateReadyBody')}</p>
            </div>
            <div className={styles.certBannerActions}>
              <Link to={certificateDetailPath(certificate.id)}>
                <Button type="button">{t('learn.viewCertificate')}</Button>
              </Link>
              <Link to={ROUTES.certificates}>
                <Button type="button" variant="secondary">
                  {t('nav.certificates')}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <strong>{t('learn.certificateLockedTitle')}</strong>
              <p>
                {t('learn.certificateLockedBody', {
                  done: completedCount,
                  total: totalLessons,
                })}
              </p>
            </div>
            <Link to={ROUTES.certificates} className={styles.certMutedLink}>
              {t('nav.certificates')}
            </Link>
          </>
        )}
      </div>

      <div className={styles.layout}>
        <Reveal as="aside" className={styles.sidebar} variant="left" delayMs={80}>
          <div className={styles.sidebarHead}>
            <h2>{t('courses.curriculum')}</h2>
            <span>
              {t('learn.lessonOf', {
                current: activeIndex + 1,
                total: data.lessons.length,
              })}
            </span>
          </div>
          <ul className="stagger">
            {data.lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  className={
                    lesson.id === activeLesson?.id
                      ? `${styles.lessonBtn} ${styles.lessonBtnActive}`
                      : styles.lessonBtn
                  }
                  onClick={() => setActiveLessonId(lesson.id)}
                >
                  <span className={styles.lessonNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.lessonCopy}>
                    <strong>{lesson.title}</strong>
                    <em>
                      {lesson.completed
                        ? t('learn.completed')
                        : `${lesson.durationMinutes} ${t('courses.minutes')}`}
                    </em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {certificate ? (
            <Link to={certificateDetailPath(certificate.id)} className={styles.certLink}>
              {t('learn.viewCertificate')}
            </Link>
          ) : (
            <p className={styles.certHint}>
              {t('learn.certificateProgressHint', {
                percent: data.enrollment.progressPercent,
              })}
            </p>
          )}
          {data.quiz ? (
            <Link to={quizPath(courseId)} className={styles.quizLink}>
              {t('learn.takeQuiz')}
            </Link>
          ) : null}
        </Reveal>

        <Reveal as="section" className={styles.player} variant="right" delayMs={140}>
          {activeLesson ? (
            <div key={activeLesson.id} className={styles.lessonStage}>
              {isArticleLesson(activeLesson.videoUrl) ? (
                <LessonArticle lessonId={activeLesson.id} title={activeLesson.title} />
              ) : (
                <div className={styles.videoWrap}>
                  <iframe
                    title={activeLesson.title}
                    src={activeLesson.videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className={styles.playerBody}>
                <div className={styles.playerMeta}>
                  <span>
                    {t('learn.lessonOf', {
                      current: activeIndex + 1,
                      total: data.lessons.length,
                    })}
                  </span>
                  <span>
                    {activeLesson.durationMinutes} {t('courses.minutes')}
                  </span>
                </div>
                <h2>{activeLesson.title}</h2>
                <p>{activeLesson.description}</p>

                <div className={styles.playerActions}>
                  {!activeLesson.completed ? (
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={() => void complete(activeLesson.id)}
                    >
                      {t('learn.markComplete')}
                    </Button>
                  ) : courseComplete && certificate ? (
                    <Link to={certificateDetailPath(certificate.id)}>
                      <Button type="button">{t('learn.viewCertificate')}</Button>
                    </Link>
                  ) : (
                    <p className={styles.done}>{t('learn.lessonDone')}</p>
                  )}

                  <div className={styles.navLessons}>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!prevLesson}
                      onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                    >
                      {t('learn.prevLesson')}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!nextLesson}
                      onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                    >
                      {t('learn.nextLesson')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </div>
  )
}
