import { apiClient } from '@/shared/api/apiClient'
import type {
  Certificate,
  CourseProgress,
  Enrollment,
  EnrollmentWithCourse,
  LessonContent,
  QuizAttemptResult,
  QuizPublic,
} from '@/features/learn/types/learn'

export const learnApi = {
  enroll(courseId: string) {
    return apiClient.post<{ enrollment: Enrollment }>('/learn/enroll/' + courseId)
  },
  completeLesson(courseId: string, lessonId: string) {
    return apiClient.post<{ enrollment: Enrollment; certificate: Certificate | null }>(
      `/learn/complete-lesson/${courseId}/${lessonId}`,
    )
  },
  getProgress() {
    return apiClient.get<{ enrollments: EnrollmentWithCourse[] }>('/learn/progress')
  },
  getCourseProgress(courseId: string) {
    return apiClient.get<CourseProgress>(`/learn/progress/${courseId}`)
  },
  getLessonContent(lessonId: string) {
    return apiClient.get<LessonContent>(`/learn/lesson-content/${lessonId}`)
  },
  getQuiz(courseId: string) {
    return apiClient.get<{ quiz: QuizPublic }>(`/learn/quiz/${courseId}`)
  },
  submitQuiz(courseId: string, answers: number[]) {
    return apiClient.post<{ attempt: QuizAttemptResult; certificate: Certificate | null }>(
      `/learn/quiz/${courseId}/submit`,
      { answers },
    )
  },
  listCertificates() {
    return apiClient.get<{ certificates: Certificate[] }>('/learn/certificates')
  },
  getCertificate(id: string) {
    return apiClient.get<{ certificate: Certificate }>(`/learn/certificates/${id}`)
  },
}
