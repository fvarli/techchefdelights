import Script from 'next/script'

/**
 * Google Analytics 4 loader. Renders nothing in dev/CI or when
 * NEXT_PUBLIC_GA_ID is unset. Uses next/script with afterInteractive so it
 * never blocks render or LCP.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id || process.env.NODE_ENV !== 'production') return null

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
