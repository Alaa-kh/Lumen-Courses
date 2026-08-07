import { Router } from 'express'
import {
  findCourseById,
  findLessonsByCourse,
  findUserById,
  getDb,
} from '../data/db.js'
import { requireAuth, requireInstructor, type AuthenticatedRequest } from '../middleware/auth.js'

export const instructorRouter = Router()

instructorRouter.use(requireAuth, requireInstructor)

instructorRouter.get('/dashboard', (req: AuthenticatedRequest, res) => {
  const courses = getDb().courses.filter((course) => course.instructorId === req.user!.id)
  const courseIds = new Set(courses.map((course) => course.id))
  const enrollments = getDb().enrollments.filter((enrollment) => courseIds.has(enrollment.courseId))
  const certificates = getDb().certificates.filter((certificate) =>
    courseIds.has(certificate.courseId),
  )

  const avgProgress =
    enrollments.length === 0
      ? 0
      : Math.round(
          enrollments.reduce((sum, enrollment) => sum + enrollment.progressPercent, 0) /
            enrollments.length,
        )

  res.json({
    stats: {
      courseCount: courses.length,
      enrollmentCount: enrollments.length,
      certificateCount: certificates.length,
      averageProgress: avgProgress,
    },
    courses: courses.map((course) => {
      const lessons = findLessonsByCourse(course.id)
      const courseEnrollments = enrollments.filter((e) => e.courseId === course.id)
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl,
        featured: course.featured,
        lessonCount: lessons.length,
        enrollmentCount: courseEnrollments.length,
        updatedAt: course.updatedAt,
      }
    }),
  })
})

instructorRouter.get('/courses', (req: AuthenticatedRequest, res) => {
  const courses = getDb()
    .courses.filter((course) => course.instructorId === req.user!.id)
    .map((course) => {
      const lessons = findLessonsByCourse(course.id)
      const enrollmentCount = getDb().enrollments.filter((e) => e.courseId === course.id).length
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl,
        featured: course.featured,
        lessonCount: lessons.length,
        enrollmentCount,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }
    })

  res.json({ courses })
})

instructorRouter.get('/courses/:id/enrollments', (req: AuthenticatedRequest, res) => {
  const course = findCourseById(req.params.id)
  if (!course || course.instructorId !== req.user!.id) {
    res.status(404).json({ message: 'Course not found', code: 'NOT_FOUND' })
    return
  }

  const enrollments = getDb()
    .enrollments.filter((enrollment) => enrollment.courseId === course.id)
    .map((enrollment) => {
      const student = findUserById(enrollment.userId)
      return {
        id: enrollment.id,
        userId: enrollment.userId,
        studentName: student?.fullName ?? 'Student',
        studentEmail: student?.email ?? '',
        progressPercent: enrollment.progressPercent,
        enrolledAt: enrollment.enrolledAt,
        completedLessonCount: enrollment.completedLessonIds.length,
      }
    })

  res.json({ courseId: course.id, enrollments })
})
