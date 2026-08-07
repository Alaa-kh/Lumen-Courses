import { apiClient } from '@/shared/api/apiClient'
import type { CourseDto, CourseFilters, CreateCourseInput } from '@/features/courses/types/course'

function toQuery(filters: CourseFilters): Record<string, string> {
  const query: Record<string, string> = {}
  if (filters.q) query.q = filters.q
  if (filters.category) query.category = filters.category
  if (filters.level) query.level = filters.level
  if (filters.featured) query.featured = 'true'
  if (filters.page) query.page = String(filters.page)
  if (filters.pageSize) query.pageSize = String(filters.pageSize)
  return query
}

export const coursesApi = {
  list(filters: CourseFilters = {}) {
    return apiClient.get<{
      items: CourseDto[]
      pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
      }
    }>('/courses', { params: toQuery(filters) })
  },
  getById(id: string) {
    return apiClient.get<{ course: CourseDto }>(`/courses/${id}`)
  },
  create(input: CreateCourseInput) {
    return apiClient.post<{ course: CourseDto }>('/courses', input)
  },
}
