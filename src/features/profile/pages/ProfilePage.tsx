import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { TextField } from '@/shared/components/TextField/TextField'
import { formatDate } from '@/shared/utils/format'
import styles from '@/features/profile/pages/ProfilePage.module.scss'

const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const { update, isPending, isSuccess, errorKey } = useUpdateProfile()
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
    },
  })

  if (!user) {
    return null
  }

  return (
    <div className={`container page ${styles.page}`}>
      <PageHeader
        kicker={t('profile.kicker')}
        title={t('profile.title')}
        description={t('profile.subtitle')}
      />

      <dl className={styles.meta}>
        <div>
          <dt>{t('auth.email')}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{t('profile.role')}</dt>
          <dd>
            {user.role === 'instructor'
              ? t('auth.roles.instructor')
              : t('auth.roles.student')}
          </dd>
        </div>
        <div>
          <dt>{t('profile.memberSince')}</dt>
          <dd>{formatDate(user.createdAt, i18n.language)}</dd>
        </div>
      </dl>

      <form
        className={styles.form}
        onSubmit={handleSubmit(async (values) => {
          await update({
            fullName: values.fullName,
            phone: values.phone?.trim() || undefined,
          })
        })}
      >
        <h2>{t('profile.editTitle')}</h2>
        <TextField
          label={t('auth.fullName')}
          error={errors.fullName ? t('validation.required') : undefined}
          {...register('fullName')}
        />
        <TextField label={t('auth.phone')} {...register('phone')} />

        {errorKey ? <p className={styles.error}>{t(errorKey)}</p> : null}
        {isSuccess && !isDirty ? (
          <p className={styles.success}>{t('profile.saved')}</p>
        ) : null}

        <div className={styles.actions}>
          <Button type="submit" disabled={isPending || !isDirty} className={styles.submit}>
            {t('profile.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={logout}>
            {t('nav.logout')}
          </Button>
        </div>
      </form>
    </div>
  )
}
