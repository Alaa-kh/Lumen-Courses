import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import type {
  CertificateRecord,
  CourseRecord,
  Database,
  EnrollmentRecord,
  LessonRecord,
  QuizAttemptRecord,
  QuizRecord,
  UserRecord,
} from '../types.js'

const db: Database = {
  users: [],
  courses: [],
  lessons: [],
  quizzes: [],
  enrollments: [],
  quizAttempts: [],
  certificates: [],
}

let seeded = false

export function getDb(): Database {
  return db
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): UserRecord | undefined {
  return db.users.find((user) => user.id === id)
}

export function findCourseById(id: string): CourseRecord | undefined {
  return db.courses.find((course) => course.id === id)
}

export function findLessonsByCourse(courseId: string): LessonRecord[] {
  return db.lessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((a, b) => a.order - b.order)
}

export function findLessonById(lessonId: string): LessonRecord | undefined {
  return db.lessons.find((lesson) => lesson.id === lessonId)
}

export function findQuizByCourse(courseId: string): QuizRecord | undefined {
  return db.quizzes.find((quiz) => quiz.courseId === courseId)
}

export function findEnrollment(userId: string, courseId: string): EnrollmentRecord | undefined {
  return db.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
}

export function findEnrollmentsByUser(userId: string): EnrollmentRecord[] {
  return db.enrollments.filter((e) => e.userId === userId)
}

export function findCertificatesByUser(userId: string): CertificateRecord[] {
  return db.certificates.filter((c) => c.userId === userId)
}

export function findCertificateById(id: string): CertificateRecord | undefined {
  return db.certificates.find((c) => c.id === id)
}

export function findQuizAttempts(userId: string, courseId: string): QuizAttemptRecord[] {
  return db.quizAttempts.filter((a) => a.userId === userId && a.courseId === courseId)
}

export function recalculateProgress(enrollment: EnrollmentRecord): void {
  const lessons = findLessonsByCourse(enrollment.courseId)
  if (lessons.length === 0) {
    enrollment.progressPercent = 0
    return
  }
  const completed = enrollment.completedLessonIds.filter((id) =>
    lessons.some((lesson) => lesson.id === id),
  ).length
  enrollment.progressPercent = Math.round((completed / lessons.length) * 100)
}

export function seedDatabase(): void {
  if (seeded) return

  const passwordHash = bcrypt.hashSync('Password123!', 10)
  const now = new Date().toISOString()

  const instructor: UserRecord = {
    id: randomUUID(),
    email: 'instructor@lumen.app',
    passwordHash,
    fullName: 'Maya Al-Rashid',
    role: 'instructor',
    phone: '+966501112233',
    createdAt: now,
  }

  const student: UserRecord = {
    id: randomUUID(),
    email: 'student@lumen.app',
    passwordHash,
    fullName: 'Omar Farhat',
    role: 'student',
    phone: '+966509998877',
    createdAt: now,
  }

  db.users.push(instructor, student)

  type SeedCourse = {
    title: string
    description: string
    category: CourseRecord['category']
    level: CourseRecord['level']
    thumbnailUrl: string
    featured: boolean
    lessons: Array<{
      title: string
      description: string
      videoUrl: string
      durationMinutes: number
    }>
    quiz: {
      title: string
      passScore: number
      questions: Array<{ prompt: string; options: string[]; correctIndex: number }>
    }
  }

  const seedCourses: SeedCourse[] = [
    {
      title: 'TypeScript Fundamentals',
      description:
        'Build confidence with types, interfaces, generics, and modern tooling so you ship safer React and Node apps.',
      category: 'programming',
      level: 'beginner',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
      featured: true,
      lessons: [
        {
          title: 'Why TypeScript',
          description: 'Understand the value of static typing in JavaScript projects.',
          videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs',
          durationMinutes: 12,
        },
        {
          title: 'Types and Interfaces',
          description: 'Model data with primitives, unions, and interfaces.',
          videoUrl: 'https://www.youtube.com/embed/ahCwqrYpLTQ',
          durationMinutes: 18,
        },
        {
          title: 'Generics in Practice',
          description: 'Write reusable functions and components with generics.',
          videoUrl: 'https://www.youtube.com/embed/nViEqpgwxHE',
          durationMinutes: 16,
        },
      ],
      quiz: {
        title: 'TypeScript Basics Quiz',
        passScore: 70,
        questions: [
          {
            prompt: 'What does TypeScript compile to?',
            options: ['Python', 'JavaScript', 'Rust', 'Bytecode'],
            correctIndex: 1,
          },
          {
            prompt: 'Which keyword defines a reusable shape for objects?',
            options: ['class', 'enum', 'interface', 'module'],
            correctIndex: 2,
          },
          {
            prompt: 'Generics help you…',
            options: ['Style CSS', 'Write reusable typed code', 'Deploy servers', 'Encrypt tokens'],
            correctIndex: 1,
          },
        ],
      },
    },
    {
      title: 'UI Design Systems',
      description:
        'Learn how to craft consistent interfaces with tokens, typography, spacing, and accessible components.',
      category: 'design',
      level: 'intermediate',
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
      featured: true,
      lessons: [
        {
          title: 'Design Tokens',
          description: 'Centralize color, type, and spacing decisions.',
          videoUrl: 'https://www.youtube.com/embed/wNLQd_ARsrk',
          durationMinutes: 14,
        },
        {
          title: 'Component Patterns',
          description: 'Compose reusable UI building blocks.',
          videoUrl: 'https://www.youtube.com/embed/N2nFRniH1P8',
          durationMinutes: 20,
        },
        {
          title: 'Accessibility Basics',
          description: 'Build inclusive interfaces with semantic HTML.',
          videoUrl: 'https://www.youtube.com/embed/zptH7k8TzA4',
          durationMinutes: 15,
        },
      ],
      quiz: {
        title: 'Design Systems Quiz',
        passScore: 70,
        questions: [
          {
            prompt: 'Design tokens typically store…',
            options: ['Database rows', 'Visual design decisions', 'JWT secrets', 'Build logs'],
            correctIndex: 1,
          },
          {
            prompt: 'A primary goal of a design system is…',
            options: ['Consistency', 'Larger bundles', 'More meetings', 'Hardcoded colors'],
            correctIndex: 0,
          },
        ],
      },
    },
    {
      title: 'Product Strategy Essentials',
      description:
        'Prioritize roadmaps, talk to customers, and ship outcomes that matter for growing products.',
      category: 'business',
      level: 'beginner',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      featured: true,
      lessons: [
        {
          title: 'Problem Discovery',
          description: 'Find the real problem before building solutions.',
          videoUrl: 'https://www.youtube.com/embed/Wj4tX2oGq8U',
          durationMinutes: 13,
        },
        {
          title: 'Prioritization Frameworks',
          description: 'Use RICE and impact/effort to choose what to build.',
          videoUrl: 'https://www.youtube.com/embed/iRaai1IBlB0',
          durationMinutes: 17,
        },
      ],
      quiz: {
        title: 'Product Strategy Quiz',
        passScore: 60,
        questions: [
          {
            prompt: 'Good product discovery starts with…',
            options: ['Shipping UI first', 'Understanding the problem', 'Hiring more PMs', 'Writing OKRs only'],
            correctIndex: 1,
          },
          {
            prompt: 'RICE stands for Reach, Impact, Confidence, and…',
            options: ['Effort', 'Energy', 'Equity', 'Excellence'],
            correctIndex: 0,
          },
        ],
      },
    },
    {
      title: 'Conversational Arabic for Work',
      description:
        'Practice workplace phrases, polite requests, and meeting language for bilingual teams.',
      category: 'languages',
      level: 'beginner',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080800-b6f7e35697e1?w=1200&q=80',
      featured: true,
      lessons: [
        {
          title: 'Greetings and Introductions',
          description: 'Open conversations confidently.',
          videoUrl: 'https://www.youtube.com/embed/OuVr66iUx9w',
          durationMinutes: 11,
        },
        {
          title: 'Meetings and Updates',
          description: 'Share progress and ask clarifying questions.',
          videoUrl: 'https://www.youtube.com/embed/KKz8tS6y_5A',
          durationMinutes: 14,
        },
        {
          title: 'Polite Requests',
          description: 'Ask for help and give feedback respectfully.',
          videoUrl: 'https://www.youtube.com/embed/oFZzke0y5sI',
          durationMinutes: 12,
        },
      ],
      quiz: {
        title: 'Arabic Essentials Quiz',
        passScore: 70,
        questions: [
          {
            prompt: 'A common greeting in Arabic is…',
            options: ['Bonjour', 'Marhaba', 'Hola', 'Ciao'],
            correctIndex: 1,
          },
          {
            prompt: 'In meetings, clarifying questions help you…',
            options: ['Avoid listening', 'Confirm understanding', 'Skip notes', 'End early always'],
            correctIndex: 1,
          },
        ],
      },
    },
    {
      title: 'React Performance Patterns',
      description:
        'Profile renders, avoid unnecessary work, and keep interfaces responsive as apps grow.',
      category: 'programming',
      level: 'advanced',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
      featured: false,
      lessons: [
        {
          title: 'Measuring Before Optimizing',
          description: 'Use the Profiler to find real bottlenecks.',
          videoUrl: 'https://www.youtube.com/embed/7YhdqIR2YMQ',
          durationMinutes: 15,
        },
        {
          title: 'Lists and Virtualization',
          description: 'Keep long lists smooth without premature memoization.',
          videoUrl: 'https://www.youtube.com/embed/IKdweNeRWyQ',
          durationMinutes: 18,
        },
      ],
      quiz: {
        title: 'React Performance Quiz',
        passScore: 70,
        questions: [
          {
            prompt: 'You should optimize…',
            options: ['Everything by default', 'After measuring', 'Only CSS', 'Never'],
            correctIndex: 1,
          },
          {
            prompt: 'Virtualization helps with…',
            options: ['Long lists', 'JWT refresh', 'i18n keys', 'SCSS modules'],
            correctIndex: 0,
          },
        ],
      },
    },
    {
      title: 'Visual Brand Storytelling',
      description:
        'Shape narratives with imagery, hierarchy, and motion that support learning experiences.',
      category: 'design',
      level: 'advanced',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      featured: false,
      lessons: [
        {
          title: 'Visual Hierarchy',
          description: 'Guide attention with type and contrast.',
          videoUrl: 'https://www.youtube.com/embed/9ZUqi10Z0xw',
          durationMinutes: 13,
        },
        {
          title: 'Motion with Purpose',
          description: 'Use animation to clarify, not distract.',
          videoUrl: 'https://www.youtube.com/embed/TMe0WnfZ-qE',
          durationMinutes: 16,
        },
      ],
      quiz: {
        title: 'Brand Storytelling Quiz',
        passScore: 60,
        questions: [
          {
            prompt: 'Motion should primarily…',
            options: ['Add noise', 'Clarify hierarchy', 'Slow navigation', 'Replace content'],
            correctIndex: 1,
          },
        ],
      },
    },
  ]

  for (const seed of seedCourses) {
    const courseId = randomUUID()
    db.courses.push({
      id: courseId,
      title: seed.title,
      description: seed.description,
      category: seed.category,
      level: seed.level,
      thumbnailUrl: seed.thumbnailUrl,
      instructorId: instructor.id,
      featured: seed.featured,
      createdAt: now,
      updatedAt: now,
    })

    seed.lessons.forEach((lesson, index) => {
      db.lessons.push({
        id: randomUUID(),
        courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        durationMinutes: lesson.durationMinutes,
        order: index + 1,
      })
    })

    db.quizzes.push({
      id: randomUUID(),
      courseId,
      title: seed.quiz.title,
      passScore: seed.quiz.passScore,
      questions: seed.quiz.questions.map((q) => ({
        id: randomUUID(),
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    })
  }

  const firstCourse = db.courses[0]
  const firstLessons = firstCourse ? findLessonsByCourse(firstCourse.id) : []
  if (firstCourse && firstLessons[0]) {
    const completedIds = [firstLessons[0].id]
    const enrollment: EnrollmentRecord = {
      id: randomUUID(),
      userId: student.id,
      courseId: firstCourse.id,
      completedLessonIds: completedIds,
      enrolledAt: now,
      progressPercent: 0,
    }
    recalculateProgress(enrollment)
    db.enrollments.push(enrollment)
  }

  const secondCourse = db.courses[1]
  if (secondCourse) {
    db.enrollments.push({
      id: randomUUID(),
      userId: student.id,
      courseId: secondCourse.id,
      completedLessonIds: [],
      enrolledAt: now,
      progressPercent: 0,
    })
  }

  seeded = true
}
