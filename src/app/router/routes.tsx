import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/MainLayout'
import { GuestRoute } from '@/app/router/GuestRoute'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { ROUTES } from '@/shared/constants/routes'

const HomePage = lazy(() =>
  import('@/features/courses/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const CoursesPage = lazy(() =>
  import('@/features/courses/pages/CoursesPage').then((m) => ({ default: m.CoursesPage })),
)
const CourseDetailPage = lazy(() =>
  import('@/features/courses/pages/CourseDetailPage').then((m) => ({
    default: m.CourseDetailPage,
  })),
)
const CoursePlayerPage = lazy(() =>
  import('@/features/learn/pages/CoursePlayerPage').then((m) => ({
    default: m.CoursePlayerPage,
  })),
)
const QuizPage = lazy(() =>
  import('@/features/learn/pages/QuizPage').then((m) => ({ default: m.QuizPage })),
)
const MyLearningPage = lazy(() =>
  import('@/features/learn/pages/MyLearningPage').then((m) => ({ default: m.MyLearningPage })),
)
const CertificatesPage = lazy(() =>
  import('@/features/learn/pages/CertificatesPage').then((m) => ({
    default: m.CertificatesPage,
  })),
)
const CertificateView = lazy(() =>
  import('@/features/learn/pages/CertificateView').then((m) => ({
    default: m.CertificateView,
  })),
)
const InstructorDashboardPage = lazy(() =>
  import('@/features/instructor/pages/InstructorDashboardPage').then((m) => ({
    default: m.InstructorDashboardPage,
  })),
)
const CreateCoursePage = lazy(() =>
  import('@/features/instructor/pages/CreateCoursePage').then((m) => ({
    default: m.CreateCoursePage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const ContactPage = lazy(() =>
  import('@/features/support/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

export function AppRouter() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTES.home,
          element: (
            <Lazy>
              <HomePage />
            </Lazy>
          ),
        },
        {
          path: ROUTES.courses,
          element: (
            <Lazy>
              <CoursesPage />
            </Lazy>
          ),
        },
        {
          path: ROUTES.courseDetail,
          element: (
            <Lazy>
              <CourseDetailPage />
            </Lazy>
          ),
        },
        {
          path: ROUTES.contact,
          element: (
            <Lazy>
              <ContactPage />
            </Lazy>
          ),
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: ROUTES.learn,
              element: (
                <Lazy>
                  <CoursePlayerPage />
                </Lazy>
              ),
            },
            {
              path: ROUTES.quiz,
              element: (
                <Lazy>
                  <QuizPage />
                </Lazy>
              ),
            },
            {
              path: ROUTES.myLearning,
              element: (
                <Lazy>
                  <MyLearningPage />
                </Lazy>
              ),
            },
            {
              path: ROUTES.certificates,
              element: (
                <Lazy>
                  <CertificatesPage />
                </Lazy>
              ),
            },
            {
              path: ROUTES.certificateDetail,
              element: (
                <Lazy>
                  <CertificateView />
                </Lazy>
              ),
            },
            {
              path: ROUTES.profile,
              element: (
                <Lazy>
                  <ProfilePage />
                </Lazy>
              ),
            },
          ],
        },
        {
          element: <ProtectedRoute roles={['instructor']} />,
          children: [
            {
              path: ROUTES.instructor,
              element: (
                <Lazy>
                  <InstructorDashboardPage />
                </Lazy>
              ),
            },
            {
              path: ROUTES.createCourse,
              element: (
                <Lazy>
                  <CreateCoursePage />
                </Lazy>
              ),
            },
          ],
        },
      ],
    },
    {
      path: ROUTES.login,
      element: <AuthLayout />,
      children: [
        {
          element: <GuestRoute />,
          children: [
            {
              index: true,
              element: (
                <Lazy>
                  <LoginPage />
                </Lazy>
              ),
            },
          ],
        },
      ],
    },
    {
      path: ROUTES.register,
      element: <AuthLayout />,
      children: [
        {
          element: <GuestRoute />,
          children: [
            {
              index: true,
              element: (
                <Lazy>
                  <RegisterPage />
                </Lazy>
              ),
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.home} replace />,
    },
  ])
}
