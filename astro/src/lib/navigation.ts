// Centralized navigation configuration
// Used by Header.astro and MobileMenu.astro

export interface NavItem {
  label: string;
  href: string;
}

// Base URL from astro.config.mjs
const BASE_URL = '/inkblot';

export const navItems: NavItem[] = [
  { label: 'How it works', href: `${BASE_URL}/#how-it-works` },
  { label: "What's inside", href: `${BASE_URL}/#whats-inside` },
  { label: 'Community', href: `${BASE_URL}/#community` },
  { label: 'For publishers', href: `${BASE_URL}/publishers` },
  { label: 'FAQ', href: `${BASE_URL}/#faq` },
];
