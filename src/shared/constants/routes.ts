export const ROUTES = {
  home: '/',
  courses: '/courses',
  courseDetail: '/courses/:id',
  learn: '/learn/:courseId',
  quiz: '/learn/:courseId/quiz',
  myLearning: '/my-learning',
  certificates: '/certificates',
  certificateDetail: '/certificates/:id',
  instructor: '/instructor',
  createCourse: '/instructor/courses/new',
  login: '/login',
  register: '/register',
  profile: '/profile',
  contact: '/contact',
} as const

export function courseDetailPath(id: string): string {
  return `/courses/${id}`
}

export function learnPath(courseId: string): string {
  return `/learn/${courseId}`
}

export function quizPath(courseId: string): string {
  return `/learn/${courseId}/quiz`
}

export function certificateDetailPath(id: string): string {
  return `/certificates/${id}`
}
