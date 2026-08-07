import cors from 'cors'
import express from 'express'
import { authRouter } from './routes/auth.js'
import { coursesRouter } from './routes/courses.js'
import { learnRouter } from './routes/learn.js'
import { instructorRouter } from './routes/instructor.js'
import { findUserByEmail, seedDatabase } from './data/db.js'
import { syncAgenticCatalog } from './integrations/syncAgenticCatalog.js'

const PORT = Number(process.env.PORT ?? 4002)

async function bootstrap() {
  seedDatabase()

  const instructor = findUserByEmail('instructor@lumen.app')
  const student = findUserByEmail('student@lumen.app')

  if (instructor && student) {
    try {
      const result = await syncAgenticCatalog({
        instructorId: instructor.id,
        studentId: student.id,
      })
      console.log(
        `Synced Agentic School catalog: ${result.courseCount} courses, ${result.lessonCount} lessons`,
      )
    } catch (error) {
      console.error('Failed to sync Agentic School catalog — keeping local seed courses.', error)
    }
  }

  const app = express()

  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', catalogSource: 'agentic-school' })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/courses', coursesRouter)
  app.use('/api/learn', learnRouter)
  app.use('/api/instructor', instructorRouter)

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Internal server error'
      const status = (err as { status?: number }).status ?? 500
      res.status(status).json({
        message,
        code: (err as { code?: string }).code ?? 'INTERNAL_ERROR',
      })
    },
  )

  app.listen(PORT, () => {
    console.log(`Lumen API listening on http://localhost:${PORT}`)
  })
}

void bootstrap()
