const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Inisialisasi Google Analytics 4.
 *
 * Measurement ID diambil dari:
 * VITE_GA_MEASUREMENT_ID
 */
export const initGoogleAnalytics = (): void => {
  if (!GA_MEASUREMENT_ID) {
    console.warn(
      '[Google Analytics] VITE_GA_MEASUREMENT_ID belum tersedia.'
    );
    return;
  }

  // Hindari inisialisasi dua kali
  if (document.getElementById('google-analytics-script')) {
    return;
  }

  // Siapkan dataLayer
  window.dataLayer = window.dataLayer || [];

  // Siapkan fungsi gtag
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Waktu mulai Google Analytics
  window.gtag('js', new Date());

  // Konfigurasi awal GA4
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  // Muat library Google Analytics
  const script = document.createElement('script');

  script.id = 'google-analytics-script';
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  document.head.appendChild(script);
};

/**
 * Mencatat page view untuk aplikasi React SPA.
 *
 * Karena BinaUsaha tidak melakukan full page reload
 * ketika berpindah halaman, page view perlu dikirim manual.
 */
export const trackPageView = (path?: string): void => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') {
    return;
  }

  const currentPath =
    path ||
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  window.gtag('event', 'page_view', {
    page_path: currentPath,
    page_location: window.location.href,
    page_title: document.title,
  });
};