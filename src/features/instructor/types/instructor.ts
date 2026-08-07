export interface InstructorStats {
  courseCount: number
  enrollmentCount: number
  certificateCount: number
  averageProgress: number
}

export interface InstructorCourse {
  id: string
  title: string
  category: string
  level: string
  thumbnailUrl: string
  featured: boolean
  lessonCount: number
  enrollmentCount: number
  updatedAt: string
  description?: string
  createdAt?: string
}

export interface InstructorDashboard {
  stats: InstructorStats
  courses: InstructorCourse[]
}

export interface CourseEnrollmentRow {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  progressPercent: number
  enrolledAt: string
  completedLessonCount: number
}
