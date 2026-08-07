import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NavDropdown, type NavDropdownItem } from '@/app/layouts/NavDropdown'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap'
import { Avatar } from '@/shared/components/Avatar/Avatar'
import { Button } from '@/shared/components/Button/Button'
import { Dialog } from '@/shared/components/Dialog/Dialog'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle'
import { ROUTES } from '@/shared/constants/routes'
import { applyDocumentLocale } from '@/shared/i18n'
import styles from '@/app/layouts/MainLayout.module.scss'

export function MainLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { user, isAuthenticated, isInstructor, logout, bootstrapped, status } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  useAuthBootstrap()

  useEffect(() => {
    setMenuOpen(false)
    setAccountOpen(false)
    setMobileExpanded(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!accountOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [accountOpen])

  const switchLocale = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar'
    void i18n.changeLanguage(next)
    applyDocumentLocale(next)
  }

  const catalogItems: NavDropdownItem[] = [
    {
      label: t('nav.menus.allCourses'),
      to: ROUTES.courses,
      description: t('nav.menus.allCoursesDesc'),
    },
    {
      label: t('courses.categories.programming'),
      to: `${ROUTES.courses}?category=programming`,
      description: t('nav.menus.programmingDesc'),
    },
    {
      label: t('courses.categories.design'),
      to: `${ROUTES.courses}?category=design`,
      description: t('nav.menus.designDesc'),
    },
    {
      label: t('courses.categories.business'),
      to: `${ROUTES.courses}?category=business`,
      description: t('nav.menus.businessDesc'),
    },
    {
      label: t('courses.categories.languages'),
      to: `${ROUTES.courses}?category=languages`,
      description: t('nav.menus.languagesDesc'),
    },
  ]

  const learnItems: NavDropdownItem[] = isAuthenticated
    ? [
        {
          label: t('nav.myLearning'),
          to: ROUTES.myLearning,
          description: t('nav.menus.myLearningDesc'),
        },
        {
          label: t('nav.certificates'),
          to: ROUTES.certificates,
          description: t('nav.menus.certificatesDesc'),
        },
        {
          label: t('nav.menus.browseMore'),
          to: ROUTES.courses,
          description: t('nav.menus.browseMoreDesc'),
        },
      ]
    : [
        {
          label: t('nav.menus.startLearning'),
          to: ROUTES.register,
          description: t('nav.menus.startLearningDesc'),
        },
        {
          label: t('nav.courses'),
          to: ROUTES.courses,
          description: t('nav.menus.allCoursesDesc'),
        },
        {
          label: t('nav.login'),
          to: ROUTES.login,
          description: t('nav.menus.loginDesc'),
        },
      ]

  const teachItems: NavDropdownItem[] = isInstructor
    ? [
        {
          label: t('nav.dashboard'),
          to: ROUTES.instructor,
          description: t('nav.menus.dashboardDesc'),
        },
        {
          label: t('nav.createCourse'),
          to: ROUTES.createCourse,
          description: t('nav.menus.createCourseDesc'),
        },
      ]
    : [
        {
          label: t('nav.menus.becomeInstructor'),
          to: ROUTES.register,
          description: t('nav.menus.becomeInstructorDesc'),
        },
        {
          label: t('nav.menus.teachingGuide'),
          to: ROUTES.courses,
          description: t('nav.menus.teachingGuideDesc'),
        },
      ]

  const supportItems: NavDropdownItem[] = [
    {
      label: t('nav.menus.contact'),
      to: ROUTES.contact,
      description: t('nav.menus.contactDesc'),
    },
    {
      label: t('nav.menus.helpCenter'),
      to: ROUTES.home,
      description: t('nav.menus.helpCenterDesc'),
    },
    {
      label: t('nav.profile'),
      to: isAuthenticated ? ROUTES.profile : ROUTES.login,
      description: t('nav.menus.accountDesc'),
    },
  ]

  const toggleMobileGroup = (key: string) => {
    setMobileExpanded((current) => (current === key ? null : key))
  }

  if (!bootstrapped || status === 'hydrating') {
    return <Spinner />
  }

  return (
    <div className={styles.shell}>
      <div className={styles.chrome}>
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarInner}`}>
            <span>{t('header.topLine')}</span>
            <span className={styles.topBarAside}>{t('header.supportLine')}</span>
          </div>
        </div>

        <header className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <NavLink to={ROUTES.home} className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true" />
              <span className={styles.brandText}>
                <strong>{t('app.name')}</strong>
                <small>{t('header.brandLine')}</small>
              </span>
            </NavLink>

            <nav className={styles.navDesktop} aria-label="Main">
              <NavLink to={ROUTES.home} end className={styles.navLink}>
                {t('nav.home')}
              </NavLink>
              <NavDropdown
                label={t('nav.menus.catalog')}
                items={catalogItems}
                active={location.pathname.startsWith('/courses')}
              />
              <NavDropdown
                label={t('nav.menus.learn')}
                items={learnItems}
                active={
                  location.pathname.startsWith('/my-learning') ||
                  location.pathname.startsWith('/certificates') ||
                  location.pathname.startsWith('/learn')
                }
              />
              <NavDropdown
                label={t('nav.menus.teach')}
                items={teachItems}
                active={location.pathname.startsWith('/instructor')}
              />
              <NavDropdown label={t('nav.menus.support')} items={supportItems} />
            </nav>

            <div className={styles.actions}>
              <ThemeToggle />
              <button type="button" className={styles.langButton} onClick={switchLocale}>
                {i18n.language === 'ar' ? t('app.english') : t('app.arabic')}
              </button>

              <div className={styles.actionsDesktop}>
                {isAuthenticated && user ? (
                  <div className={styles.account} ref={accountRef}>
                    <button
                      type="button"
                      className={styles.accountTrigger}
                      aria-expanded={accountOpen}
                      aria-haspopup="menu"
                      onClick={() => setAccountOpen((open) => !open)}
                    >
                      <Avatar name={user.fullName} size="sm" />
                      <span className={styles.accountMeta}>
                        <strong>{user.fullName}</strong>
                        <small>
                          {user.role === 'instructor'
                            ? t('auth.roles.instructor')
                            : t('auth.roles.student')}
                        </small>
                      </span>
                    </button>
                    {accountOpen ? (
                      <div className={styles.accountMenu} role="menu">
                        <NavLink
                          to={ROUTES.profile}
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                        >
                          {t('nav.profile')}
                        </NavLink>
                        <NavLink
                          to={ROUTES.myLearning}
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                        >
                          {t('nav.myLearning')}
                        </NavLink>
                        <NavLink
                          to={ROUTES.certificates}
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                        >
                          {t('nav.certificates')}
                        </NavLink>
                        {isInstructor ? (
                          <NavLink
                            to={ROUTES.createCourse}
                            role="menuitem"
                            onClick={() => setAccountOpen(false)}
                          >
                            {t('nav.createCourse')}
                          </NavLink>
                        ) : null}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setAccountOpen(false)
                            setLogoutOpen(true)
                          }}
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <NavLink to={ROUTES.login} className={styles.accountLink}>
                      {t('nav.login')}
                    </NavLink>
                    <NavLink to={ROUTES.register} className={styles.learnCta}>
                      {t('header.learnCta')}
                    </NavLink>
                  </>
                )}
              </div>

              <button
                type="button"
                className={styles.menuToggle}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t('app.closeMenu') : t('app.openMenu')}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={menuOpen ? styles.menuIconOpen : styles.menuIcon} />
              </button>
            </div>
          </div>

          <div
            id="mobile-menu"
            className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : ''].join(' ')}
          >
            <nav className={styles.mobileNav} aria-label="Mobile">
              <NavLink to={ROUTES.home} end onClick={() => setMenuOpen(false)}>
                {t('nav.home')}
              </NavLink>

              {(
                [
                  ['catalog', t('nav.menus.catalog'), catalogItems],
                  ['learn', t('nav.menus.learn'), learnItems],
                  ['teach', t('nav.menus.teach'), teachItems],
                  ['support', t('nav.menus.support'), supportItems],
                ] as const
              ).map(([key, label, items]) => (
                <div key={key} className={styles.mobileGroup}>
                  <button
                    type="button"
                    className={styles.mobileGroupTrigger}
                    aria-expanded={mobileExpanded === key}
                    onClick={() => toggleMobileGroup(key)}
                  >
                    <span>{label}</span>
                    <em />
                  </button>
                  <div
                    className={[
                      styles.mobileGroupPanel,
                      mobileExpanded === key ? styles.mobileGroupPanelOpen : '',
                    ].join(' ')}
                  >
                    {items.map((item) =>
                      item.href ? (
                        <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                          {item.label}
                        </a>
                      ) : (
                        <NavLink
                          key={item.label}
                          to={item.to ?? '/'}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ),
                    )}
                  </div>
                </div>
              ))}

              {isAuthenticated ? (
                <>
                  <NavLink to={ROUTES.profile} onClick={() => setMenuOpen(false)}>
                    {t('nav.profile')}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      setLogoutOpen(true)
                    }}
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <NavLink to={ROUTES.login} onClick={() => setMenuOpen(false)}>
                    {t('nav.login')}
                  </NavLink>
                  <NavLink to={ROUTES.register} onClick={() => setMenuOpen(false)}>
                    {t('nav.register')}
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </header>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className={styles.menuBackdrop}
          aria-label={t('app.closeMenu')}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <main key={location.pathname} className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <strong>{t('app.name')}</strong>
            <p>{t('footer.blurb')}</p>
            <p className={styles.footerNote}>{t('footer.enterpriseNote')}</p>
          </div>
          <div>
            <h3>{t('footer.explore')}</h3>
            <NavLink to={ROUTES.courses}>{t('nav.courses')}</NavLink>
            <NavLink to={ROUTES.myLearning}>{t('nav.myLearning')}</NavLink>
            <NavLink to={ROUTES.certificates}>{t('nav.certificates')}</NavLink>
          </div>
          <div>
            <h3>{t('footer.teach')}</h3>
            <NavLink to={ROUTES.instructor}>{t('nav.dashboard')}</NavLink>
            <NavLink to={ROUTES.createCourse}>{t('nav.createCourse')}</NavLink>
            <NavLink to={ROUTES.register}>{t('nav.register')}</NavLink>
          </div>
          <div>
            <h3>{t('footer.contact')}</h3>
            <NavLink to={ROUTES.contact}>{t('nav.menus.contact')}</NavLink>
            <p>{t('footer.email')}</p>
            <p>{t('footer.hours')}</p>
          </div>
        </div>
        <div className={`container ${styles.footerBottom}`}>
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          <span>{t('app.tagline')}</span>
        </div>
      </footer>

      <Dialog
        open={logoutOpen}
        title={t('dialog.logoutTitle')}
        description={t('dialog.logoutBody')}
        onClose={() => setLogoutOpen(false)}
        size="sm"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setLogoutOpen(false)}>
              {t('app.cancel')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                logout()
                setLogoutOpen(false)
              }}
            >
              {t('nav.logout')}
            </Button>
          </>
        }
      />
    </div>
  )
}
