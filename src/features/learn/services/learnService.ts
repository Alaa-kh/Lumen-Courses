import { learnApi } from '@/features/learn/api/learnApi'
import type {
  Certificate,
  CourseProgress,
  Enrollment,
  EnrollmentWithCourse,
  LessonContent,
  QuizAttemptResult,
  QuizPublic,
} from '@/features/learn/types/learn'
import { mapApiError } from '@/shared/errors/mapApiError'

export const learnService = {
  async enroll(courseId: string): Promise<Enrollment> {
    try {
      const { data } = await learnApi.enroll(courseId)
      return data.enrollment
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async completeLesson(
    courseId: string,
    lessonId: string,
  ): Promise<{ enrollment: Enrollment; certificate: Certificate | null }> {
    try {
      const { data } = await learnApi.completeLesson(courseId, lessonId)
      return data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getProgress(): Promise<EnrollmentWithCourse[]> {
    try {
      const { data } = await learnApi.getProgress()
      return data.enrollments
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    try {
      const { data } = await learnApi.getCourseProgress(courseId)
      return data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getLessonContent(lessonId: string): Promise<LessonContent> {
    try {
      const { data } = await learnApi.getLessonContent(lessonId)
      return data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getQuiz(courseId: string): Promise<QuizPublic> {
    try {
      const { data } = await learnApi.getQuiz(courseId)
      return data.quiz
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async submitQuiz(
    courseId: string,
    answers: number[],
  ): Promise<{ attempt: QuizAttemptResult; certificate: Certificate | null }> {
    try {
      const { data } = await learnApi.submitQuiz(courseId, answers)
      return data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async listCertificates(): Promise<Certificate[]> {
    try {
      const { data } = await learnApi.listCertificates()
      return data.certificates
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getCertificate(id: string): Promise<Certificate> {
    try {
      const { data } = await learnApi.getCertificate(id)
      return data.certificate
    } catch (error) {
      throw mapApiError(error)
    }
  },
}
