export type UserRole = 'student' | 'instructor'

export type CourseCategory = 'programming' | 'design' | 'business' | 'languages'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface UserRecord {
  id: string
  email: string
  passwordHash: string
  fullName: string
  role: UserRole
  phone: string | null
  createdAt: string
}

export interface LessonRecord {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl: string
  durationMinutes: number
  order: number
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
}

export interface QuizRecord {
  id: string
  courseId: string
  title: string
  passScore: number
  questions: QuizQuestion[]
}

export interface CourseRecord {
  id: string
  title: string
  description: string
  category: CourseCategory
  level: CourseLevel
  thumbnailUrl: string
  instructorId: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface EnrollmentRecord {
  id: string
  userId: string
  courseId: string
  completedLessonIds: string[]
  enrolledAt: string
  progressPercent: number
}

export interface QuizAttemptRecord {
  id: string
  userId: string
  courseId: string
  quizId: string
  score: number
  passed: boolean
  answers: number[]
  attemptedAt: string
}

export interface CertificateRecord {
  id: string
  userId: string
  courseId: string
  issuedAt: string
  certificateCode: string
}

export interface Database {
  users: UserRecord[]
  courses: CourseRecord[]
  lessons: LessonRecord[]
  quizzes: QuizRecord[]
  enrollments: EnrollmentRecord[]
  quizAttempts: QuizAttemptRecord[]
  certificates: CertificateRecord[]
}
