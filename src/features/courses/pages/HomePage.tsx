import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CourseGrid } from '@/features/courses/components/CourseGrid'
import { useCoursesList } from '@/features/courses/hooks/useCoursesList'
import type { CourseCategory } from '@/features/courses/types/course'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { ROUTES } from '@/shared/constants/routes'
import styles from '@/features/courses/pages/HomePage.module.scss'

const HERO_VIDEO =
  'https://videos.pexels.com/video-files/3255275/3255275-uhd_2560_1440_25fps.mp4'
const HERO_POSTER =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1800&q=80'

const PATHWAYS: CourseCategory[] = ['programming', 'design', 'business', 'languages']

export function HomePage() {
  const { t } = useTranslation()
  const { isAuthenticated, isInstructor } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { data, isLoading, isError, refetch } = useCoursesList({
    featured: true,
    pageSize: 6,
  })
  const accountCtaTo = isAuthenticated ? ROUTES.myLearning : ROUTES.register
  const teachCtaTo = isAuthenticated
    ? isInstructor
      ? ROUTES.createCourse
      : ROUTES.myLearning
    : ROUTES.register

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (media.matches) {
        video.pause()
        return
      }
      void video.play().catch(() => undefined)
    }

    syncPlayback()
    media.addEventListener('change', syncPlayback)
    return () => media.removeEventListener('change', syncPlayback)
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label={t('home.hero.aria')}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className={styles.heroScrim} />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.brand}>{t('app.name')}</p>
          <h1 className={styles.headline}>{t('home.hero.headline')}</h1>
          <p className={styles.support}>{t('home.hero.support')}</p>
          <div className={styles.ctas}>
            <Link to={ROUTES.courses} className={styles.primaryCta}>
              {t('home.hero.browse')}
            </Link>
            <Link to={accountCtaTo} className={styles.secondaryCta}>
              {isAuthenticated ? t('nav.myLearning') : t('home.hero.start')}
            </Link>
          </div>
        </div>
        <div className={styles.scrollHint} aria-hidden="true">
          <span />
        </div>
      </section>

      <section className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.marqueeGroup}>
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={`${copy}-${index}`}>
                  {t('app.name')} · {t('app.tagline')} · {t('home.pillars.kicker')}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stack} aria-labelledby="pillars-title">
        <div className="container">
          <Reveal variant="left">
            <header className={styles.stackHeader}>
              <p className={styles.kicker}>{t('home.pillars.kicker')}</p>
              <h2 id="pillars-title">{t('home.pillars.title')}</h2>
              <p>{t('home.pillars.subtitle')}</p>
            </header>
          </Reveal>
          <div className={styles.stackList}>
            {(['curriculum', 'assessment', 'credentials'] as const).map((key, index) => (
              <Reveal
                key={key}
                delayMs={index * 120}
                variant={index % 2 === 0 ? 'right' : 'left'}
                className={styles.stackCard}
              >
                <span className={styles.stackNum}>0{index + 1}</span>
                <div className={styles.stackCopy}>
                  <h3>{t(`home.pillars.${key}.title`)}</h3>
                  <p>{t(`home.pillars.${key}.body`)}</p>
                </div>
                <span className={styles.stackOrb} aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.orbit} aria-labelledby="pathways-title">
        <div className={`container ${styles.orbitInner}`}>
          <Reveal variant="scale">
            <header className={styles.orbitHeader}>
              <p className={styles.kicker}>{t('home.pathways.kicker')}</p>
              <h2 id="pathways-title">{t('home.pathways.title')}</h2>
              <p>{t('home.pathways.subtitle')}</p>
            </header>
          </Reveal>
          <div className={styles.orbitRing}>
            {PATHWAYS.map((category, index) => (
              <Reveal key={category} delayMs={index * 100} variant="scale" className={styles.orbitItem}>
                <Link to={`${ROUTES.courses}?category=${category}`} className={styles.orbitLink}>
                  <strong>{t(`courses.categories.${category}`)}</strong>
                  <span>{t('home.pathways.explore')}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.rail} aria-labelledby="featured-title">
        <div className="container">
          <Reveal>
            <header className={styles.railHeader}>
              <div>
                <p className={styles.kicker}>{t('home.featured.kicker')}</p>
                <h2 id="featured-title">{t('home.featured.title')}</h2>
                <p>{t('home.featured.subtitle')}</p>
              </div>
              <Link to={ROUTES.courses} className={styles.railCta}>
                {t('home.featured.viewAll')}
              </Link>
            </header>
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
            <Reveal delayMs={80} variant="up">
              <CourseGrid courses={data.items} />
            </Reveal>
          ) : null}
          {data && data.items.length === 0 ? (
            <StateMessage title={t('courses.emptyTitle')} description={t('courses.emptyBody')} />
          ) : null}
        </div>
      </section>

      <section className={styles.flow} aria-labelledby="method-title">
        <div className="container">
          <Reveal variant="left">
            <header className={styles.flowHeader}>
              <p className={styles.kicker}>{t('home.method.kicker')}</p>
              <h2 id="method-title">{t('home.method.title')}</h2>
              <p>{t('home.method.subtitle')}</p>
            </header>
          </Reveal>
          <div className={styles.flowTrack}>
            {(['enroll', 'learn', 'certify'] as const).map((key, index) => (
              <Reveal key={key} delayMs={index * 140} className={styles.flowStep} variant="up">
                <div className={styles.flowNode}>
                  <span>{index + 1}</span>
                </div>
                <h3>{t(`home.method.${key}.title`)}</h3>
                <p>{t(`home.method.${key}.body`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.blast} aria-labelledby="teach-title">
        <Reveal as="div" variant="scale" className={`container ${styles.blastInner}`}>
          <p className={styles.kicker}>{t('home.teach.kicker')}</p>
          <h2 id="teach-title">{t('home.teach.title')}</h2>
          <p>{t('home.teach.subtitle')}</p>
          <div className={styles.ctas}>
            <Link to={teachCtaTo} className={styles.primaryCta}>
              {isAuthenticated && isInstructor
                ? t('nav.createCourse')
                : isAuthenticated
                  ? t('nav.myLearning')
                  : t('home.teach.cta')}
            </Link>
            <Link
              to={isAuthenticated && isInstructor ? ROUTES.instructor : ROUTES.courses}
              className={styles.secondaryCtaDark}
            >
              {isAuthenticated && isInstructor
                ? t('nav.dashboard')
                : t('home.teach.secondary')}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
