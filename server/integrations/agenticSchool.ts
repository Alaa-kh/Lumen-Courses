import type { CourseCategory, CourseLevel } from '../types.js'

const AGENTIC_API_BASE =
  process.env.AGENTIC_SCHOOL_API_BASE?.replace(/\/$/, '') ??
  'https://agenticschool.dev/api/v1'

const CACHE_TTL_MS = 10 * 60 * 1000

export interface AgenticLesson {
  order: number
  number: string
  slug: string
  title: string
  summary?: string
  outcome?: string
  duration?: string
  durationIso?: string
  status: string
  url: string
  markdownUrl: string
}

export interface AgenticCourse {
  slug: string
  title: string
  subtitle?: string
  description: string
  level: string
  tags: string[]
  lessonCount: number
  estimatedMinutes: number
  order: number
  locale: string
  url: string
  markdownUrl: string
  lessons: AgenticLesson[]
}

interface CacheState {
  courses: AgenticCourse[] | null
  fetchedAt: number
}

const cache: CacheState = {
  courses: null,
  fetchedAt: 0,
}

const THUMBNAILS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80',
]

export function agenticCourseId(slug: string): string {
  return `as-${slug}`
}

export function agenticLessonId(slug: string): string {
  return `as-lesson-${slug}`
}

export function mapAgenticLevel(level: string): CourseLevel {
  const normalized = level.toLowerCase()
  if (normalized.includes('technik') || normalized.includes('advanced')) return 'advanced'
  if (
    normalized.includes('fortgeschritten') ||
    normalized.includes('intermediate') ||
    normalized.includes('mid')
  ) {
    return 'intermediate'
  }
  return 'beginner'
}

export function mapAgenticCategory(tags: string[]): CourseCategory {
  const blob = tags.join(' ').toLowerCase()
  if (blob.includes('design') || blob.includes('ui')) return 'design'
  if (blob.includes('business') || blob.includes('stripe') || blob.includes('funnel')) {
    return 'business'
  }
  if (blob.includes('language') || blob.includes('english')) return 'languages'
  return 'programming'
}

export function parseDurationMinutes(lesson: AgenticLesson, fallback: number): number {
  if (lesson.durationIso) {
    const match = /PT(?:(\d+)H)?(?:(\d+)M)?/i.exec(lesson.durationIso)
    if (match) {
      const hours = Number(match[1] ?? 0)
      const minutes = Number(match[2] ?? 0)
      const total = hours * 60 + minutes
      if (total > 0) return total
    }
  }

  if (lesson.duration) {
    const match = /(\d+)\s*min/i.exec(lesson.duration)
    if (match?.[1]) return Number(match[1])
  }

  return Math.max(1, fallback)
}

export function thumbnailForIndex(index: number): string {
  return THUMBNAILS[index % THUMBNAILS.length] ?? THUMBNAILS[0]!
}

export async function fetchAgenticCourses(force = false): Promise<AgenticCourse[]> {
  const fresh = Date.now() - cache.fetchedAt < CACHE_TTL_MS
  if (!force && cache.courses && fresh) {
    return cache.courses
  }

  const response = await fetch(`${AGENTIC_API_BASE}/courses.json`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'LumenLMS/1.0 (+local-dev)',
    },
  })

  if (!response.ok) {
    throw new Error(`Agentic School responded with ${response.status}`)
  }

  const payload = (await response.json()) as AgenticCourse[]
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('Agentic School returned an empty catalog')
  }

  const detailed = await Promise.all(
    payload.map(async (course) => {
      try {
        const detailResponse = await fetch(`${AGENTIC_API_BASE}/courses/${course.slug}.json`, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'LumenLMS/1.0 (+local-dev)',
          },
        })
        if (!detailResponse.ok) return course
        return (await detailResponse.json()) as AgenticCourse
      } catch {
        return course
      }
    }),
  )

  cache.courses = detailed
  cache.fetchedAt = Date.now()
  return detailed
}

export async function fetchAgenticMarkdown(markdownUrl: string): Promise<string> {
  if (!markdownUrl.startsWith('https://agenticschool.dev/')) {
    throw new Error('Unsupported markdown host')
  }

  const response = await fetch(markdownUrl, {
    headers: {
      Accept: 'text/markdown, text/plain, */*',
      'User-Agent': 'LumenLMS/1.0 (+local-dev)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load lesson content (${response.status})`)
  }

  return response.text()
}

export function isAgenticMarkdownUrl(url: string): boolean {
  return url.includes('agenticschool.dev') && url.includes('.md')
}
