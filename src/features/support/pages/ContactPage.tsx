import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/Button/Button'
import { PageHeader } from '@/shared/components/PageHeader/PageHeader'
import { TextField } from '@/shared/components/TextField/TextField'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import styles from '@/features/support/pages/ContactPage.module.scss'

const contactSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(8),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactPage() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  return (
    <div className={`container page ${styles.page}`}>
      <PageHeader
        kicker={t('contact.kicker')}
        title={t('contact.title')}
        description={t('contact.subtitle')}
      />

      <div className={styles.grid}>
        <Reveal as="aside" className={styles.info} variant="left" delayMs={60}>
          <div>
            <p className={styles.infoLabel}>{t('contact.emailLabel')}</p>
            <a className={styles.infoValue} href="mailto:hello@lumen.app">
              hello@lumen.app
            </a>
          </div>
          <div>
            <p className={styles.infoLabel}>{t('contact.hoursLabel')}</p>
            <p className={styles.infoValue}>{t('footer.hours')}</p>
          </div>
          <div>
            <p className={styles.infoLabel}>{t('contact.responseLabel')}</p>
            <p className={styles.infoValue}>{t('contact.responseBody')}</p>
          </div>
        </Reveal>

        <Reveal variant="right" delayMs={120}>
          <form
            className={styles.form}
            noValidate
            onSubmit={handleSubmit(async () => {
              await new Promise((resolve) => window.setTimeout(resolve, 450))
              setSent(true)
              reset()
            })}
          >
          <h2>{t('contact.formTitle')}</h2>

          <TextField
            label={t('contact.fields.name')}
            autoComplete="name"
            error={errors.fullName ? t('validation.required') : undefined}
            {...register('fullName')}
          />
          <TextField
            label={t('contact.fields.email')}
            type="email"
            autoComplete="email"
            error={errors.email ? t('validation.email') : undefined}
            {...register('email')}
          />
          <TextField
            label={t('contact.fields.subject')}
            error={errors.subject ? t('validation.required') : undefined}
            {...register('subject')}
          />

          <label className={styles.messageField} htmlFor="contact-message">
            <span className={styles.messageLabel}>{t('contact.fields.message')}</span>
            <textarea
              id="contact-message"
              className={styles.textarea}
              rows={6}
              aria-invalid={Boolean(errors.message)}
              {...register('message')}
            />
            {errors.message ? (
              <span className={styles.messageError} role="alert">
                {t('validation.required')}
              </span>
            ) : null}
          </label>

          {sent ? <p className={styles.success}>{t('contact.success')}</p> : null}

          <Button type="submit" disabled={isSubmitting} className={styles.submit}>
            {t('contact.submit')}
          </Button>
        </form>
        </Reveal>
      </div>
    </div>
  )
}
