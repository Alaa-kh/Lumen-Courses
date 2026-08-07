import { useTranslation } from 'react-i18next'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { AuthStage } from '@/features/auth/pages/AuthStage'

const LEARN_IMAGE =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=85'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <AuthStage
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      imageSrc={LEARN_IMAGE}
    >
      <RegisterForm />
    </AuthStage>
  )
}
