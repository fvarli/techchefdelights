import type { ApiRecipe } from '@/lib/api/types'
import styles from './ReviewsSection.module.css'

type Review = {
  id: string
  rating: number
  body: string
  authorName: string
  isPlaceholder: boolean
  createdAt: string
}

type Props = {
  rating: ApiRecipe['rating']
  reviews: Review[]
  labels: {
    title: string
    summary: string
    placeholder: string
    noReviews: string
    signInToReview: string
  }
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span aria-label={`${rating} of 5 stars`} className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <span key={i}>★</span>
        if (i === full && half) return <span key={i}>★</span>
        return <span key={i} className={styles.starEmpty}>★</span>
      })}
    </span>
  )
}

export function ReviewsSection({ rating, reviews, labels }: Props) {
  const total = rating.count
  const dist = rating.distribution // [1*..5*]
  const max = Math.max(1, ...dist)

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.title}>{labels.title}</h2>

      {total > 0 ? (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryLeft}>
              <div className={styles.avgRow}>
                <span className={styles.avg}>{rating.average.toFixed(1)}</span>
                <Stars rating={rating.average} />
              </div>
              <span className={styles.count}>
                {labels.summary.replace('{count}', String(total))}
              </span>
            </div>
            <div className={styles.histogram}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = dist[star - 1] ?? 0
                const pct = (count / max) * 100
                return (
                  <div key={star} className={styles.histRow}>
                    <span className={styles.histStar}>{star}★</span>
                    <span className={styles.histBar}>
                      <span
                        className={styles.histFill}
                        style={{ width: `${pct}%` }}
                        aria-hidden
                      />
                    </span>
                    <span className={styles.histCount}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <ul className={styles.list}>
            {reviews.map((r) => (
              <li key={r.id} className={styles.review}>
                <div className={styles.reviewHead}>
                  <Stars rating={r.rating} />
                  <span className={styles.reviewAuthor}>{r.authorName}</span>
                  {r.isPlaceholder && (
                    <span className={styles.placeholderBadge}>{labels.placeholder}</span>
                  )}
                </div>
                <p className={styles.reviewBody}>{r.body}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.empty}>{labels.noReviews}</p>
      )}

      <button type="button" className={styles.signInBtn} disabled aria-disabled>
        {labels.signInToReview}
      </button>
    </section>
  )
}
