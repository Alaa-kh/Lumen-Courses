import { useQuery } from '@tanstack/react-query'
import { instructorService } from '@/features/instructor/services/instructorService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useInstructorDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.instructor.dashboard,
    queryFn: () => instructorService.dashboard(),
  })
}
