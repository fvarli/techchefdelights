'use client'

import Link from 'next/link'
import { useResumePoint } from '@/hooks/useResumePoint'
import styles from './ResumeBanner.module.css'

type Props = {
  slug: string
  cookHref: string
  labels: {
    title: string
    body: string
    resume: string
    dismiss: string
  }
}

export function ResumeBanner({ slug, cookHref, labels }: Props) {
  const { point, clear, hydrated } = useResumePoint(slug)

  if (!hydrated || !point) return null

  const stepNum = point.stepIndex + 1
  const resumeHref =
    point.stepIndex === 0 ? cookHref : `${cookHref}?step=${point.stepIndex}`

  return (
    <div className={styles.banner} role="status">
      <div className={styles.text}>
        <strong className={styles.title}>{labels.title}</strong>
        <span className={styles.body}>
          {labels.body.replace('{step}', String(stepNum))}
        </span>
      </div>
      <div className={styles.actions}>
        <Link href={resumeHref} className={styles.resumeBtn}>
          {labels.resume} <span aria-hidden>→</span>
        </Link>
        <button type="button" onClick={clear} className={styles.dismissBtn}>
          {labels.dismiss}
        </button>
      </div>
    </div>
  )
}
