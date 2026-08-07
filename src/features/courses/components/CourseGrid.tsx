import type { Course } from '@/features/courses/types/course'
import { CourseCard } from '@/features/courses/components/CourseCard'
import styles from '@/features/courses/components/CourseGrid.module.scss'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className={styles.grid}>
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} delayMs={index * 70} />
      ))}
    </div>
  )
}
