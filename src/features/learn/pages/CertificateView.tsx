import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCertificate } from '@/features/learn/hooks/useLearnActions'
import {
  buildCertificateHtml,
  downloadCertificateHtml,
  printCertificateHtml,
} from '@/features/learn/utils/certificateDocument'
import { Button } from '@/shared/components/Button/Button'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { formatDate } from '@/shared/utils/format'
import styles from '@/features/learn/pages/CertificateView.module.scss'

export function CertificateView() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  const { data, isLoading, isError, refetch } = useCertificate(id)

  const buildDocument = () => {
    if (!data) return null

    return buildCertificateHtml({
      brand: t('app.name'),
      heading: t('learn.certificateHeading'),
      awarded: t('learn.certificateAwarded'),
      studentName: data.studentName ?? '',
      courseLine: t('learn.certificateFor', { course: data.course?.title ?? '' }),
      code: data.certificateCode,
      issuedAt: formatDate(data.issuedAt, i18n.language),
      lang: i18n.language,
      dir: i18n.dir() === 'rtl' ? 'rtl' : 'ltr',
    })
  }

  const handlePrint = () => {
    const html = buildDocument()
    if (html) printCertificateHtml(html)
  }

  const handleDownload = () => {
    if (!data) return
    const html = buildDocument()
    if (!html) return
    downloadCertificateHtml(html, `lumen-certificate-${data.certificateCode}.html`)
  }

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

  return (
    <div className={`container page ${styles.page}`}>
      <div className={styles.toolbar}>
        <Button type="button" variant="secondary" onClick={handlePrint}>
          {t('learn.printCertificate')}
        </Button>
        <Button type="button" onClick={handleDownload}>
          {t('learn.downloadCertificate')}
        </Button>
      </div>

      <Reveal variant="scale">
        <article className={styles.certificate}>
          <p className={styles.brand}>{t('app.name')}</p>
          <h1>{t('learn.certificateHeading')}</h1>
          <p className={styles.awarded}>{t('learn.certificateAwarded')}</p>
          <p className={styles.name}>{data.studentName}</p>
          <p className={styles.course}>
            {t('learn.certificateFor', { course: data.course?.title ?? '' })}
          </p>
          <div className={styles.meta}>
            <span>{data.certificateCode}</span>
            <span>{formatDate(data.issuedAt, i18n.language)}</span>
          </div>
        </article>
      </Reveal>
    </div>
  )
}
