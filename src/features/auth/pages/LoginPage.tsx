import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { AuthStage } from '@/features/auth/pages/AuthStage'

const LEARN_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthStage
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      imageSrc={LEARN_IMAGE}
    >
      <LoginForm />
    </AuthStage>
  )
}
