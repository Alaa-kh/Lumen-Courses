import { useQuery } from '@tanstack/react-query'
import { learnService } from '@/features/learn/services/learnService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useMyProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.learn.progress,
    queryFn: () => learnService.getProgress(),
  })
}

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.learn.courseProgress(courseId),
    queryFn: () => learnService.getCourseProgress(courseId),
    enabled: Boolean(courseId),
    retry: false,
  })
}
