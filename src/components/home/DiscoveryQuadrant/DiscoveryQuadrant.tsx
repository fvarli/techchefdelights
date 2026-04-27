import Link from 'next/link'
import { Kicker } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './DiscoveryQuadrant.module.css'

export type DiscoveryQuadrantLabels = {
  kicker: string
  title: string
  ingredient: { title: string; desc: string }
  diet: { title: string; desc: string }
  cuisine: { title: string; desc: string }
  time: { title: string; desc: string }
}

type Props = {
  locale: ApiLocale
  labels: DiscoveryQuadrantLabels
}

export function DiscoveryQuadrant({ locale, labels }: Props) {
  const cards = [
    {
      key: 'ingredient',
      icon: '◐',
      title: labels.ingredient.title,
      desc: labels.ingredient.desc,
      href: localePath(locale, '/search?by=ingredient'),
    },
    {
      key: 'diet',
      icon: '◇',
      title: labels.diet.title,
      desc: labels.diet.desc,
      href: localePath(locale, '/diets'),
    },
    {
      key: 'cuisine',
      icon: '◧',
      title: labels.cuisine.title,
      desc: labels.cuisine.desc,
      href: localePath(locale, '/cuisine'),
    },
    {
      key: 'time',
      icon: '◔',
      title: labels.time.title,
      desc: labels.time.desc,
      href: localePath(locale, '/search?by=time'),
    },
  ]

  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <Kicker num="01">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
      </header>
      <div className={styles.grid}>
        {cards.map((c) => (
          <Link key={c.key} href={c.href} className={styles.card}>
            <span className={styles.icon} aria-hidden>{c.icon}</span>
            <h3 className={styles.cardTitle}>{c.title}</h3>
            <p className={styles.desc}>{c.desc}</p>
            <span className={styles.arrow} aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
