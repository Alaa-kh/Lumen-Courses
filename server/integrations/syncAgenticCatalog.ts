import {
  agenticCourseId,
  agenticLessonId,
  fetchAgenticCourses,
  mapAgenticCategory,
  mapAgenticLevel,
  parseDurationMinutes,
  thumbnailForIndex,
  type AgenticCourse,
} from '../integrations/agenticSchool.js'
import { getDb, recalculateProgress } from '../data/db.js'
import { randomUUID } from 'node:crypto'

function clearLearningData(): void {
  const db = getDb()
  db.courses = []
  db.lessons = []
  db.quizzes = []
  db.enrollments = []
  db.quizAttempts = []
  db.certificates = []
}

function upsertCourseFromAgentic(
  remote: AgenticCourse,
  index: number,
  instructorId: string,
  now: string,
): void {
  const db = getDb()
  const courseId = agenticCourseId(remote.slug)
  const minutesPerLesson =
    remote.lessonCount > 0 ? Math.round(remote.estimatedMinutes / remote.lessonCount) : 15

  db.courses.push({
    id: courseId,
    title: remote.title,
    description: remote.description,
    category: mapAgenticCategory(remote.tags ?? []),
    level: mapAgenticLevel(remote.level),
    thumbnailUrl: thumbnailForIndex(index),
    instructorId,
    featured: index < 3,
    createdAt: now,
    updatedAt: now,
  })

  const publishedLessons = (remote.lessons ?? [])
    .filter((lesson) => lesson.status === 'published')
    .slice()
    .sort((a, b) => a.order - b.order)

  publishedLessons.forEach((lesson, lessonIndex) => {
    db.lessons.push({
      id: agenticLessonId(lesson.slug),
      courseId,
      title: lesson.title,
      description: lesson.summary ?? lesson.outcome ?? remote.subtitle ?? '',
      // Markdown URL — player loads article content through the API proxy
      videoUrl: lesson.markdownUrl,
      durationMinutes: parseDurationMinutes(lesson, minutesPerLesson),
      order: lesson.order || lessonIndex + 1,
    })
  })
}

export async function syncAgenticCatalog(options: {
  instructorId: string
  studentId: string
}): Promise<{ courseCount: number; lessonCount: number }> {
  const remoteCourses = await fetchAgenticCourses(true)
  const now = new Date().toISOString()

  clearLearningData()

  remoteCourses
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((course, index) => {
      upsertCourseFromAgentic(course, index, options.instructorId, now)
    })

  const db = getDb()
  const firstCourse = db.courses[0]
  const firstLesson = db.lessons.find((lesson) => lesson.courseId === firstCourse?.id)

  if (firstCourse && firstLesson) {
    const enrollment = {
      id: randomUUID(),
      userId: options.studentId,
      courseId: firstCourse.id,
      completedLessonIds: [firstLesson.id],
      enrolledAt: now,
      progressPercent: 0,
    }
    recalculateProgress(enrollment)
    db.enrollments.push(enrollment)
  }

  return {
    courseCount: db.courses.length,
    lessonCount: db.lessons.length,
  }
}
