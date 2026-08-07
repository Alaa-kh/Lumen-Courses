import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuiz, useSubmitQuiz } from '@/features/learn/hooks/useLearnActions'
import { Button } from '@/shared/components/Button/Button'
import { Reveal } from '@/shared/components/Reveal/Reveal'
import { Spinner } from '@/shared/components/Spinner/Spinner'
import { StateMessage } from '@/shared/components/StateMessage/StateMessage'
import { ROUTES, certificateDetailPath, learnPath } from '@/shared/constants/routes'
import styles from '@/features/learn/pages/QuizPage.module.scss'

export function QuizPage() {
  const { courseId = '' } = useParams()
  const { t } = useTranslation()
  const { data: quiz, isLoading, isError, refetch } = useQuiz(courseId)
  const { submit, isPending, result, errorKey } = useSubmitQuiz(courseId)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  if (isLoading) return <Spinner />
  if (isError || !quiz) {
    return (
      <div className="container page">
        <StateMessage
          title={t('errors.loadFailed')}
          description={t('errors.generic')}
          actionLabel={t('app.retry')}
          onAction={() => void refetch()}
        />
      </div>
    )
  }

  if (result) {
    return (
      <div className={`container page ${styles.result}`}>
        <Reveal variant="scale">
          <div className={styles.resultCard}>
            <h1>{result.attempt.passed ? t('learn.quizPassed') : t('learn.quizFailed')}</h1>
            <p>{t('learn.quizScore', { score: result.attempt.score, pass: quiz.passScore })}</p>
            <div className={styles.actions}>
              <Link to={learnPath(courseId)}>
                <Button type="button" variant="secondary">
                  {t('learn.backToCourse')}
                </Button>
              </Link>
              {result.certificate ? (
                <Link to={certificateDetailPath(result.certificate.id)}>
                  <Button type="button">{t('learn.viewCertificate')}</Button>
                </Link>
              ) : (
                <Link to={ROUTES.certificates}>
                  <Button type="button" variant="ghost">
                    {t('nav.certificates')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    )
  }

  const allAnswered = quiz.questions.every((question) => answers[question.id] !== undefined)

  return (
    <div className={`container page ${styles.page}`}>
      <Reveal as="header" className={styles.header} variant="up">
        <h1>{quiz.title}</h1>
        <p>{t('learn.quizIntro', { pass: quiz.passScore })}</p>
      </Reveal>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
          const ordered = quiz.questions.map((question) => answers[question.id] ?? -1)
          void submit(ordered)
        }}
      >
        {quiz.questions.map((question, index) => (
          <Reveal
            key={question.id}
            as="div"
            delayMs={index * 90}
            variant="up"
            className={styles.questionReveal}
          >
            <fieldset className={styles.question}>
              <legend>
                {index + 1}. {question.prompt}
              </legend>
              <div className={styles.options}>
                {question.options.map((option, optionIndex) => (
                  <label
                    key={option}
                    className={
                      answers[question.id] === optionIndex ? styles.optionActive : undefined
                    }
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === optionIndex}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Reveal>
        ))}

        {errorKey ? <p className={styles.error}>{t(errorKey)}</p> : null}

        <Reveal delayMs={quiz.questions.length * 90 + 60} variant="up">
          <Button type="submit" disabled={!allAnswered || isPending}>
            {t('learn.submitQuiz')}
          </Button>
        </Reveal>
      </form>
    </div>
  )
}
