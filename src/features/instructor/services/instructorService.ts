import { instructorApi } from '@/features/instructor/api/instructorApi'
import type {
  CourseEnrollmentRow,
  InstructorCourse,
  InstructorDashboard,
} from '@/features/instructor/types/instructor'
import { mapApiError } from '@/shared/errors/mapApiError'

export const instructorService = {
  async dashboard(): Promise<InstructorDashboard> {
    try {
      const { data } = await instructorApi.dashboard()
      return data
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async myCourses(): Promise<InstructorCourse[]> {
    try {
      const { data } = await instructorApi.myCourses()
      return data.courses
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async enrollments(courseId: string): Promise<CourseEnrollmentRow[]> {
    try {
      const { data } = await instructorApi.enrollments(courseId)
      return data.enrollments
    } catch (error) {
      throw mapApiError(error)
    }
  },
}
