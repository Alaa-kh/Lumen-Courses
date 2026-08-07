import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMyProgress } from '@/features/learn/hooks/useProgress'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { ROUTES, certificateDetailPath, learnPath } from '@/shared/constants/routes'
import styles from '@/features/learn/pages/MyLearningPage.module.scss'

export function MyLearningPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useMyProgress()

  if (isLoading) return <Spinner />
  if (isError) {
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
    <div className={`container page ${styles.page}`}>
      <PageHeader
        kicker={t('learn.workspaceKicker')}
        title={t('learn.myLearningTitle')}
        description={t('learn.myLearningSubtitle')}
        meta={
          data?.length ? (
            <span className={styles.count}>
              {t('learn.enrolledCount', { count: data.length })}
            </span>
          ) : null
        }
        actions={
          <Link to={ROUTES.courses}>
            <Button type="button" variant="secondary">
              {t('nav.courses')}
            </Button>
          </Link>
        }
      />

      {!data?.length ? (
        <div className={styles.emptyWrap}>
          <StateMessage
            title={t('learn.emptyLearningTitle')}
            description={t('learn.emptyLearningBody')}
          />
          <Link to={ROUTES.courses}>
            <Button type="button">{t('nav.courses')}</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {data.map((item, index) => (
            <Reveal key={item.id} delayMs={index * 90} variant="up" className={styles.card}>
              <img src={item.course?.thumbnailUrl} alt="" />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <h2>{item.course?.title}</h2>
                  <div className={styles.cardActions}>
                    {item.certificate ? (
                      <Link
                        to={certificateDetailPath(item.certificate.id)}
                        className={styles.certificateLink}
                      >
                        {t('learn.viewCertificate')}
                      </Link>
                    ) : null}
                    <Link to={learnPath(item.courseId)} className={styles.continue}>
                      {t('learn.continue')}
                    </Link>
                  </div>
                </div>
                <ProgressBar
                  value={item.progressPercent}
                  label={t('learn.progressLabel', { percent: item.progressPercent })}
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
