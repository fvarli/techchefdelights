'use client'

import { useState, type FormEvent } from 'react'
import { Kicker } from '@/components/foundation'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './NewsletterCTA.module.css'

type Props = {
  locale: ApiLocale
  labels: {
    kicker: string
    title: string
    desc: string
    placeholder: string
    submit: string
    success: string
    error: string
    rateLimited: string
  }
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited'

export function NewsletterCTA({ locale, labels }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else if (res.status === 429) {
        setStatus('rate-limited')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.text}>
        <Kicker num="09">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
        <p className={styles.desc}>{labels.desc}</p>
      </div>
      <form onSubmit={onSubmit} className={styles.form} aria-busy={status === 'loading'}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          className={styles.input}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading' || email.length === 0}
        >
          {labels.submit}
        </button>
        {status === 'success' && <p className={styles.success}>{labels.success}</p>}
        {status === 'error' && <p className={styles.errorText}>{labels.error}</p>}
        {status === 'rate-limited' && <p className={styles.errorText}>{labels.rateLimited}</p>}
      </form>
    </section>
  )
}
