import { apiClient } from '@/shared/api/apiClient'
import type {
  CourseEnrollmentRow,
  InstructorCourse,
  InstructorDashboard,
} from '@/features/instructor/types/instructor'

export const instructorApi = {
  dashboard() {
    return apiClient.get<InstructorDashboard>('/instructor/dashboard')
  },
  myCourses() {
    return apiClient.get<{ courses: InstructorCourse[] }>('/instructor/courses')
  },
  enrollments(courseId: string) {
    return apiClient.get<{ courseId: string; enrollments: CourseEnrollmentRow[] }>(
      `/instructor/courses/${courseId}/enrollments`,
    )
  },
}
