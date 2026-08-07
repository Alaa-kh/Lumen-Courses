import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle'
import { ROUTES } from '@/shared/constants/routes'
import { applyDocumentLocale } from '@/shared/i18n'
import styles from '@/features/auth/pages/AuthPage.module.scss'

interface AuthStageProps {
  title: string
  subtitle: string
  imageSrc: string
  children: ReactNode
}

export function AuthStage({ title, subtitle, imageSrc, children }: AuthStageProps) {
  const { t, i18n } = useTranslation()

  const switchLocale = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar'
    void i18n.changeLanguage(next)
    applyDocumentLocale(next)
  }

  return (
    <section className={styles.stage}>
      <aside className={styles.manifesto}>
        <div className={styles.manifestoBar}>
          <ThemeToggle />
          <button type="button" className={styles.langButton} onClick={switchLocale}>
            {i18n.language === 'ar' ? t('app.english') : t('app.arabic')}
          </button>
        </div>

        <img className={styles.photo} src={imageSrc} alt="" aria-hidden="true" />
        <div className={styles.veil} aria-hidden="true" />
        <div className={styles.manifestoInner} aria-hidden="true">
          <p className={styles.mark}>{t('app.name')}</p>
          <ul className={styles.points}>
            <li>{t('auth.points.curriculum')}</li>
            <li>{t('auth.points.progress')}</li>
            <li>{t('auth.points.credentials')}</li>
          </ul>
          <h2 className={styles.manifestoTitle}>{t('auth.stageHeadline')}</h2>
          <p className={styles.manifestoLine}>{t('auth.visualLine')}</p>
        </div>
        <span className={styles.spine} aria-hidden="true">
          {t('auth.visualKicker')}
        </span>
      </aside>

      <div className={styles.dock}>
        <div className={styles.dockTop}>
          <Link to={ROUTES.home} className={styles.homeLink}>
            {t('auth.backHome')}
          </Link>
          <p className={styles.dockBrand}>{t('app.name')}</p>
        </div>

        <header className={styles.header}>
          <p className={styles.step}>{t('auth.stepLabel')}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        <div className={styles.dockBody}>{children}</div>
      </div>
    </section>
  )
}
