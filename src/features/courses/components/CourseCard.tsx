import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/features/courses/types/course'
import { Badge } from '@/shared/components/Badge/Badge'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { courseDetailPath } from '@/shared/constants/routes'
import styles from '@/features/courses/components/CourseCard.module.scss'

interface CourseCardProps {
  course: Course
  delayMs?: number
}

export function CourseCard({ course, delayMs = 0 }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <Reveal as="article" delayMs={delayMs} className={styles.card}>
      <Link to={courseDetailPath(course.id)} className={styles.link}>
        <div className={styles.media}>
          <img src={course.thumbnailUrl} alt="" loading="lazy" />
          {course.featured ? (
            <span className={styles.featured}>{t('courses.featuredBadge')}</span>
          ) : null}
        </div>
        <div className={styles.body}>
          <div className={styles.meta}>
            <Badge tone="accent">{t(`courses.categories.${course.category}`)}</Badge>
            <Badge>{t(`courses.levels.${course.level}`)}</Badge>
          </div>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className={styles.footer}>
            <span>{course.instructorName}</span>
            <span>
              {t('courses.lessonCount', { count: course.lessonCount })} ·{' '}
              {t('courses.duration', { minutes: course.totalDurationMinutes })}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
