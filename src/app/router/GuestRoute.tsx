import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { ROUTES } from '@/shared/constants/routes'

export function GuestRoute() {
  const { isAuthenticated, bootstrapped, status } = useAuth()

  if (!bootstrapped || status === 'hydrating') {
    return <Spinner />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.myLearning} replace />
  }

  return <Outlet />
}
