'use client'

import Script from 'next/script'
import { useConsent } from '@/hooks/useConsent'

/**
 * Google Analytics 4 loader. The actual <Script> tags only render when:
 *   - NEXT_PUBLIC_GA_ID is set
 *   - NODE_ENV === 'production'
 *   - the user has explicitly accepted analytics consent
 *     (tcd:consent.analytics === true)
 *
 * GA never loads before consent — required for KVKK / GDPR compliance.
 * If the user later flips consent off via the privacy settings link in
 * the footer, the gtag scripts unmount on the next render.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  const { analyticsAllowed, hydrated } = useConsent()

  if (!id || process.env.NODE_ENV !== 'production') return null
  if (!hydrated || !analyticsAllowed) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
