import { useQuery } from '@tanstack/react-query'
import { learnService } from '@/features/learn/services/learnService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'

export function useLessonContent(lessonId: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.learn.lessonContent(lessonId),
    queryFn: () => learnService.getLessonContent(lessonId),
    enabled: Boolean(lessonId) && enabled,
  })
}
