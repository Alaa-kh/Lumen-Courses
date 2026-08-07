import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/features/courses/services/coursesService'
import type { CourseFilters } from '@/features/courses/types/course'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useCoursesList(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.courses.list(filters),
    queryFn: () => coursesService.list(filters),
  })
}
