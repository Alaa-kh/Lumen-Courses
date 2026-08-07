import { coursesApi } from '@/features/courses/api/coursesApi'
import type {
  Course,
  CourseFilters,
  CourseListResult,
  CreateCourseInput,
} from '@/features/courses/types/course'
import { mapCourseDto } from '@/features/courses/utils/mappers'
import { mapApiError } from '@/shared/errors/mapApiError'

export const coursesService = {
  async list(filters: CourseFilters = {}): Promise<CourseListResult> {
    try {
      const { data } = await coursesApi.list(filters)
      return {
        items: data.items.map(mapCourseDto),
        pagination: data.pagination,
      }
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async getById(id: string): Promise<Course> {
    try {
      const { data } = await coursesApi.getById(id)
      return mapCourseDto(data.course)
    } catch (error) {
      throw mapApiError(error)
    }
  },

  async create(input: CreateCourseInput): Promise<Course> {
    try {
      const { data } = await coursesApi.create(input)
      return mapCourseDto(data.course)
    } catch (error) {
      throw mapApiError(error)
    }
  },
}
