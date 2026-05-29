export const GOOGLE_ADS_ID = 'AW-18191033904';

/** Replace CONVERSION_LABEL with the label from Google Ads when provided. */
export const GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO = 'AW-18191033904/CONVERSION_LABEL';

/** Google Ads conversion — signup confirmed (no env required). */
export function trackGoogleAdsConversion() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO });
}

export function initGoogleAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

export function trackPageView(path) {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name, params = {}) {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
