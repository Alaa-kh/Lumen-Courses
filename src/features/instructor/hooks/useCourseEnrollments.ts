import { useQuery } from '@tanstack/react-query'
import { instructorService } from '@/features/instructor/services/instructorService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useCourseEnrollments(courseId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.instructor.enrollments(courseId ?? 'none'),
    queryFn: () => instructorService.enrollments(courseId!),
    enabled: Boolean(courseId),
  })
}
