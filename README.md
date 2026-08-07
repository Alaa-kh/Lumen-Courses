# Lumen LMS

Educational learning platform with courses, video lessons, quizzes, certificates, student progress, and an instructor dashboard.

## Stack

- React 19 + Vite + TypeScript (strict)
- Redux Toolkit + TanStack Query
- React Hook Form + Zod
- Axios API client
- Express in-memory JWT API
- SCSS modules + i18n (EN / AR)

## Quick start

```bash
cd D:\lumen
npm install
npm run dev
```

- Web: http://localhost:5174
- API: http://localhost:4002 (`Lumen API listening…`)

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Instructor | `instructor@lumen.app` | `Password123!` |
| Student | `student@lumen.app` | `Password123!` |

The student account is pre-enrolled in sample courses.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | API + Vite together |
| `npm run dev:web` | Vite only |
| `npm run dev:api` | Express API only (port 4002) |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Oxlint |

## Environment

Copy `.env.example` to `.env` if needed:

```
VITE_API_BASE_URL=http://localhost:4002/api
VITE_APP_NAME=Lumen
JWT_SECRET=change-me
PORT=4002
```

## Features

- **Catalog** — browse/filter courses by category (programming, design, business, languages) and level
- **Learn** — enroll, watch lessons, mark complete, track progress
- **Quizzes** — submit answers; pass score required for certificates
- **Certificates** — issued when a course is 100% complete and the quiz is passed
- **Instructor** — dashboard stats, course list, create course form
