import type { CourseFilters } from '@/features/courses/types/course'

export const QUERY_KEYS = {
  courses: {
    all: ['courses'] as const,
    list: (filters: CourseFilters) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
  },
  learn: {
    progress: ['learn', 'progress'] as const,
    courseProgress: (courseId: string) => ['learn', 'progress', courseId] as const,
    lessonContent: (lessonId: string) => ['learn', 'lesson-content', lessonId] as const,
    quiz: (courseId: string) => ['learn', 'quiz', courseId] as const,
    certificates: ['learn', 'certificates', 'list'] as const,
    certificate: (id: string) => ['learn', 'certificates', 'detail', id] as const,
  },
  instructor: {
    dashboard: ['instructor', 'dashboard'] as const,
    courses: ['instructor', 'courses'] as const,
    enrollments: (courseId: string) => ['instructor', 'enrollments', courseId] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
} as const
