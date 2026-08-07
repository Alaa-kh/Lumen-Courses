export interface Enrollment {
  id: string
  userId: string
  courseId: string
  completedLessonIds: string[]
  enrolledAt: string
  progressPercent: number
}

export interface CourseSummary {
  id: string
  title: string
  description: string
  category: string
  level: string
  thumbnailUrl: string
  instructorName: string
  lessonCount: number
}

export interface EnrollmentWithCourse extends Enrollment {
  course: CourseSummary | null
  certificate: Certificate | null
}

export interface ProgressLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  durationMinutes: number
  order: number
  completed: boolean
}

export interface CourseProgress {
  enrollment: Enrollment
  course: CourseSummary | null
  lessons: ProgressLesson[]
  quiz: {
    id: string
    title: string
    passScore: number
    questionCount: number
    bestScore: number | null
    passed: boolean
  } | null
  certificate: Certificate | null
}

export interface QuizQuestionPublic {
  id: string
  prompt: string
  options: string[]
}

export interface QuizPublic {
  id: string
  courseId: string
  title: string
  passScore: number
  questions: QuizQuestionPublic[]
}

export interface QuizAttemptResult {
  id: string
  score: number
  passed: boolean
  attemptedAt: string
}

export interface LessonContent {
  contentType: 'markdown' | 'video'
  content: string | null
  sourceUrl: string
}

export interface Certificate {
  id: string
  userId: string
  courseId: string
  issuedAt: string
  certificateCode: string
  studentName?: string
  course?: CourseSummary | null
}
