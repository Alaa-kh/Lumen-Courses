import type { Course, CourseDto } from '@/features/courses/types/course'

export function mapCourseDto(dto: CourseDto): Course {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    level: dto.level,
    thumbnailUrl: dto.thumbnailUrl,
    instructorId: dto.instructorId,
    instructorName: dto.instructorName,
    featured: dto.featured,
    lessonCount: dto.lessonCount,
    totalDurationMinutes: dto.totalDurationMinutes,
    hasQuiz: dto.hasQuiz,
    lessons: dto.lessons,
    quiz: dto.quiz,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}
