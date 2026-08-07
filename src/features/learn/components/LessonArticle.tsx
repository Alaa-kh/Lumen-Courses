import { useTranslation } from 'react-i18next'
import { useLessonContent } from '@/features/learn/hooks/useLessonContent'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import styles from '@/features/learn/components/LessonArticle.module.scss'

interface LessonArticleProps {
  lessonId: string
  title: string
}

function isMarkdownLessonUrl(url: string): boolean {
  return url.includes('agenticschool.dev') && url.includes('.md')
}

export function isArticleLesson(videoUrl: string): boolean {
  return isMarkdownLessonUrl(videoUrl)
}

export function LessonArticle({ lessonId, title }: LessonArticleProps) {
  const { t } = useTranslation()
  const { data, isLoading, isError, refetch } = useLessonContent(lessonId)

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <Spinner />
      </div>
    )
  }

  if (isError || !data?.content) {
    return (
      <div className={styles.wrap}>
        <p className={styles.error}>{t('learn.lessonContentError')}</p>
        <button type="button" className={styles.retry} onClick={() => void refetch()}>
          {t('app.retry')}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span>{t('learn.articleLesson')}</span>
        {data.sourceUrl ? (
          <a href={data.sourceUrl} target="_blank" rel="noreferrer">
            {t('learn.openSourceLesson')}
          </a>
        ) : null}
      </div>
      <article className={styles.article} aria-label={title}>
        <pre>{data.content}</pre>
      </article>
    </div>
  )
}
