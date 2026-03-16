import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const DARK_MODE_STYLES = `
  /* ══════════════════════════════════════════════════════════
     DEEP SEA DARK MODE PALETTE
  ══════════════════════════════════════════════════════════ */
  [data-theme="dark"] {
    /* ── Core surfaces ───────────────────────────────────── */
    --bg:         #0D1321;        /* Primary background — Deep Sea base       */
    --card:       #1B263B;        /* Cards, modals — Navy depth layer         */
    --white:      #1B263B;        /* Replaces white fills                     */
    --chip-bg:    #162030;        /* Input bg, chips — midpoint layer         */
    --border:     rgba(119,141,169,0.18); /* Subtle dividers                  */
    --sand:       rgba(119,141,169,0.12); /* Section separators               */

    /* ── Typography ──────────────────────────────────────── */
    --text:       #E0E1DD;        /* Body text — Sand Beige, soft on eyes     */
    --muted:      rgba(224,225,221,0.45); /* Secondary / placeholder text     */
    --navy:       #E0E1DD;        /* Heading override                         */

    /* ── Accent system ───────────────────────────────────── */
    --teal:       #415A77;        /* Action color — buttons, active states    */
    --teal-light: #778DA9;        /* Icons, links, highlights                 */
    --teal-dark:  #2e4460;        /* Pressed/hover gradient end               */

    /* ── Nav ─────────────────────────────────────────────── */
    --nav-bg:              rgba(13,19,33,0.97);
    --nav-border:          rgba(119,141,169,0.15);
    --nav-text:            #E0E1DD;
    --nav-text-muted:      rgba(224,225,221,0.4);
    --nav-hover-bg:        rgba(65,90,119,0.18);
    --nav-active-bg:       rgba(65,90,119,0.28);
    --nav-active-text:     #778DA9;
    --nav-shadow:          0 4px 32px rgba(0,0,0,0.6);
    --nav-user-bg:         rgba(65,90,119,0.25);
    --nav-dropdown-bg:     #1B263B;
    --nav-dropdown-shadow: 0 16px 48px rgba(0,0,0,0.7);
    --nav-mobile-bg:       rgba(13,19,33,0.99);

    /* ── Page-wide aliases ───────────────────────────────── */
    --page-bg:     #0D1321;
    --page-card:   #1B263B;
    --page-text:   #E0E1DD;
    --page-muted:  rgba(224,225,221,0.45);
    --page-border: rgba(119,141,169,0.18);
    --page-sand:   rgba(119,141,169,0.12);
    --page-chip:   #162030;
  }

  /* ── Body ─────────────────────────────────────────────── */
  [data-theme="dark"] body {
    background: #0D1321 !important;
    color: #E0E1DD !important;
  }

  /* ── Scrollbar ─────────────────────────────────────────── */
  [data-theme="dark"] ::-webkit-scrollbar { width: 6px; height: 6px; }
  [data-theme="dark"] ::-webkit-scrollbar-track { background: #0D1321; }
  [data-theme="dark"] ::-webkit-scrollbar-thumb {
    background: rgba(119,141,169,0.35); border-radius: 3px;
  }
  [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
    background: rgba(119,141,169,0.6);
  }

  /* ── Cards & surfaces ──────────────────────────────────── */
  [data-theme="dark"] .prop-card,
  [data-theme="dark"] .wl-card,
  [data-theme="dark"] .bk-card,
  [data-theme="dark"] .why-card,
  [data-theme="dark"] .modal-box,
  [data-theme="dark"] .ab-dropdown,
  [data-theme="dark"] .hs-dropdown,
  [data-theme="dark"] .hero-img-badge {
    background: #1B263B !important;
    border-color: rgba(119,141,169,0.18) !important;
  }

  /* ── Search / toolbar bars ─────────────────────────────── */
  [data-theme="dark"] .airbnb-bar,
  [data-theme="dark"] .airbnb-search,
  [data-theme="dark"] .wl-toolbar,
  [data-theme="dark"] .bk-toolbar,
  [data-theme="dark"] .search-card {
    background: #1B263B !important;
    border-color: rgba(119,141,169,0.2) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5) !important;
  }

  /* ── Field hover & inputs ──────────────────────────────── */
  [data-theme="dark"] .ab-field:hover,
  [data-theme="dark"] .airbnb-field:hover {
    background: #162030 !important;
  }
  [data-theme="dark"] .ab-field.open {
    background: #1B263B !important;
  }
  [data-theme="dark"] .airbnb-field input,
  [data-theme="dark"] .wl-search input,
  [data-theme="dark"] .bk-search input,
  [data-theme="dark"] .ab-input {
    background: #162030 !important;
    color: #E0E1DD !important;
    border-color: rgba(119,141,169,0.2) !important;
  }
  [data-theme="dark"] .ab-input::placeholder,
  [data-theme="dark"] .wl-search input::placeholder,
  [data-theme="dark"] .bk-search input::placeholder {
    color: rgba(224,225,221,0.35) !important;
  }

  /* ── Chips, tabs, selects ──────────────────────────────── */
  [data-theme="dark"] .bk-chip,
  [data-theme="dark"] .amenity-chip,
  [data-theme="dark"] .cal-tab-wrap,
  [data-theme="dark"] .modal-highlights {
    background: #162030 !important;
    border-color: rgba(119,141,169,0.18) !important;
  }
  [data-theme="dark"] .cal-chip {
    background: transparent !important;
    border-color: rgba(119,141,169,0.25) !important;
    color: #E0E1DD !important;
  }
  [data-theme="dark"] .cal-chip.active {
    background: #415A77 !important;
    border-color: #415A77 !important;
    color: #ffffff !important;
  }
  [data-theme="dark"] .cal-chip:hover {
    border-color: #778DA9 !important;
    color: #778DA9 !important;
  }
  [data-theme="dark"] .cal-tab.active,
  [data-theme="dark"] .bk-tab.active {
    background: #1B263B !important;
    color: #778DA9 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
  }
  [data-theme="dark"] .cal-tab,
  [data-theme="dark"] .bk-tab {
    color: rgba(224,225,221,0.45) !important;
  }
  [data-theme="dark"] .bk-tabs {
    background: #162030 !important;
  }
  [data-theme="dark"] .wl-sort select {
    background: #162030 !important;
    color: #E0E1DD !important;
    border-color: rgba(119,141,169,0.2) !important;
  }

  /* ── Calendar ──────────────────────────────────────────── */
  [data-theme="dark"] .cal-day { color: #E0E1DD !important; }
  [data-theme="dark"] .cal-day.past { color: rgba(119,141,169,0.3) !important; }
  [data-theme="dark"] .cal-day:hover:not(.past):not(.empty) {
    background: rgba(65,90,119,0.3) !important;
  }
  [data-theme="dark"] .cal-day.in-range {
    background: rgba(65,90,119,0.2) !important;
  }
  [data-theme="dark"] .cal-day.range-start,
  [data-theme="dark"] .cal-day.range-end {
    background: #415A77 !important;
    color: #ffffff !important;
  }
  [data-theme="dark"] .cal-nav-btn {
    border-color: rgba(119,141,169,0.25) !important;
    color: #E0E1DD !important;
  }
  [data-theme="dark"] .cal-nav-btn:hover { background: rgba(65,90,119,0.3) !important; }
  [data-theme="dark"] .cal-dow { color: rgba(224,225,221,0.4) !important; }
  [data-theme="dark"] .cal-month-title { color: #E0E1DD !important; }

  /* ── Guest dropdown ────────────────────────────────────── */
  [data-theme="dark"] .guest-info-name { color: #E0E1DD !important; }
  [data-theme="dark"] .guest-info-desc { color: rgba(224,225,221,0.45) !important; }
  [data-theme="dark"] .guest-row { border-color: rgba(119,141,169,0.15) !important; }
  [data-theme="dark"] .guest-btn {
    border-color: rgba(119,141,169,0.25) !important;
    color: #778DA9 !important;
  }
  [data-theme="dark"] .guest-btn:hover:not(:disabled) {
    background: rgba(65,90,119,0.25) !important;
    border-color: #778DA9 !important;
  }
  [data-theme="dark"] .guest-count { color: #E0E1DD !important; }

  /* ── Section backgrounds ───────────────────────────────── */
  [data-theme="dark"] .home-root,
  [data-theme="dark"] .wl-root,
  [data-theme="dark"] .bk-root {
    background: #0D1321 !important;
  }
  [data-theme="dark"] .featured-section {
    background: rgba(27,38,59,0.5) !important;
  }

  /* ── Hero sections ─────────────────────────────────────── */
  [data-theme="dark"] .hero {
    background: linear-gradient(135deg, #060a12 0%, #0D1321 55%, #111b2b 100%) !important;
  }
  [data-theme="dark"] .hero::after,
  [data-theme="dark"] .wl-header-wave,
  [data-theme="dark"] .bk-header-wave {
    background: #0D1321 !important;
  }
  [data-theme="dark"] .wl-header,
  [data-theme="dark"] .bk-header {
    background: linear-gradient(135deg, #060a12 0%, #0D1321 55%, #111b2b 100%) !important;
  }

  /* ── Why section ───────────────────────────────────────── */
  [data-theme="dark"] .why-section {
    background: linear-gradient(135deg, #060a12 0%, #0D1321 50%, #0e1525 100%) !important;
  }
  [data-theme="dark"] .why-card {
    background: rgba(27,38,59,0.5) !important;
    border-color: rgba(119,141,169,0.15) !important;
  }
  [data-theme="dark"] .why-card:hover {
    background: rgba(65,90,119,0.3) !important;
    border-color: rgba(119,141,169,0.35) !important;
  }

  /* ── Typography ────────────────────────────────────────── */
  [data-theme="dark"] .prop-title,
  [data-theme="dark"] .wl-card-title,
  [data-theme="dark"] .bk-card-title,
  [data-theme="dark"] .section-heading,
  [data-theme="dark"] .wl-title,
  [data-theme="dark"] .bk-title,
  [data-theme="dark"] .modal-title,
  [data-theme="dark"] .modal-section-title,
  [data-theme="dark"] .modal-highlights-title,
  [data-theme="dark"] .why-title,
  [data-theme="dark"] .ab-label,
  [data-theme="dark"] .airbnb-field-label,
  [data-theme="dark"] .guest-info-name,
  [data-theme="dark"] .bk-empty-title,
  [data-theme="dark"] .wl-empty-title {
    color: #E0E1DD !important;
  }

  [data-theme="dark"] .prop-location,
  [data-theme="dark"] .prop-reviews,
  [data-theme="dark"] .prop-guests,
  [data-theme="dark"] .wl-card-loc,
  [data-theme="dark"] .bk-card-loc,
  [data-theme="dark"] .bk-card-nights,
  [data-theme="dark"] .section-sub,
  [data-theme="dark"] .hero-sub,
  [data-theme="dark"] .bk-subtitle,
  [data-theme="dark"] .wl-subtitle,
  [data-theme="dark"] .ab-value,
  [data-theme="dark"] .modal-location,
  [data-theme="dark"] .modal-rating-count,
  [data-theme="dark"] .modal-price-unit,
  [data-theme="dark"] .prop-price-unit,
  [data-theme="dark"] .bk-card-price-unit,
  [data-theme="dark"] .why-desc,
  [data-theme="dark"] .modal-about-text,
  [data-theme="dark"] .modal-highlight-item,
  [data-theme="dark"] .bk-empty-sub,
  [data-theme="dark"] .wl-empty-sub {
    color: rgba(224,225,221,0.5) !important;
  }

  /* ── Prices — pure white to pop ────────────────────────── */
  [data-theme="dark"] .prop-price-num,
  [data-theme="dark"] .wl-card-price-num,
  [data-theme="dark"] .bk-card-price-num,
  [data-theme="dark"] .modal-price-num,
  [data-theme="dark"] .bk-stat-pill-num,
  [data-theme="dark"] .hero-stat-num {
    color: #FFFFFF !important;
  }

  /* ── Teal accents ──────────────────────────────────────── */
  [data-theme="dark"] .section-eyebrow,
  [data-theme="dark"] .wl-eyebrow,
  [data-theme="dark"] .bk-eyebrow,
  [data-theme="dark"] .prop-rating,
  [data-theme="dark"] .view-all-btn {
    color: #778DA9 !important;
  }
  [data-theme="dark"] .view-all-btn {
    border-color: #778DA9 !important;
  }
  [data-theme="dark"] .view-all-btn:hover {
    background: #415A77 !important;
    color: #ffffff !important;
  }

  /* ── Buttons ───────────────────────────────────────────── */
  [data-theme="dark"] .ab-search-btn,
  [data-theme="dark"] .wl-card-book-btn,
  [data-theme="dark"] .modal-book-btn,
  [data-theme="dark"] .bk-empty-btn,
  [data-theme="dark"] .wl-empty-btn {
    background: linear-gradient(135deg, #415A77, #2e4460) !important;
    color: #ffffff !important;
  }

  /* ── Card action / footer rows ─────────────────────────── */
  [data-theme="dark"] .bk-card-action {
    background: rgba(65,90,119,0.2) !important;
    border-color: rgba(119,141,169,0.2) !important;
    color: #778DA9 !important;
  }
  [data-theme="dark"] .bk-card-action:hover {
    background: rgba(65,90,119,0.35) !important;
    border-color: #778DA9 !important;
  }
  [data-theme="dark"] .bk-card-footer,
  [data-theme="dark"] .prop-meta,
  [data-theme="dark"] .wl-card-meta {
    border-color: rgba(119,141,169,0.15) !important;
  }

  /* ── Separators ────────────────────────────────────────── */
  [data-theme="dark"] .ab-sep,
  [data-theme="dark"] .airbnb-divider,
  [data-theme="dark"] .modal-divider,
  [data-theme="dark"] .hs-dropdown-divider,
  [data-theme="dark"] .bk-section-label-line {
    background: rgba(119,141,169,0.15) !important;
  }

  /* ── Nav dropdown items ────────────────────────────────── */
  [data-theme="dark"] .hs-dropdown-name { color: #E0E1DD !important; }
  [data-theme="dark"] .hs-dropdown-email { color: rgba(224,225,221,0.4) !important; }
  [data-theme="dark"] .hs-dropdown-item { color: #E0E1DD !important; }
  [data-theme="dark"] .hs-dropdown-item:hover {
    background: rgba(65,90,119,0.25) !important;
    color: #778DA9 !important;
  }
  [data-theme="dark"] .hs-logo-text { color: #E0E1DD !important; }
  [data-theme="dark"] .hs-nav-link { color: #E0E1DD !important; }
  [data-theme="dark"] .hs-user-name { color: #E0E1DD !important; }

  /* ── Map label & prop badge ────────────────────────────── */
  [data-theme="dark"] .modal-map-label,
  [data-theme="dark"] .prop-badge {
    background: #1B263B !important;
    border-color: rgba(119,141,169,0.2) !important;
    color: #E0E1DD !important;
  }

  /* ── Wishlist / booking saved tag ──────────────────────── */
  [data-theme="dark"] .wl-saved-tag {
    background: linear-gradient(135deg, #415A77, #2e4460) !important;
  }

  /* ── Empty state icons ─────────────────────────────────── */
  [data-theme="dark"] .bk-empty-icon,
  [data-theme="dark"] .wl-empty-icon {
    background: rgba(65,90,119,0.2) !important;
    border-color: rgba(119,141,169,0.25) !important;
  }

  /* ── Footer ────────────────────────────────────────────── */
  [data-theme="dark"] .ft-root {
    background: linear-gradient(160deg, #060a12 0%, #0D1321 45%, #0e1525 100%) !important;
  }
  [data-theme="dark"] .ft-stat { background: rgba(27,38,59,0.7) !important; }
  [data-theme="dark"] .ft-newsletter-row {
    background: rgba(27,38,59,0.6) !important;
    border-color: rgba(119,141,169,0.2) !important;
  }
  [data-theme="dark"] .ft-social-btn {
    background: rgba(27,38,59,0.6) !important;
    border-color: rgba(119,141,169,0.2) !important;
  }
  [data-theme="dark"] .ft-contact-icon {
    background: rgba(65,90,119,0.2) !important;
    border-color: rgba(119,141,169,0.2) !important;
  }
  [data-theme="dark"] .ft-app-badge {
    background: rgba(27,38,59,0.6) !important;
    border-color: rgba(119,141,169,0.2) !important;
  }
`;

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inject global dark mode styles once
    if (!document.getElementById('deep-sea-dark-styles')) {
      const tag = document.createElement('style');
      tag.id = 'deep-sea-dark-styles';
      tag.textContent = DARK_MODE_STYLES;
      document.head.appendChild(tag);
    }

    setMounted(true);

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const val = e.matches;
        setIsDark(val);
        document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', val);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <button disabled style={{
        width: 36, height: 36, borderRadius: 10,
        border: '1.5px solid rgba(119,141,169,0.3)',
        background: 'transparent', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        opacity: 0.5, cursor: 'not-allowed',
      }}>
        <Moon size={16} style={{ color: '#778DA9' }} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36, height: 36, borderRadius: 10,
        border: `1.5px solid ${isDark ? 'rgba(119,141,169,0.35)' : 'rgba(65,90,119,0.3)'}`,
        background: isDark ? 'rgba(27,38,59,0.8)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {isDark
        ? <Sun  size={16} style={{ color: '#E0E1DD' }} />
        : <Moon size={16} style={{ color: '#415A77' }} />
      }
    </button>
  );
};

export default DarkModeToggle;