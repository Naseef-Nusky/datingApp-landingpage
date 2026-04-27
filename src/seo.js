const SITE_NAME = 'Vantage Dating';

export function injectJsonLdLanding() {
  const site = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
  if (!site || typeof document === 'undefined') return;
  const existing = document.getElementById('jsonld-website');
  if (existing) return;
  const script = document.createElement('script');
  script.id = 'jsonld-website';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: site,
    description:
      'Sign up for Vantage Dating — meet real people worldwide with verified profiles and safe connections.',
  });
  document.head.appendChild(script);
}

/**
 * Sets absolute og:image / twitter:image when VITE_SITE_URL is set.
 */
export function applyLandingOgAbsolute() {
  const site = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
  if (!site) return;
  const imageBase = (import.meta.env.VITE_OG_IMAGE_URL || '').trim();
  const imageAbs =
    imageBase && imageBase.startsWith('http')
      ? imageBase
      : `${site}${imageBase || '/og-image.png'}`;
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', imageAbs);
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', imageAbs);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', site + '/');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', site + '/');
  const twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.setAttribute('content', site + '/');
}
