import { cache } from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { fromApiLocale, type ApiLocale } from '@/lib/api/enums'
import { localePath } from '@/lib/path'
import { PrivacySettingsLink } from '@/components/analytics'
import styles from './Footer.module.css'

type FooterLabels = {
  tagline: string
  popularCategories: string
  explore: { title: string; recipes: string; categories: string; diets: string; cuisines: string }
  company: { title: string; about: string; contact: string; privacy: string; terms: string }
  connect: { title: string; instagram: string; newsletter: string }
  copyright: string
  privacySettings: string
}

type Props = {
  locale: ApiLocale
  labels: FooterLabels
}

const loadPopularCategories = cache(async (locale: ApiLocale) => {
  const prismaLocale = fromApiLocale(locale)
  const categories = await db.category.findMany({
    orderBy: { popularityRank: 'asc' },
    take: 8,
    include: { translations: { where: { locale: prismaLocale } } },
  })
  return categories
    .filter((c) => c.translations[0])
    .map((c) => ({
      slug: c.translations[0].slug,
      name: c.translations[0].name,
    }))
})

export async function Footer({ locale, labels }: Props) {
  const categories = await loadPopularCategories(locale)

  function categoryPath(slug: string) {
    return localePath(locale, `/categories/${slug}`)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href={localePath(locale, '/')} className={styles.brandLink}>
            <span className={styles.brandName}>techchef</span>
            <span className={styles.brandDot} aria-hidden>
              .
            </span>
          </Link>
          <p className={styles.tagline}>{labels.tagline}</p>
          <div className={styles.social}>
            <a
              href="https://instagram.com/tech.chef.delights"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              IG
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{labels.explore.title}</h3>
          <ul className={styles.list}>
            <li><Link href={localePath(locale, '/recipes')}>{labels.explore.recipes}</Link></li>
            <li><Link href={localePath(locale, '/categories')}>{labels.explore.categories}</Link></li>
            <li><Link href={localePath(locale, '/diets')}>{labels.explore.diets}</Link></li>
            <li><Link href={localePath(locale, '/cuisine')}>{labels.explore.cuisines}</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{labels.popularCategories}</h3>
          <ul className={styles.list}>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryPath(c.slug)}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{labels.company.title}</h3>
          <ul className={styles.list}>
            <li><Link href={localePath(locale, '/about')}>{labels.company.about}</Link></li>
            <li><Link href={localePath(locale, '/contact')}>{labels.company.contact}</Link></li>
            <li><Link href={localePath(locale, '/privacy')}>{labels.company.privacy}</Link></li>
            <li><Link href={localePath(locale, '/terms')}>{labels.company.terms}</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{labels.connect.title}</h3>
          <ul className={styles.list}>
            <li>
              <a
                href="https://instagram.com/tech.chef.delights"
                target="_blank"
                rel="noopener noreferrer"
              >
                {labels.connect.instagram}
              </a>
            </li>
            <li><Link href={localePath(locale, '/newsletter')}>{labels.connect.newsletter}</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span className={styles.copyright}>{labels.copyright}</span>
        <PrivacySettingsLink
          enabled={Boolean(process.env.NEXT_PUBLIC_GA_ID)}
          label={labels.privacySettings}
        />
      </div>
    </footer>
  )
}
