import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '@/app/store/hooks'
import { authService } from '@/features/auth/services/authService'
import { setUser } from '@/features/auth/store/authSlice'
import type { UpdateProfileInput } from '@/features/auth/types/user'
import { isAppError } from '@/shared/errors/AppError'
import { errorMessageKey } from '@/shared/utils/errorMessageKey'

export function useUpdateProfile() {
  const dispatch = useAppDispatch()

  const mutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (user) => {
      dispatch(setUser(user))
    },
  })

  return {
    update: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    errorKey:
      mutation.error && isAppError(mutation.error)
        ? errorMessageKey(mutation.error.code)
        : mutation.error
          ? 'errors.generic'
          : null,
  }
}
