import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CourseCategory, CourseFilters, CourseLevel } from '@/features/courses/types/course'

const CATEGORIES: CourseCategory[] = ['programming', 'design', 'business', 'languages']
const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced']

function parseCategory(value: string | null): CourseCategory | '' {
  return value && CATEGORIES.includes(value as CourseCategory)
    ? (value as CourseCategory)
    : ''
}

function parseLevel(value: string | null): CourseLevel | '' {
  return value && LEVELS.includes(value as CourseLevel) ? (value as CourseLevel) : ''
}

export function useCourseFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<CourseFilters>(
    () => ({
      q: searchParams.get('q') ?? '',
      category: parseCategory(searchParams.get('category')),
      level: parseLevel(searchParams.get('level')),
      page: Number(searchParams.get('page') ?? '1') || 1,
      pageSize: 12,
    }),
    [searchParams],
  )

  const update = useCallback(
    (patch: Partial<CourseFilters>) => {
      const next = new URLSearchParams(searchParams)
      const merged = {
        q: patch.q ?? filters.q ?? '',
        category: patch.category ?? filters.category ?? '',
        level: patch.level ?? filters.level ?? '',
        page: patch.page ?? (patch.q !== undefined || patch.category !== undefined || patch.level !== undefined
          ? 1
          : filters.page ?? 1),
      }

      if (merged.q) next.set('q', merged.q)
      else next.delete('q')

      if (merged.category) next.set('category', merged.category)
      else next.delete('category')

      if (merged.level) next.set('level', merged.level)
      else next.delete('level')

      if (merged.page && merged.page > 1) next.set('page', String(merged.page))
      else next.delete('page')

      setSearchParams(next, { replace: true })
    },
    [filters, searchParams, setSearchParams],
  )

  const clear = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  return { filters, update, clear }
}
