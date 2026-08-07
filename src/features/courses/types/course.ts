export type CourseCategory = 'programming' | 'design' | 'business' | 'languages'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  durationMinutes: number
  order: number
  completed?: boolean
}

export interface QuizSummary {
  id: string
  title: string
  passScore: number
  questionCount: number
  bestScore?: number | null
  passed?: boolean
}

export interface Course {
  id: string
  title: string
  description: string
  category: CourseCategory
  level: CourseLevel
  thumbnailUrl: string
  instructorId: string
  instructorName: string
  featured: boolean
  lessonCount: number
  totalDurationMinutes: number
  hasQuiz: boolean
  lessons?: Lesson[]
  quiz?: QuizSummary
  createdAt: string
  updatedAt: string
}

export interface CourseDto {
  id: string
  title: string
  description: string
  category: CourseCategory
  level: CourseLevel
  thumbnailUrl: string
  instructorId: string
  instructorName: string
  featured: boolean
  lessonCount: number
  totalDurationMinutes: number
  hasQuiz: boolean
  lessons?: Lesson[]
  quiz?: QuizSummary
  createdAt: string
  updatedAt: string
}

export interface CourseFilters {
  q?: string
  category?: CourseCategory | ''
  level?: CourseLevel | ''
  featured?: boolean
  page?: number
  pageSize?: number
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface CourseListResult {
  items: Course[]
  pagination: Pagination
}

export interface CreateLessonInput {
  title: string
  description: string
  videoUrl: string
  durationMinutes: number
}

export interface CreateCourseInput {
  title: string
  description: string
  category: CourseCategory
  level: CourseLevel
  thumbnailUrl: string
  featured?: boolean
  lessons: CreateLessonInput[]
}
