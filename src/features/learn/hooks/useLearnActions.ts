import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { learnService } from '@/features/learn/services/learnService'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { isAppError } from '@/shared/errors/AppError'
import { errorMessageKey } from '@/shared/utils/errorMessageKey'

export function useQuiz(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.learn.quiz(courseId),
    queryFn: () => learnService.getQuiz(courseId),
    enabled: Boolean(courseId),
  })
}

export function useSubmitQuiz(courseId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (answers: number[]) => learnService.submitQuiz(courseId, answers),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.courseProgress(courseId) })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.certificates })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.progress })
    },
  })

  return {
    submit: mutation.mutateAsync,
    isPending: mutation.isPending,
    result: mutation.data,
    errorKey:
      mutation.error && isAppError(mutation.error)
        ? errorMessageKey(mutation.error.code)
        : mutation.error
          ? 'errors.generic'
          : null,
  }
}

export function useCompleteLesson(courseId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (lessonId: string) => learnService.completeLesson(courseId, lessonId),
    onSuccess: async (result) => {
      queryClient.setQueryData(
        QUERY_KEYS.learn.courseProgress(courseId),
        (current: Awaited<ReturnType<typeof learnService.getCourseProgress>> | undefined) => {
          if (!current) return current
          return {
            ...current,
            enrollment: result.enrollment,
            certificate: result.certificate ?? current.certificate,
            lessons: current.lessons.map((lesson) => ({
              ...lesson,
              completed: result.enrollment.completedLessonIds.includes(lesson.id),
            })),
          }
        },
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.courseProgress(courseId) }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.progress }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.learn.certificates }),
      ])
    },
  })

  return {
    complete: mutation.mutateAsync,
    isPending: mutation.isPending,
    lastCertificate: mutation.data?.certificate ?? null,
    errorKey:
      mutation.error && isAppError(mutation.error)
        ? errorMessageKey(mutation.error.code)
        : mutation.error
          ? 'errors.generic'
          : null,
  }
}

export function useCertificates() {
  return useQuery({
    queryKey: QUERY_KEYS.learn.certificates,
    queryFn: () => learnService.listCertificates(),
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.learn.certificate(id),
    queryFn: () => learnService.getCertificate(id),
    enabled: Boolean(id),
  })
}
