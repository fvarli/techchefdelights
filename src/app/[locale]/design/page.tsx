import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import {
  Kicker,
  MetaRow,
  Pill,
  Button,
  IconButton,
  Placeholder,
  Rule,
} from '@/components/foundation'
import styles from './design.module.css'

export const metadata: Metadata = {
  title: 'Design — TechChefDelights',
  robots: { index: false, follow: false },
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Kicker num="00">Foundation Primitives</Kicker>
        <h1 className={styles.title}>Design system / {locale.toUpperCase()}</h1>
        <p className={styles.lede}>
          Locked tokens from <code>home-v2.jsx</code>’s T2 object. Primitives are presentational
          only — no business logic, no data fetching.
        </p>
      </header>
      <Rule variant="strong" />

      <section className={styles.section}>
        <Kicker num="01">Kicker</Kicker>
        <div className={styles.row}>
          <Kicker>Default Terra Tone</Kicker>
          <Kicker num="02">With Number</Kicker>
          <Kicker tone="mute">Mute Tone</Kicker>
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="02">MetaRow</Kicker>
        <div className={styles.row}>
          <MetaRow items={['25 MIN', 'EASY', '4 SERVES']} />
          <MetaRow size="sm" items={['VEGAN', 'GLUTEN-FREE']} />
          <MetaRow tone="sub" items={['Author', 'May 2026']} />
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="03">Pill</Kicker>
        <div className={styles.row}>
          <Pill>Default</Pill>
          <Pill variant="active">Active</Pill>
          <Pill variant="terra">Terra</Pill>
          <Pill variant="sage">Sage</Pill>
          <Pill variant="ghost">Ghost</Pill>
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="04">Button</Kicker>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="terra">Terra CTA</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="05">IconButton</Kicker>
        <div className={styles.row}>
          <IconButton label="Save recipe">♥</IconButton>
          <IconButton label="Share recipe" size="sm">
            ↗
          </IconButton>
          <IconButton label="Print recipe" variant="terra">
            ⎙
          </IconButton>
          <IconButton label="Disabled" disabled>
            ✕
          </IconButton>
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="06">Placeholder</Kicker>
        <div className={styles.gallery}>
          <Placeholder label="WARM" tone="warm" ratio={4 / 3} />
          <Placeholder label="COOL" tone="cool" ratio={4 / 3} />
          <Placeholder label="DARK" tone="dark" ratio={4 / 3} />
          <Placeholder label="LIGHT" tone="light" ratio={4 / 3} />
          <Placeholder label="SAND" tone="sand" ratio={4 / 3} />
        </div>
      </section>
      <Rule />

      <section className={styles.section}>
        <Kicker num="07">Rule</Kicker>
        <div className={styles.stack}>
          <span className={styles.label}>soft</span>
          <Rule variant="soft" />
          <span className={styles.label}>strong</span>
          <Rule variant="strong" />
        </div>
      </section>
      <Rule variant="strong" />

      <section className={styles.section}>
        <Kicker num="08" tone="mute">
          Tokens — Color
        </Kicker>
        <div className={styles.swatches}>
          {[
            ['paper', '--color-paper'],
            ['cream', '--color-cream'],
            ['surface', '--color-surface'],
            ['rule', '--color-rule'],
            ['ruleStrong', '--color-rule-strong'],
            ['ink', '--color-ink'],
            ['sub', '--color-sub'],
            ['mute', '--color-mute'],
            ['terra', '--color-terra'],
            ['terraDark', '--color-terra-dark'],
            ['terraSoft', '--color-terra-soft'],
            ['sage', '--color-sage'],
            ['sageSoft', '--color-sage-soft'],
            ['amber', '--color-amber'],
          ].map(([name, varName]) => (
            <div key={name} className={styles.swatch}>
              <div
                className={styles.swatchChip}
                style={{ background: `var(${varName})` }}
                aria-hidden
              />
              <span className={styles.swatchName}>{name}</span>
              <span className={styles.swatchVar}>{varName}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
