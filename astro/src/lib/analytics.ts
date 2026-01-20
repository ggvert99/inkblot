/**
 * Analytics Helper
 * 
 * Unified analytics tracking for Google Analytics 4 and Plausible
 */

type EventParams = Record<string, string | number | boolean>;

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, params: EventParams = {}): void {
  // Log in development
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', eventName, params);
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, params);
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && 'plausible' in window) {
    (window as any).plausible(eventName, { props: params });
  }
}

/**
 * Track page view
 */
export function trackPageView(path?: string): void {
  const pagePath = path || window.location.pathname;
  
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: document.title,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(location: string, buttonText: string): void {
  trackEvent('cta_click', {
    location,
    button_text: buttonText,
  });
}

/**
 * Track form interaction
 */
export function trackFormEvent(
  action: 'start' | 'submit' | 'success' | 'error',
  formName: string,
  params: EventParams = {}
): void {
  trackEvent(`form_${action}`, {
    form_name: formName,
    ...params,
  });
}

/**
 * Track outbound link click
 */
export function trackOutboundClick(url: string, linkText: string): void {
  trackEvent('outbound_click', {
    url,
    link_text: linkText,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number): void {
  trackEvent('scroll_depth', {
    percentage,
  });
}

/**
 * Initialize scroll depth tracking
 */
export function initScrollTracking(): void {
  if (typeof window === 'undefined') return;

  const thresholds = [25, 50, 75, 100];
  const tracked = new Set<number>();

  function checkScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        trackScrollDepth(threshold);
      }
    });
  }

  window.addEventListener('scroll', checkScrollDepth, { passive: true });
}
