import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { learnService } from '@/features/learn/services/learnService'
import { learnPath } from '@/shared/constants/routes'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { isAppError } from '@/shared/errors/AppError'
import { errorMessageKey } from '@/shared/utils/errorMessageKey'

export function useEnroll() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (courseId: string) => learnService.enroll(courseId),
    onSuccess: async (_data, courseId) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.progress })
      navigate(learnPath(courseId))
    },
  })

  return {
    enroll: mutation.mutateAsync,
    isPending: mutation.isPending,
    errorKey:
      mutation.error && isAppError(mutation.error)
        ? errorMessageKey(mutation.error.code)
        : mutation.error
          ? 'errors.generic'
          : null,
  }
}
