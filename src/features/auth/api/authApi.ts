import { apiClient } from '@/shared/api/apiClient'
import type {
  AuthResponseDto,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserDto,
} from '@/features/auth/types/user'

export const authApi = {
  login(input: LoginInput) {
    return apiClient.post<AuthResponseDto>('/auth/login', input)
  },
  register(input: RegisterInput) {
    return apiClient.post<AuthResponseDto>('/auth/register', input)
  },
  me() {
    return apiClient.get<{ user: UserDto }>('/auth/me')
  },
  updateProfile(input: UpdateProfileInput) {
    return apiClient.patch<{ user: UserDto }>('/auth/me', input)
  },
  refresh(refreshToken: string) {
    return apiClient.post<AuthResponseDto>('/auth/refresh', { refreshToken })
  },
}
