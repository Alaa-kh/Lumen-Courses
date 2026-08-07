import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import {
  findCertificateById,
  findCertificatesByUser,
  findCourseById,
  findEnrollment,
  findEnrollmentsByUser,
  findLessonById,
  findLessonsByCourse,
  findQuizAttempts,
  findQuizByCourse,
  findUserById,
  getDb,
  recalculateProgress,
} from '../data/db.js'
import {
  fetchAgenticMarkdown,
  isAgenticMarkdownUrl,
} from '../integrations/agenticSchool.js'
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js'

export const learnRouter = Router()

function courseSummary(courseId: string) {
  const course = findCourseById(courseId)
  if (!course) return null
  const instructor = findUserById(course.instructorId)
  const lessons = findLessonsByCourse(courseId)
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    thumbnailUrl: course.thumbnailUrl,
    instructorName: instructor?.fullName ?? 'Instructor',
    lessonCount: lessons.length,
  }
}

function maybeIssueCertificate(userId: string, courseId: string) {
  const enrollment = findEnrollment(userId, courseId)
  if (!enrollment) return null

  // Always recompute so a stale progressPercent cannot block issuance
  recalculateProgress(enrollment)
  if (enrollment.progressPercent < 100) return null

  const existing = getDb().certificates.find((c) => c.userId === userId && c.courseId === courseId)
  if (existing) return existing

  const certificate = {
    id: randomUUID(),
    userId,
    courseId,
    issuedAt: new Date().toISOString(),
    certificateCode: `LMN-${randomUUID().slice(0, 8).toUpperCase()}`,
  }
  getDb().certificates.push(certificate)
  return certificate
}

learnRouter.post('/enroll/:courseId', requireAuth, (req: AuthenticatedRequest, res) => {
  const course = findCourseById(req.params.courseId)
  if (!course) {
    res.status(404).json({ message: 'Course not found', code: 'NOT_FOUND' })
    return
  }

  const existing = findEnrollment(req.user!.id, course.id)
  if (existing) {
    res.json({ enrollment: existing, course: courseSummary(course.id) })
    return
  }

  const enrollment = {
    id: randomUUID(),
    userId: req.user!.id,
    courseId: course.id,
    completedLessonIds: [],
    enrolledAt: new Date().toISOString(),
    progressPercent: 0,
  }
  getDb().enrollments.push(enrollment)
  res.status(201).json({ enrollment, course: courseSummary(course.id) })
})

learnRouter.post(
  '/complete-lesson/:courseId/:lessonId',
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    const enrollment = findEnrollment(req.user!.id, req.params.courseId)
    if (!enrollment) {
      res.status(400).json({ message: 'Enroll in the course first', code: 'NOT_ENROLLED' })
      return
    }

    const lessons = findLessonsByCourse(req.params.courseId)
    const lesson = lessons.find((item) => item.id === req.params.lessonId)
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found', code: 'NOT_FOUND' })
      return
    }

    if (!enrollment.completedLessonIds.includes(lesson.id)) {
      enrollment.completedLessonIds.push(lesson.id)
    }
    recalculateProgress(enrollment)
    const certificate = maybeIssueCertificate(req.user!.id, req.params.courseId)

    res.json({
      enrollment,
      certificate,
    })
  },
)

learnRouter.get('/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const enrollments = findEnrollmentsByUser(req.user!.id).map((enrollment) => {
    const certificate = maybeIssueCertificate(enrollment.userId, enrollment.courseId)

    return {
      ...enrollment,
      course: courseSummary(enrollment.courseId),
      certificate,
    }
  })

  res.json({ enrollments })
})

learnRouter.get('/progress/:courseId', requireAuth, (req: AuthenticatedRequest, res) => {
  const enrollment = findEnrollment(req.user!.id, req.params.courseId)
  if (!enrollment) {
    res.status(404).json({ message: 'Not enrolled', code: 'NOT_ENROLLED' })
    return
  }

  const lessons = findLessonsByCourse(req.params.courseId)
  const quiz = findQuizByCourse(req.params.courseId)
  const attempts = findQuizAttempts(req.user!.id, req.params.courseId)
  const bestAttempt = attempts.reduce<(typeof attempts)[number] | null>((best, attempt) => {
    if (!best || attempt.score > best.score) return attempt
    return best
  }, null)
  const certificate = maybeIssueCertificate(req.user!.id, req.params.courseId)

  res.json({
    enrollment,
    course: courseSummary(req.params.courseId),
    lessons: lessons.map((lesson) => ({
      ...lesson,
      completed: enrollment.completedLessonIds.includes(lesson.id),
    })),
    quiz: quiz
      ? {
          id: quiz.id,
          title: quiz.title,
          passScore: quiz.passScore,
          questionCount: quiz.questions.length,
          bestScore: bestAttempt?.score ?? null,
          passed: Boolean(bestAttempt?.passed),
        }
      : null,
    certificate,
  })
})

learnRouter.get('/quiz/:courseId', requireAuth, (req: AuthenticatedRequest, res) => {
  const enrollment = findEnrollment(req.user!.id, req.params.courseId)
  if (!enrollment) {
    res.status(400).json({ message: 'Enroll in the course first', code: 'NOT_ENROLLED' })
    return
  }

  const quiz = findQuizByCourse(req.params.courseId)
  if (!quiz) {
    res.status(404).json({ message: 'Quiz not found', code: 'NOT_FOUND' })
    return
  }

  res.json({
    quiz: {
      id: quiz.id,
      courseId: quiz.courseId,
      title: quiz.title,
      passScore: quiz.passScore,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        options: question.options,
      })),
    },
  })
})

learnRouter.post('/quiz/:courseId/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  const enrollment = findEnrollment(req.user!.id, req.params.courseId)
  if (!enrollment) {
    res.status(400).json({ message: 'Enroll in the course first', code: 'NOT_ENROLLED' })
    return
  }

  const quiz = findQuizByCourse(req.params.courseId)
  if (!quiz) {
    res.status(404).json({ message: 'Quiz not found', code: 'NOT_FOUND' })
    return
  }

  const { answers } = req.body as { answers?: number[] }
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    res.status(400).json({ message: 'Answer every question', code: 'VALIDATION_ERROR' })
    return
  }

  let correct = 0
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) correct += 1
  })

  const score = Math.round((correct / quiz.questions.length) * 100)
  const passed = score >= quiz.passScore

  const attempt = {
    id: randomUUID(),
    userId: req.user!.id,
    courseId: req.params.courseId,
    quizId: quiz.id,
    score,
    passed,
    answers,
    attemptedAt: new Date().toISOString(),
  }
  getDb().quizAttempts.push(attempt)

  const certificate = maybeIssueCertificate(req.user!.id, req.params.courseId)

  res.json({
    attempt: {
      id: attempt.id,
      score: attempt.score,
      passed: attempt.passed,
      attemptedAt: attempt.attemptedAt,
    },
    certificate,
  })
})

learnRouter.get('/certificates', requireAuth, (req: AuthenticatedRequest, res) => {
  // Issue any missing certificates for courses already at 100%
  findEnrollmentsByUser(req.user!.id).forEach((enrollment) => {
    recalculateProgress(enrollment)
    maybeIssueCertificate(enrollment.userId, enrollment.courseId)
  })

  const certificates = findCertificatesByUser(req.user!.id).map((certificate) => ({
    ...certificate,
    course: courseSummary(certificate.courseId),
  }))
  res.json({ certificates })
})

learnRouter.get(
  '/lesson-content/:lessonId',
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const lesson = findLessonById(req.params.lessonId)
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found', code: 'NOT_FOUND' })
      return
    }

    const enrollment = findEnrollment(req.user!.id, lesson.courseId)
    if (!enrollment) {
      res.status(400).json({ message: 'Enroll in the course first', code: 'NOT_ENROLLED' })
      return
    }

    if (!isAgenticMarkdownUrl(lesson.videoUrl)) {
      res.json({
        contentType: 'video' as const,
        content: null,
        sourceUrl: lesson.videoUrl,
      })
      return
    }

    try {
      const content = await fetchAgenticMarkdown(lesson.videoUrl)
      res.json({
        contentType: 'markdown' as const,
        content,
        sourceUrl: lesson.videoUrl.replace(/\.md$/, ''),
      })
    } catch (error) {
      console.error(error)
      res.status(502).json({
        message: 'Could not load lesson content from Agentic School',
        code: 'UPSTREAM_ERROR',
      })
    }
  },
)

learnRouter.get('/certificates/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const certificate = findCertificateById(req.params.id)
  if (!certificate || certificate.userId !== req.user!.id) {
    res.status(404).json({ message: 'Certificate not found', code: 'NOT_FOUND' })
    return
  }

  const user = findUserById(certificate.userId)
  res.json({
    certificate: {
      ...certificate,
      studentName: user?.fullName ?? '',
      course: courseSummary(certificate.courseId),
    },
  })
})
