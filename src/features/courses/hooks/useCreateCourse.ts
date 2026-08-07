import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { coursesService } from '@/features/courses/services/coursesService'
import type { CreateCourseInput } from '@/features/courses/types/course'
import { courseDetailPath } from '@/shared/constants/routes'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { isAppError } from '@/shared/errors/AppError'
import { errorMessageKey } from '@/shared/utils/errorMessageKey'

export function useCreateCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (input: CreateCourseInput) => coursesService.create(input),
    onSuccess: async (course) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.instructor.dashboard })
      navigate(courseDetailPath(course.id))
    },
  })

  return {
    create: mutation.mutateAsync,
    isPending: mutation.isPending,
    errorKey:
      mutation.error && isAppError(mutation.error)
        ? errorMessageKey(mutation.error.code)
        : mutation.error
          ? 'errors.generic'
          : null,
  }
}
