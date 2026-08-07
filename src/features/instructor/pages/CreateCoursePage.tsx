import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCreateCourse } from '@/features/courses/hooks/useCreateCourse'
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/courses/utils/courseSchemas'
import { Button } from '@/shared/components/Button/Button'
import { SelectField } from '@/shared/components/SelectField/SelectField'
import { TextField } from '@/shared/components/TextField/TextField'
import { ROUTES } from '@/shared/constants/routes'
import styles from '@/features/instructor/pages/CreateCoursePage.module.scss'

export function CreateCoursePage() {
  const { t } = useTranslation()
  const { create, isPending, errorKey } = useCreateCourse()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'programming',
      level: 'beginner',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
      featured: false,
      lesson1Title: '',
      lesson1Video: 'https://www.youtube.com/embed/BwuLxPH8IDs',
      lesson1Duration: 10,
      lesson2Title: '',
      lesson2Video: '',
      lesson2Duration: 10,
    },
  })

  return (
    <div className={`container page ${styles.page}`}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>{t('instructor.createKicker')}</p>
          <h1>{t('instructor.createCourse')}</h1>
          <p>{t('instructor.createSubtitle')}</p>
        </div>
        <Link to={ROUTES.instructor} className={styles.back}>
          {t('instructor.backToDashboard')}
        </Link>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(async (values) => {
          const lessons = [
            {
              title: values.lesson1Title,
              description: values.lesson1Title,
              videoUrl: values.lesson1Video,
              durationMinutes: values.lesson1Duration,
            },
          ]
          if (values.lesson2Title?.trim() && values.lesson2Video?.trim()) {
            lessons.push({
              title: values.lesson2Title.trim(),
              description: values.lesson2Title.trim(),
              videoUrl: values.lesson2Video.trim(),
              durationMinutes: values.lesson2Duration || 10,
            })
          }
          await create({
            title: values.title,
            description: values.description,
            category: values.category,
            level: values.level,
            thumbnailUrl: values.thumbnailUrl,
            featured: Boolean(values.featured),
            lessons,
          })
        })}
      >
        <TextField
          label={t('instructor.fields.title')}
          error={errors.title ? t('validation.required') : undefined}
          {...register('title')}
        />
        <TextField
          label={t('instructor.fields.description')}
          error={errors.description ? t('validation.required') : undefined}
          {...register('description')}
        />
        <SelectField
          label={t('courses.category')}
          options={[
            { value: 'programming', label: t('courses.categories.programming') },
            { value: 'design', label: t('courses.categories.design') },
            { value: 'business', label: t('courses.categories.business') },
            { value: 'languages', label: t('courses.categories.languages') },
          ]}
          {...register('category')}
        />
        <SelectField
          label={t('courses.level')}
          options={[
            { value: 'beginner', label: t('courses.levels.beginner') },
            { value: 'intermediate', label: t('courses.levels.intermediate') },
            { value: 'advanced', label: t('courses.levels.advanced') },
          ]}
          {...register('level')}
        />
        <TextField
          label={t('instructor.fields.thumbnail')}
          error={errors.thumbnailUrl ? t('validation.url') : undefined}
          {...register('thumbnailUrl')}
        />
        <TextField
          label={t('instructor.fields.lesson1Title')}
          error={errors.lesson1Title ? t('validation.required') : undefined}
          {...register('lesson1Title')}
        />
        <TextField
          label={t('instructor.fields.lesson1Video')}
          error={errors.lesson1Video ? t('validation.url') : undefined}
          {...register('lesson1Video')}
        />
        <TextField
          label={t('instructor.fields.lesson1Duration')}
          type="number"
          {...register('lesson1Duration')}
        />
        <TextField label={t('instructor.fields.lesson2Title')} {...register('lesson2Title')} />
        <TextField label={t('instructor.fields.lesson2Video')} {...register('lesson2Video')} />
        <TextField
          label={t('instructor.fields.lesson2Duration')}
          type="number"
          {...register('lesson2Duration')}
        />

        {errorKey ? <p className={styles.error}>{t(errorKey)}</p> : null}

        <Button type="submit" disabled={isPending} className={styles.submit}>
          {t('instructor.submitCourse')}
        </Button>
      </form>
    </div>
  )
}
