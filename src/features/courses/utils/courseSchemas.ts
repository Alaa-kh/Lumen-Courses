import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['programming', 'design', 'business', 'languages']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  thumbnailUrl: z.string().url(),
  featured: z.boolean().optional(),
  lesson1Title: z.string().min(2),
  lesson1Video: z.string().url(),
  lesson1Duration: z.coerce.number().min(1),
  lesson2Title: z.string().optional(),
  lesson2Video: z.string().optional(),
  lesson2Duration: z.coerce.number().optional(),
})

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>
