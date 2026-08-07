import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/features/courses/services/coursesService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useCourse(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.courses.detail(id),
    queryFn: () => coursesService.getById(id),
    enabled: Boolean(id),
  })
}
