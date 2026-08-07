import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCertificates } from '@/features/learn/hooks/useLearnActions'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { certificateDetailPath, ROUTES } from '@/shared/constants/routes'
import { formatDate } from '@/shared/utils/format'
import styles from '@/features/learn/pages/CertificatesPage.module.scss'

export function CertificatesPage() {
  const { t, i18n } = useTranslation()
  const { data, isLoading, isError, refetch, isFetching } = useCertificates()

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
        kicker={t('learn.certificatesKicker')}
        title={t('learn.certificatesTitle')}
        description={t('learn.certificatesSubtitle')}
        meta={
          data?.length ? (
            <span className={styles.count}>
              {t('learn.enrolledCount', { count: data.length })}
            </span>
          ) : null
        }
        actions={
          <Button type="button" variant="secondary" disabled={isFetching} onClick={() => void refetch()}>
            {t('app.retry')}
          </Button>
        }
      />

      {!data?.length ? (
        <div className={styles.emptyWrap}>
          <StateMessage
            title={t('learn.emptyCertificatesTitle')}
            description={t('learn.emptyCertificatesBody')}
          />
          <Link to={ROUTES.myLearning}>
            <Button type="button">{t('nav.myLearning')}</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {data.map((certificate) => (
            <article key={certificate.id} className={styles.card}>
              <p className={styles.code}>{certificate.certificateCode}</p>
              <h2>{certificate.course?.title}</h2>
              <p>{formatDate(certificate.issuedAt, i18n.language)}</p>
              <Link to={certificateDetailPath(certificate.id)}>{t('learn.viewCertificate')}</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
