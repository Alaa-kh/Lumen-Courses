import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import {
  findCourseById,
  findLessonsByCourse,
  findQuizByCourse,
  findUserById,
  getDb,
} from '../data/db.js'
import {
  optionalAuth,
  requireAuth,
  requireInstructor,
  type AuthenticatedRequest,
} from '../middleware/auth.js'
import type { CourseCategory, CourseLevel, LessonRecord } from '../types.js'

export const coursesRouter = Router()

function serializeCourse(
  courseId: string,
  options: { includeLessons?: boolean; includeQuizSummary?: boolean } = {},
) {
  const course = findCourseById(courseId)
  if (!course) return null

  const instructor = findUserById(course.instructorId)
  const lessons = findLessonsByCourse(course.id)
  const quiz = findQuizByCourse(course.id)

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    thumbnailUrl: course.thumbnailUrl,
    instructorId: course.instructorId,
    instructorName: instructor?.fullName ?? 'Instructor',
    featured: course.featured,
    lessonCount: lessons.length,
    totalDurationMinutes: lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
    hasQuiz: Boolean(quiz),
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    ...(options.includeLessons
      ? {
          lessons: lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            durationMinutes: lesson.durationMinutes,
            order: lesson.order,
          })),
        }
      : {}),
    ...(options.includeQuizSummary && quiz
      ? {
          quiz: {
            id: quiz.id,
            title: quiz.title,
            passScore: quiz.passScore,
            questionCount: quiz.questions.length,
          },
        }
      : {}),
  }
}

coursesRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res) => {
  const {
    q,
    category,
    level,
    featured,
    page = '1',
    pageSize = '12',
  } = req.query as Record<string, string | undefined>

  let items = [...getDb().courses]

  if (q?.trim()) {
    const term = q.trim().toLowerCase()
    items = items.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term),
    )
  }

  if (category) {
    items = items.filter((course) => course.category === category)
  }

  if (level) {
    items = items.filter((course) => course.level === level)
  }

  if (featured === 'true') {
    items = items.filter((course) => course.featured)
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const pageNum = Math.max(1, Number(page) || 1)
  const size = Math.min(50, Math.max(1, Number(pageSize) || 12))
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / size))
  const start = (pageNum - 1) * size
  const pageItems = items.slice(start, start + size)

  res.json({
    items: pageItems.map((course) => serializeCourse(course.id)).filter(Boolean),
    pagination: {
      page: pageNum,
      pageSize: size,
      total,
      totalPages,
    },
  })
})

coursesRouter.get('/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const course = serializeCourse(req.params.id, {
    includeLessons: true,
    includeQuizSummary: true,
  })

  if (!course) {
    res.status(404).json({ message: 'Course not found', code: 'NOT_FOUND' })
    return
  }

  res.json({ course })
})

coursesRouter.post('/', requireAuth, requireInstructor, (req: AuthenticatedRequest, res) => {
  const {
    title,
    description,
    category,
    level,
    thumbnailUrl,
    featured,
    lessons,
  } = req.body as {
    title?: string
    description?: string
    category?: CourseCategory
    level?: CourseLevel
    thumbnailUrl?: string
    featured?: boolean
    lessons?: Array<{
      title?: string
      description?: string
      videoUrl?: string
      durationMinutes?: number
    }>
  }

  if (!title?.trim() || !description?.trim() || !category || !level || !thumbnailUrl?.trim()) {
    res.status(400).json({ message: 'Missing required course fields', code: 'VALIDATION_ERROR' })
    return
  }

  const validCategories: CourseCategory[] = ['programming', 'design', 'business', 'languages']
  const validLevels: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

  if (!validCategories.includes(category) || !validLevels.includes(level)) {
    res.status(400).json({ message: 'Invalid category or level', code: 'VALIDATION_ERROR' })
    return
  }

  const now = new Date().toISOString()
  const courseId = randomUUID()
  const db = getDb()

  db.courses.push({
    id: courseId,
    title: title.trim(),
    description: description.trim(),
    category,
    level,
    thumbnailUrl: thumbnailUrl.trim(),
    instructorId: req.user!.id,
    featured: Boolean(featured),
    createdAt: now,
    updatedAt: now,
  })

  const lessonInputs = Array.isArray(lessons) ? lessons : []
  lessonInputs.forEach((lesson, index) => {
    if (!lesson.title?.trim() || !lesson.videoUrl?.trim()) return
    const record: LessonRecord = {
      id: randomUUID(),
      courseId,
      title: lesson.title.trim(),
      description: lesson.description?.trim() || '',
      videoUrl: lesson.videoUrl.trim(),
      durationMinutes: Math.max(1, Number(lesson.durationMinutes) || 10),
      order: index + 1,
    }
    db.lessons.push(record)
  })

  res.status(201).json({
    course: serializeCourse(courseId, { includeLessons: true, includeQuizSummary: true }),
  })
})

coursesRouter.patch('/:id', requireAuth, requireInstructor, (req: AuthenticatedRequest, res) => {
  const course = findCourseById(req.params.id)
  if (!course) {
    res.status(404).json({ message: 'Course not found', code: 'NOT_FOUND' })
    return
  }

  if (course.instructorId !== req.user!.id) {
    res.status(403).json({ message: 'You can only update your own courses', code: 'FORBIDDEN' })
    return
  }

  const { title, description, category, level, thumbnailUrl, featured } = req.body as {
    title?: string
    description?: string
    category?: CourseCategory
    level?: CourseLevel
    thumbnailUrl?: string
    featured?: boolean
  }

  if (title?.trim()) course.title = title.trim()
  if (description?.trim()) course.description = description.trim()
  if (category) course.category = category
  if (level) course.level = level
  if (thumbnailUrl?.trim()) course.thumbnailUrl = thumbnailUrl.trim()
  if (typeof featured === 'boolean') course.featured = featured
  course.updatedAt = new Date().toISOString()

  res.json({
    course: serializeCourse(course.id, { includeLessons: true, includeQuizSummary: true }),
  })
})
