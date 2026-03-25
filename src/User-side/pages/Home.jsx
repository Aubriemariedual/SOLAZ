// Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Star, Heart, ArrowRight, Headphones, BadgeCheck,
         ChevronLeft, ChevronRight, Plus, Minus, X, Wifi, Wind, Car, Waves, Bath,
         Home as HomeIcon, Maximize2, Eye, Utensils, Users2, ChevronDown, ImageIcon } from 'lucide-react';
import Rooms from './Rooms';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

/* ─────────────────────────────────────────────────────────────
   STYLES (keep all your existing styles - they remain the same)
───────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ══ LIGHT TOKENS ════════════════════════════════════ */
  :root {
    --cream:        #F0EFE4;
    --cream2:       #E8E7DA;
    --forest:       #2D5016;
    --forest2:      #3D6B20;
    --rust:         #8B3A2A;
    --rust2:        #A04535;
    --text:         #2A2A2A;
    --muted:        #6B6B5A;
    --border:       #D0CFC0;
    --card:         #FFFFFF;
    --white:        #FFFFFF;
    --hero-sub:     #000000;
    --hero-accent:  #477253;
    --contact-lbl:  #8F6244;
    --input-bg:     transparent;
    --input-border: #D0CFC0;
    --faq-text:     #2A2A2A;
    --faq-chevron:  #477253;
    --gallery-bg:   #E8E7DA;
    --contact-right-bg: #C8C9BF;
    --section-divider-line: var(--rust);
    --divider-title-color:  var(--rust);
    --tagline-color:        #477253;
  }

  /* ══ DARK TOKENS ═════════════════════════════════════ */
  [data-theme="dark"] {
    --cream:        #131710;
    --cream2:       #1a1f14;
    --forest:       #81a860;
    --forest2:      #94be6e;
    --rust:         #c87060;
    --rust2:        #d4806e;
    --text:         #dedad0;
    --muted:        #9a9888;
    --border:       rgba(129,168,96,0.18);
    --card:         #1c2414;
    --white:        #1c2414;
    --hero-sub:     #b0ae9e;
    --hero-accent:  #94be6e;
    --contact-lbl:  #c4a86a;
    --input-bg:     transparent;
    --input-border: rgba(129,168,96,0.3);
    --faq-text:     #dedad0;
    --faq-chevron:  #81a860;
    --gallery-bg:   #1a1f14;
    --contact-right-bg: #1e2a18;
    --section-divider-line: var(--rust);
    --divider-title-color:  var(--rust);
    --tagline-color:        #81a860;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .solaz-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    background: var(--cream);
    min-height: 100vh;
    transition: background 0.4s, color 0.4s;
  }

  /* ── HERO ────────────────────────────────────────────── */
  .hero {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 56px);
  }
  @media (max-width: 768px) { .hero { grid-template-columns: 1fr; } }
  .hero-left {
    background: var(--cream);
    padding: 72px 48px 48px;
    display: flex; flex-direction: column; justify-content: center;
    transition: background 0.4s;
  }
  .hero-right {
    background: var(--cream2);
    position: relative; overflow: hidden;
    transition: background 0.4s;
  }
  .hero-right img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .hero-h1 {
    font-family: 'Oooh Baby', serif;
    font-style: italic;
    font-size: 70px;
    font-weight: 100;
    line-height: 1.1;
    color: var(--hero-accent);
    margin-bottom: 18px;
    transition: color 0.4s;
  }
  .hero-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    color: var(--hero-sub);
    line-height: 1.75;
    max-width: 500px; margin-bottom: 40px;
    transition: color 0.4s;
  }

  /* ── AIRBNB-STYLE SEARCH BAR ─────────────────────────── */
  .airbnb-bar {
    background: var(--card); border-radius: 100px;
    box-shadow: 0 8px 40px rgba(42,42,42,0.13), 0 1px 4px rgba(0,0,0,0.05);
    display: flex; align-items: center; height: 66px;
    border: 1.5px solid var(--border); position: relative;
    max-width: 580px;
    transition: background 0.3s, border-color 0.3s;
  }
  [data-theme="dark"] .airbnb-bar {
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
  }
  .ab-field {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 0 20px; cursor: pointer; height: 100%; border-radius: 100px;
    transition: background 0.15s; min-width: 0; position: relative; user-select: none;
  }
  .ab-field:hover { background: var(--cream2); }
  .ab-field.open { background: var(--card); box-shadow: 0 4px 20px rgba(42,42,42,0.1); z-index: 10; }
  [data-theme="dark"] .ab-field.open { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .ab-label { font-size: 11px; font-weight: 700; color: var(--text); letter-spacing: 0.02em; margin-bottom: 2px; white-space: nowrap; transition: color 0.3s; }
  .ab-value { font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.3s; }
  .ab-value.filled { color: var(--muted); font-weight: 500; }
  .ab-input {
    border: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: var(--muted); outline: none; width: 100%; padding: 0; cursor: pointer; font-weight: 500;
  }
  .ab-input::placeholder { color: var(--muted); font-weight: 400; }
  .ab-sep { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; transition: background 0.3s; }
  .ab-search-btn {
    height: 50px; border-radius: 100px;
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest2) 100%);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    margin-right: 8px; flex-shrink: 0; padding: 0 18px 0 14px;
    transition: transform 0.15s, box-shadow 0.15s, background 0.3s;
    box-shadow: 0 4px 14px rgba(45,80,22,0.4); color: white;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  }
  .ab-search-btn:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(45,80,22,0.5); }

  /* Calendar dropdown */
  .ab-dropdown {
    position: absolute; top: calc(100% + 14px); left: 50%; transform: translateX(-50%);
    background: var(--card); border-radius: 24px;
    box-shadow: 0 16px 60px rgba(42,42,42,0.15); border: 1px solid var(--border);
    z-index: 200; padding: 24px; min-width: 680px; animation: dropIn 0.18s ease;
    transition: background 0.3s, border-color 0.3s;
  }
  [data-theme="dark"] .ab-dropdown { box-shadow: 0 16px 60px rgba(0,0,0,0.5); }
  .ab-dropdown.guests-drop { min-width: 340px; left: auto; right: 0; transform: none; padding: 20px 24px; animation: dropInRight 0.18s ease; }
  @keyframes dropIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  @keyframes dropInRight { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .cal-tabs { display: flex; justify-content: center; margin-bottom: 22px; }
  .cal-tab-wrap { background: var(--cream2); border-radius: 100px; padding: 4px; display: inline-flex; gap: 2px; transition: background 0.3s; }
  .cal-tab { padding: 8px 24px; border-radius: 100px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--muted); background: transparent; transition: all 0.15s; }
  .cal-tab.active { background: var(--card); color: var(--text); font-weight: 600; box-shadow: 0 2px 8px rgba(42,42,42,0.08); }

  .cal-months { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 20px; }
  .cal-month-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-month-title { font-size: 15px; font-weight: 600; color: var(--text); transition: color 0.3s; }
  .cal-nav-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text); transition: background 0.15s, border-color 0.3s, color 0.3s; }
  .cal-nav-btn:hover { background: var(--cream2); }
  .cal-nav-btn.hidden { visibility: hidden; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-dow { text-align: center; font-size: 11px; font-weight: 600; color: var(--muted); padding-bottom: 10px; letter-spacing: 0.04em; transition: color 0.3s; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 13px; color: var(--text); cursor: pointer; transition: background 0.12s, color 0.12s; position: relative; }
  .cal-day:hover:not(.past):not(.empty) { background: var(--cream2); }
  .cal-day.past { color: var(--border); cursor: default; pointer-events: none; }
  .cal-day.empty { pointer-events: none; }
  .cal-day.in-range { background: rgba(45,80,22,0.1); border-radius: 0; }
  [data-theme="dark"] .cal-day.in-range { background: rgba(129,168,96,0.12); }
  .cal-day.range-start, .cal-day.range-end { background: var(--forest) !important; color: white !important; border-radius: 50% !important; font-weight: 600; }
  .cal-day.range-start.has-end { border-radius: 50% 0 0 50% !important; }
  .cal-day.range-end.has-start { border-radius: 0 50% 50% 0 !important; }
  .cal-day.today::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--forest); border-radius: 50%; }

  .cal-chips { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border); }
  .cal-chip { padding: 7px 16px; border-radius: 100px; border: 1.5px solid var(--border); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); cursor: pointer; transition: all 0.15s; }
  .cal-chip:hover { border-color: var(--forest); color: var(--forest); }
  .cal-chip.active { border-color: var(--forest); background: var(--forest); color: white; font-weight: 600; }

  .guest-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border); transition: border-color 0.3s; }
  .guest-row:last-child { border-bottom: none; padding-bottom: 0; }
  .guest-row:first-child { padding-top: 0; }
  .guest-info-name { font-size: 15px; font-weight: 600; color: var(--text); transition: color 0.3s; }
  .guest-info-desc { font-size: 13px; color: var(--muted); margin-top: 2px; transition: color 0.3s; }
  .guest-counter { display: flex; align-items: center; gap: 14px; }
  .guest-btn { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--forest); transition: all 0.15s; flex-shrink: 0; }
  .guest-btn:hover:not(:disabled) { border-color: var(--forest); background: rgba(45,80,22,0.07); }
  .guest-btn:disabled { opacity: 0.35; cursor: default; }
  .guest-count { font-size: 16px; font-weight: 500; color: var(--text); min-width: 18px; text-align: center; transition: color 0.3s; }

  @media (max-width: 600px) {
    .airbnb-bar { border-radius: 20px; height: auto; flex-direction: column; padding: 12px; gap: 4px; }
    .ab-field { width: 100%; height: 52px; border-radius: 12px; padding: 0 16px; }
    .ab-sep { display: none; }
    .ab-search-btn { width: 100%; border-radius: 12px; height: 46px; margin: 4px 0 0; }
  }

  /* ── SECTION DIVIDER ─────────────────────────────────── */
  .section-divider {
    display: flex; align-items: center; gap: 16px;
    padding: 56px 40px 24px;
    max-width: 1100px; margin: 0 auto;
  }
  .divider-line { flex: 1; height: 1px; background: var(--section-divider-line); opacity: 0.4; transition: background 0.3s; }
  .divider-title {
    font-family: 'MonteCarlo', serif;
    font-style: italic; font-size: 40px; color: var(--divider-title-color);
    white-space: nowrap; transition: color 0.3s;
  }
  .section-tagline {
    font-family: 'Montaga', serif;
    text-align: center;
    font-size: 25px;
    padding: 0 40px 40px;
    max-width: 600px; margin: 0 auto;
    font-style: italic;
    line-height: 1.1;
    color: var(--tagline-color);
    transition: color 0.3s;
  }

  /* ── ROOMS CAROUSEL ──────────────────────────────────── */
  .rooms-section { background: var(--cream); padding-bottom: 64px; transition: background 0.4s; }
  .rooms-track-wrap {
    position: relative; overflow: hidden;
    padding: 0 40px;
  }
  .rooms-track {
    display: flex; gap: 24px;
    transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }
  .room-card {
    flex: 0 0 calc(33.333% - 16px);
    background: var(--white); border-radius: 4px;
    overflow: hidden; cursor: pointer;
    transition: box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.3s;
    border: 1px solid var(--border);
  }
  @media (max-width: 900px) { .room-card { flex: 0 0 calc(50% - 12px); } }
  @media (max-width: 600px) { .room-card { flex: 0 0 calc(85% - 12px); } }
  .room-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,0.12); transform: translateY(-2px); }
  [data-theme="dark"] .room-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
  .room-img-wrap { width: 100%; aspect-ratio: 4/3; overflow: hidden; position: relative; }
  .room-img { width: 100%; height: 100%; object-fit: cover; display: block; background: #C8C9BF; transition: transform 0.4s ease; }
  .room-card:hover .room-img { transform: scale(1.04); }
  .room-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 14px;
  }
  .room-card:hover .room-img-overlay { opacity: 1; }
  .room-view-btn {
    background: rgba(255,255,255,0.92); color: var(--forest);
    border: none; border-radius: 100px; padding: 7px 16px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    backdrop-filter: blur(4px);
  }
  .room-body { padding: 20px; }
  .room-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--text); margin-bottom: 6px; transition: color 0.3s; }
  .room-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; transition: color 0.3s; }
  .room-meta { display: flex; align-items: center; justify-content: space-between; }
  .room-price { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--forest); transition: color 0.3s; }
  .room-price span { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--muted); font-weight: 400; }
  .room-guests { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; transition: color 0.3s; }

  .carousel-nav {
    display: flex; justify-content: center; gap: 12px; margin-top: 32px; align-items: center;
  }
  .carousel-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text); transition: all 0.2s;
  }
  .carousel-btn:hover:not(:disabled) { border-color: var(--rust); color: var(--rust); }
  .carousel-btn:disabled { opacity: 0.35; cursor: default; }

  .show-more-wrap { text-align: center; margin-top: 40px; }
  .show-more-btn {
    background: var(--forest); color: white;
    border: none; border-radius: 6px; padding: 12px 36px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: background 0.2s;
  }
  .show-more-btn:hover { background: var(--forest2); }

  /* ── GALLERY ─────────────────────────────────────────── */
  .gallery-section { background: var(--cream2); padding-bottom: 64px; transition: background 0.4s; }
  .gallery-viewer {
    position: relative; max-width: 900px; margin: 0 auto;
    padding: 0 40px;
  }
  .gallery-main {
    width: 100%; aspect-ratio: 16/9;
    background: var(--gallery-bg); border-radius: 4px; overflow: hidden;
    position: relative; transition: background 0.3s;
  }
  .gallery-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gallery-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.85);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text); z-index: 10;
    backdrop-filter: blur(4px);
    transition: all 0.2s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  }
  [data-theme="dark"] .gallery-btn { background: rgba(28,36,20,0.85); border-color: rgba(129,168,96,0.4); color: var(--text); }
  .gallery-btn:hover { background: white; transform: translateY(-50%) scale(1.05); }
  [data-theme="dark"] .gallery-btn:hover { background: var(--card); }
  .gallery-btn.prev { left: 56px; }
  .gallery-btn.next { right: 56px; }
  @media (max-width: 600px) { .gallery-btn.prev { left: 48px; } .gallery-btn.next { right: 48px; } }
  .gallery-counter { text-align: center; margin-top: 14px; font-size: 12px; color: var(--muted); transition: color 0.3s; }
  .gallery-dots { display: flex; justify-content: center; gap: 6px; margin-top: 16px; }
  .gallery-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--border); cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .gallery-dot.active { background: var(--rust); transform: scale(1.3); }

  /* ── FAQS ────────────────────────────────────────────── */
  .faqs-section { background: var(--cream); padding-bottom: 80px; transition: background 0.4s; }
  .faqs-inner { max-width: 920px; margin: 0 auto; padding: 0 40px; }
  .faqs-header { text-align: center; margin-bottom: 48px; }
  .faqs-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 28px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--rust);
    margin-bottom: 10px; position: relative; display: inline-block;
    transition: color 0.3s;
  }
  .faqs-title::after {
    content: ''; display: block;
    width: 100%; height: 2px;
    background: var(--rust); opacity: 0.5;
    margin-top: 8px; transition: background 0.3s;
  }
  .faqs-subtitle { font-family: 'Manuale', serif; font-size: 20px; color: var(--tagline-color); margin-top: 12px; transition: color 0.3s; }

  .faq-categories {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .faq-category-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--forest);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--border);
    transition: color 0.3s, border-color 0.3s;
  }

  .faq-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .faq-item {
    border-radius: 8px;
    overflow: hidden;
    background: var(--card);
    border: 1px solid var(--border);
    transition: box-shadow 0.2s, background 0.4s, border-color 0.3s;
  }
  .faq-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  [data-theme="dark"] .faq-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }

  .faq-question {
    width: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 16px 20px; 
    background: transparent; 
    border: none; 
    cursor: pointer;
    text-align: left; 
    gap: 16px;
  }
  .faq-question-text {
    font-family: 'DM Sans', sans-serif; 
    font-size: 16px; 
    font-weight: 400;
    color: var(--text); 
    line-height: 1.4; 
    transition: color 0.3s;
  }
  .faq-chevron {
    flex-shrink: 0; 
    color: var(--forest); 
    background: var(--cream2);
    border-radius: 4px; 
    padding: 4px;
    transition: transform 0.3s ease, color 0.3s, background 0.3s; 
    display: flex; 
    align-items: center; 
    justify-content: center;
  }
  .faq-chevron.open { transform: rotate(45deg); background: var(--forest); color: white; }
  .faq-answer {
    max-height: 0; 
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.3s ease;
    padding: 0 20px;
    font-family: 'DM Sans', sans-serif; 
    font-size: 14px; 
    color: var(--muted);
    line-height: 1.7;
    background: var(--cream2);
  }
  [data-theme="dark"] .faq-answer { background: rgba(26,31,20,0.5); }
  .faq-answer.open { max-height: 300px; padding: 0 20px 16px 20px; }

  /* ── CONTACT ─────────────────────────────────────────── */
  .contact-section { background: var(--cream); padding-bottom: 80px; transition: background 0.4s; }
  .contact-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start;
  }
  @media (max-width: 768px) { .contact-inner { grid-template-columns: 1fr; } }

  .contact-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 44px; font-weight: 600;
    color: var(--rust); margin-bottom: 10px; line-height: 1.1; transition: color 0.3s;
  }
  .contact-sub { font-family: 'Montaga', serif; font-size: 22px; color: var(--tagline-color); line-height: 1.5; margin-bottom: 32px; transition: color 0.3s; }
  .contact-field { margin-bottom: 20px; }
  .contact-field label { font-family: 'Montaga', serif; display: block; font-size: 15px; font-weight: 500; color: var(--contact-lbl); letter-spacing: 0.06em; text-transform: capitalize; margin-bottom: 6px; transition: color 0.3s; }
  .contact-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--input-border);
    background: var(--input-bg);
    padding: 8px 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, color 0.3s;
  }
  .contact-input:focus { border-color: var(--forest); }
  .contact-input::placeholder { color: var(--muted); }
  textarea.contact-input { resize: none; height: 80px; }
  .contact-btn {
    background: var(--forest); color: white;
    border: none; border-radius: 6px; padding: 11px 28px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.2s; margin-top: 8px;
  }
  .contact-btn:hover { background: var(--forest2); }
  .contact-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .contact-info-col {
    display: flex; flex-direction: column; gap: 12px;
  }
  .contact-info-cards {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .contact-info-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 18px;
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  }
  .contact-info-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  [data-theme="dark"] .contact-info-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
  .contact-info-card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--forest);
    margin-bottom: 10px; transition: color 0.3s;
  }
  .contact-info-card-row {
    display: flex; align-items: flex-start; gap: 7px;
    font-size: 12px; color: var(--muted); line-height: 1.55;
    margin-bottom: 6px; transition: color 0.3s;
  }
  .contact-info-card-row:last-child { margin-bottom: 0; }
  .contact-info-card-row svg { flex-shrink: 0; margin-top: 1px; color: var(--rust); }
  .contact-info-card-row a { color: var(--forest); text-decoration: none; transition: color 0.2s; }
  .contact-info-card-row a:hover { color: var(--forest2); text-decoration: underline; }

  .contact-map-wrap {
    width: 100%; border-radius: 8px; overflow: hidden;
    border: 1px solid var(--border);
    aspect-ratio: 16/9;
    transition: border-color 0.3s;
  }
  .contact-map-wrap iframe {
    width: 100%; height: 100%; display: block; border: none;
  }

  /* Contact status message */
  .contact-status {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  }
  .contact-status.success {
    background: rgba(45, 80, 22, 0.1);
    border-left: 3px solid var(--forest);
    color: var(--forest);
  }
  .contact-status.error {
    background: rgba(139, 58, 42, 0.1);
    border-left: 3px solid var(--rust);
    color: var(--rust);
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ── Calendar helpers ───────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['S','M','T','W','T','F','S'];
function isSameDay(a,b){ return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function isBetween(d,a,b){ if(!a||!b)return false; const[s,e]=a<b?[a,b]:[b,a]; return d>s&&d<e; }

function CalendarMonth({ year, month, startDate, endDate, hoverDate, onDayClick, onDayHover, showPrev, showNext, onPrev, onNext }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const cells = [];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(new Date(year,month,d));
  const rangeEnd = endDate||hoverDate;
  return (
    <div>
      <div className="cal-month-head">
        <button className={`cal-nav-btn${!showPrev?' hidden':''}`} onClick={onPrev}><ChevronLeft size={14}/></button>
        <span className="cal-month-title">{MONTHS[month]} {year}</span>
        <button className={`cal-nav-btn${!showNext?' hidden':''}`} onClick={onNext}><ChevronRight size={14}/></button>
      </div>
      <div className="cal-grid">
        {DAYS.map((d,i)=><div key={i} className="cal-dow">{d}</div>)}
        {cells.map((day,i)=>{
          if(!day) return <div key={i} className="cal-day empty"/>;
          const isPast=day<today, isStart=isSameDay(day,startDate), isEnd=isSameDay(day,endDate);
          const inRange=!isPast&&isBetween(day,startDate,rangeEnd), isToday=isSameDay(day,today);
          let cls='cal-day';
          if(isPast) cls+=' past';
          if(isStart) cls+=` range-start${endDate?' has-end':''}`;
          if(isEnd)   cls+=` range-end${startDate?' has-start':''}`;
          if(inRange) cls+=' in-range';
          if(isToday) cls+=' today';
          return <div key={i} className={cls} onClick={()=>!isPast&&onDayClick(day)} onMouseEnter={()=>!isPast&&onDayHover(day)}>{day.getDate()}</div>;
        })}
      </div>
    </div>
  );
}

/* ── Helper function to get badge by room type ───────────────────── */
const getBadgeByType = (type) => {
  const badges = {
    'Standard': 'Classic',
    'Superior': 'Premium',
    'Deluxe': 'Luxury',
    'Suite': 'VIP Suite'
  };
  return badges[type] || 'Featured';
};

/* ── Placeholder images (same as in RoomManagement) ───────────────────── */
const TYPE_IMAGES = {
  Standard:  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  Superior:  'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=600&q=80',
  Deluxe:    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  Suite:     'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
};

/* ── Fallback gallery images ───────────────────────────────────── */
const FALLBACK_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
];

/* ─── Main Component ─────────────────────────────────────── */
export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY_IMAGES);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]             = useState(null);
  const [location, setLocation]     = useState('');
  const [startDate, setStartDate]   = useState(null);
  const [endDate, setEndDate]       = useState(null);
  const [hoverDate, setHoverDate]   = useState(null);
  const [calTab, setCalTab]         = useState('dates');
  const [flexChip, setFlexChip]     = useState('exact');
  const [calOffset, setCalOffset]   = useState(0);
  const [guests, setGuests]         = useState({adults:0,children:0,infants:0,pets:0});
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [galleryIdx, setGalleryIdx]   = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const barRef = useRef(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch rooms and gallery images from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch ALL rooms (no status filter)
        let roomsData = [];
        try {
          const roomsCollection = collection(db, 'rooms');
          const roomsQuery = query(roomsCollection, orderBy('createdAt', 'desc'));
          const roomsSnapshot = await getDocs(roomsQuery);
          
          console.log('📊 Total rooms found in Firebase:', roomsSnapshot.size);
          
          if (!roomsSnapshot.empty) {
            roomsData = roomsSnapshot.docs.map(doc => {
              const data = doc.data();
              console.log('🏠 Room found:', { id: doc.id, name: data.name, type: data.type, status: data.status, price: data.ratePerDay });
              return {
                id: doc.id,
                name: data.name || 'Luxury Room',
                type: data.type || 'Standard',
                desc: data.description || 'A serene haven designed for your comfort.',
                price: data.ratePerDay || 180,
                guests: data.capacity || 2,
                capacity: data.capacity || 2,
                image: data.imageUrl || TYPE_IMAGES[data.type] || TYPE_IMAGES.Standard,
                imageUrl: data.imageUrl,
                badge: getBadgeByType(data.type),
                rating: 4.8,
                reviews: 128,
                location: data.floor ? `${data.type} Room, Floor ${data.floor}` : `${data.type} Room`,
                longDesc: data.description || 'Experience luxury and comfort in our carefully designed spaces.',
                amenities: data.amenities || ['WiFi', 'AC', 'TV'],
                status: data.status
              };
            });
            console.log(`✅ Loaded ${roomsData.length} rooms from Firebase`);
          } else {
            console.log('⚠️ No rooms found in Firebase - showing empty state');
          }
        } catch (roomError) {
          console.error('❌ Error fetching rooms:', roomError);
        }
        setRooms(roomsData);
        setFilteredRooms(roomsData); // Initialize filtered rooms with all rooms

        // Fetch gallery images
        try {
          const galleryCollection = collection(db, 'gallery');
          const galleryQuery = query(galleryCollection, orderBy('order', 'asc'));
          const gallerySnapshot = await getDocs(galleryQuery);
          
          if (!gallerySnapshot.empty) {
            const galleryData = gallerySnapshot.docs.map(doc => doc.data().url).filter(url => url);
            if (galleryData.length > 0) {
              setGalleryImages(galleryData);
              console.log(`✅ Loaded ${galleryData.length} gallery images from Firebase`);
            } else {
              console.log('⚠️ Gallery collection empty - using fallback images');
              setGalleryImages(FALLBACK_GALLERY_IMAGES);
            }
          } else {
            console.log('⚠️ No gallery collection found - using fallback images');
            setGalleryImages(FALLBACK_GALLERY_IMAGES);
          }
        } catch (galleryError) {
          console.error('❌ Error fetching gallery images:', galleryError);
          setGalleryImages(FALLBACK_GALLERY_IMAGES);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setRooms([]);
        setFilteredRooms([]);
        setGalleryImages(FALLBACK_GALLERY_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter rooms based on search criteria
  useEffect(() => {
    if (!rooms.length) return;
    
    let filtered = [...rooms];
    const totalGuestsCount = guests.adults + guests.children;
    
    // Filter by location/room name search
    if (location.trim()) {
      const searchTerm = location.toLowerCase().trim();
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchTerm) || 
        room.type.toLowerCase().includes(searchTerm) ||
        room.desc.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by date availability (if dates are selected)
    if (startDate && endDate) {
      // This is a placeholder - implement actual availability checking
      // For now, we'll show all rooms but you can add your availability logic here
      filtered = filtered.filter(room => {
        // Check if room is available between startDate and endDate
        // You'll need to implement this based on your booking data structure
        return true; // Placeholder - implement actual availability check
      });
    }
    
    // Filter by guest capacity
    if (totalGuestsCount > 0) {
      filtered = filtered.filter(room => (room.capacity || room.guests) >= totalGuestsCount);
    }
    
    setFilteredRooms(filtered);
    
    // Reset carousel index when filtered rooms change
    setCarouselIdx(0);
    
  }, [rooms, location, startDate, endDate, guests.adults, guests.children]);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus({ type: 'error', message: 'Please fill in all fields' });
      setTimeout(() => setContactStatus({ type: '', message: '' }), 3000);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactStatus({ type: 'error', message: 'Please enter a valid email address' });
      setTimeout(() => setContactStatus({ type: '', message: '' }), 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to Firebase
      const contactRef = collection(db, 'contacts');
      await addDoc(contactRef, {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim() || null,
        message: contactForm.message.trim(),
        status: 'unread',
        starred: false,
        createdAt: serverTimestamp(),
        date: new Date().toISOString()
      });
      
      // Show success message
      setContactStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
      
      // Reset form
      setContactForm({ name: '', email: '', phone: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setContactStatus({ type: '', message: '' }), 5000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setContactStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      setTimeout(() => setContactStatus({ type: '', message: '' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests === 0 ? null : totalGuests === 1 ? '1 guest' : `${totalGuests} guests`
    + (guests.infants ? `, ${guests.infants} infant${guests.infants>1?'s':''}` : '')
    + (guests.pets    ? `, ${guests.pets} pet${guests.pets>1?'s':''}` : '');

  const adjGuest = (key, delta) => setGuests(g => ({...g, [key]: Math.max(0, g[key]+delta)}));

  const today = new Date(); today.setHours(0,0,0,0);
  const baseDate = new Date(today.getFullYear(), today.getMonth()+calOffset, 1);
  const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth()+1, 1);

  function handleDayClick(day) {
    if (!startDate || (startDate && endDate)) { setStartDate(day); setEndDate(null); setHoverDate(null); }
    else { if (day < startDate) { setStartDate(day); setEndDate(null); } else { setEndDate(day); setHoverDate(null); } }
  }
  const fmt = d => d ? d.toLocaleDateString('en-US',{month:'short',day:'numeric'}) : null;
  const whenLabel = startDate && endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : startDate ? `${fmt(startDate)} – ?` : null;

  const visibleCount = 3;
  const maxIdx = Math.max(0, filteredRooms.length - visibleCount);

  useEffect(() => {
    const h = e => { if(barRef.current && !barRef.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const prevGallery = () => setGalleryIdx(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const nextGallery = () => setGalleryIdx(i => (i + 1) % galleryImages.length);

  // Clear all filters
  const clearFilters = () => {
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setGuests({adults:0, children:0, infants:0, pets:0});
    setOpen(null);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="solaz-root">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016] mb-4"></div>
              <p style={{ color: '#7A6A4E' }}>Loading Solaz...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (selectedRoom) {
    return (
      <>
        <style>{styles}</style>
        <div className="solaz-root">
          <Rooms room={selectedRoom} onBack={() => setSelectedRoom(null)}/>
        </div>
      </>
    );
  }

  const isSearchActive = location.trim() !== '' || (startDate && endDate) || totalGuests > 0;

  return (
    <>
      <style>{styles}</style>
      <div className="solaz-root">

        {/* ── HERO ────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-left">
            <h1 className="hero-h1">Where comfort<br/>meets the key.</h1>
            <p className="hero-sub">Solaz is the modern gateway to your next sanctuary. We've redefined room booking by prioritizing peace of mind and effortless access. Whether you're escaping the city's chaos or exploring at your own pace, we're focused on making your search to stay as smooth as possible. Solaz: Where comfort meets the key.</p>

            <div className="airbnb-bar" ref={barRef}>
              {/* Where */}
              <div className={`ab-field${open==='location'?' open':''}`} style={{flex:1.6}}
                onClick={()=>setOpen(o=>(o==='location'?null:'location'))}>
                <div className="ab-label">Where</div>
                {open==='location' ? (
                  <input className="ab-input" placeholder="Search rooms by name or type" value={location}
                    onChange={e=>setLocation(e.target.value)} onClick={e=>e.stopPropagation()} autoFocus/>
                ) : (
                  <div className={`ab-value${location?' filled':''}`}>{location||'Search rooms by name or type'}</div>
                )}
              </div>
              <div className="ab-sep"/>
              {/* When */}
              <div className={`ab-field${open==='when'?' open':''}`} style={{flex:1.4}}
                onClick={()=>setOpen(o=>(o==='when'?null:'when'))}>
                <div className="ab-label">When</div>
                <div className={`ab-value${whenLabel?' filled':''}`}>{whenLabel||'Add dates'}</div>
                {open==='when' && (
                  <div className="ab-dropdown" onClick={e=>e.stopPropagation()}>
                    <div className="cal-tabs">
                      <div className="cal-tab-wrap">
                        <button className={`cal-tab${calTab==='dates'?' active':''}`} onClick={()=>setCalTab('dates')}>Dates</button>
                        <button className={`cal-tab${calTab==='flexible'?' active':''}`} onClick={()=>setCalTab('flexible')}>Flexible</button>
                      </div>
                    </div>
                    {calTab==='dates' && (
                      <>
                        <div className="cal-months">
                          <CalendarMonth year={baseDate.getFullYear()} month={baseDate.getMonth()}
                            startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                            onDayClick={handleDayClick} onDayHover={setHoverDate}
                            showPrev={calOffset>0} showNext={false}
                            onPrev={()=>setCalOffset(o=>o-1)} onNext={()=>setCalOffset(o=>o+1)}/>
                          <CalendarMonth year={nextDate.getFullYear()} month={nextDate.getMonth()}
                            startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                            onDayClick={handleDayClick} onDayHover={setHoverDate}
                            showPrev={false} showNext={true}
                            onPrev={()=>setCalOffset(o=>o-1)} onNext={()=>setCalOffset(o=>o+1)}/>
                        </div>
                        <div className="cal-chips">
                          {[['exact','Exact dates'],['1','± 1 day'],['2','± 2 days'],['3','± 3 days'],['7','± 7 days'],['14','± 14 days']].map(([v,l])=>(
                            <button key={v} className={`cal-chip${flexChip===v?' active':''}`} onClick={()=>setFlexChip(v)}>{l}</button>
                          ))}
                        </div>
                      </>
                    )}
                    {calTab==='flexible' && (
                      <div style={{textAlign:'center',padding:'40px 0',color:'var(--muted)',fontSize:14}}>
                        Flexible date search coming soon ✨
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="ab-sep"/>
              {/* Who */}
              <div className={`ab-field${open==='who'?' open':''}`} style={{flex:0.8}}
                onClick={()=>setOpen(o=>(o==='who'?null:'who'))}>
                <div className="ab-label">Who</div>
                <div className={`ab-value${guestLabel?' filled':''}`}>{guestLabel||'Add guests'}</div>
                {open==='who' && (
                  <div className="ab-dropdown guests-drop" onClick={e=>e.stopPropagation()}>
                    {[
                      {key:'adults',   label:'Adults',   desc:'Ages 13 or above'},
                      {key:'children', label:'Children', desc:'Ages 2 – 12'},
                      {key:'infants',  label:'Infants',  desc:'Under 2'},
                      {key:'pets',     label:'Pets',     desc:'Bringing a service animal?'},
                    ].map(({key,label,desc})=>(
                      <div key={key} className="guest-row">
                        <div>
                          <div className="guest-info-name">{label}</div>
                          <div className="guest-info-desc">{desc}</div>
                        </div>
                        <div className="guest-counter">
                          <button className="guest-btn" disabled={guests[key]<=0} onClick={()=>adjGuest(key,-1)}><Minus size={14}/></button>
                          <span className="guest-count">{guests[key]}</span>
                          <button className="guest-btn" onClick={()=>adjGuest(key,1)}><Plus size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="ab-search-btn" onClick={() => setOpen(null)}>
                <Search size={20}/>
              </button>
            </div>
          </div>
          <div className="hero-right">
            <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80" alt="Solaz property"/>
          </div>
        </section>

        {/* ── OUR ROOMS ───────────────────────────────── */}
        <section className="rooms-section" id="rooms-section">
          <div className="section-divider">
            <div className="divider-line"/>
            <div className="divider-title">Our Rooms</div>
            <div className="divider-line"/>
          </div>
          <p className="section-tagline">A quiet retreat designed for your comfort and ease.</p>

          {filteredRooms.length > 0 ? (
            <div style={{position:'relative'}}>
              {/* Search results summary */}
              {isSearchActive && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px',
                  padding: '12px 20px',
                  backgroundColor: 'var(--forest)',
                  color: 'white',
                  borderRadius: '100px',
                  display: 'inline-block',
                  width: 'auto',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Found {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} matching your search
                  <button 
                    onClick={clearFilters}
                    style={{
                      marginLeft: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '100px',
                      padding: '4px 12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              
              <div className="rooms-track-wrap">
                <div className="rooms-track" style={{transform:`translateX(calc(-${carouselIdx} * (100% / 3 + 8px)))`}}>
                  {filteredRooms.map(room => (
                    <div key={room.id} className="room-card" onClick={() => setSelectedRoom(room)}>
                      <div className="room-img-wrap">
                        <img className="room-img" src={room.image} alt={room.name} onError={(e) => {
                          e.target.src = TYPE_IMAGES.Standard;
                        }}/>
                        <div className="room-img-overlay">
                          <button className="room-view-btn" onClick={e => { e.stopPropagation(); setSelectedRoom(room); }}>
                            <Eye size={12}/> View Room
                          </button>
                        </div>
                      </div>
                      <div className="room-body">
                        <div className="room-name">{room.name}</div>
                        <div className="room-desc">{room.desc}</div>
                        <div className="room-meta">
                          <div className="room-price">₱{room.price}<span>/night</span></div>
                          <div className="room-guests"><Users size={12}/>{room.guests} guests</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {filteredRooms.length > 3 && (
                <div className="carousel-nav">
                  <button 
                    className="carousel-btn" 
                    disabled={carouselIdx === 0} 
                    onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}
                  >
                    <ChevronLeft size={16}/>
                  </button>
                  {Array.from({length: Math.min(filteredRooms.length, visibleCount)}).map((_,i) => (
                    <div 
                      key={i} 
                      onClick={() => setCarouselIdx(i)} 
                      style={{
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        background: i === carouselIdx ? 'var(--rust)' : 'var(--border)',
                        transition: 'background 0.2s', 
                        alignSelf: 'center'
                      }}
                    />
                  ))}
                  <button 
                    className="carousel-btn" 
                    disabled={carouselIdx >= maxIdx} 
                    onClick={() => setCarouselIdx(i => Math.min(i + 1, maxIdx))}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4">
                <Search size={48} style={{ color: '#A89878', opacity: 0.5, margin: '0 auto' }} />
              </div>
              <p style={{ color: '#A89878', fontSize: '18px', fontWeight: 500 }}>No rooms match your search</p>
              <p style={{ color: '#A89878', fontSize: '14px', marginTop: '8px' }}>
                Try adjusting your search criteria or 
                <button 
                  onClick={clearFilters}
                  style={{ 
                    color: 'var(--forest)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}
                >
                  clear all filters
                </button>
              </p>
            </div>
          )}
        </section>

        {/* ── GALLERY ─────────────────────────────────── */}
        <section className="gallery-section" id="gallery-section">
          <div className="section-divider">
            <div className="divider-line"/>
            <div className="divider-title">Gallery</div>
            <div className="divider-line"/>
          </div>
          <p className="section-tagline">Visions of solace designed to inspire your next stay.</p>
          
          {galleryImages.length > 0 ? (
            <div className="gallery-viewer">
              <div className="gallery-main">
                <img src={galleryImages[galleryIdx]} alt={`Gallery ${galleryIdx+1}`}/>
                <button className="gallery-btn prev" onClick={prevGallery}><ChevronLeft size={18}/></button>
                <button className="gallery-btn next" onClick={nextGallery}><ChevronRight size={18}/></button>
              </div>
              <div className="gallery-dots">
                {galleryImages.map((_,i)=>(
                  <div key={i} className={`gallery-dot${i===galleryIdx?' active':''}`} onClick={()=>setGalleryIdx(i)}/>
                ))}
              </div>
              <div className="gallery-counter">{galleryIdx+1} / {galleryImages.length}</div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4">
                <ImageIcon size={48} style={{ color: '#A89878', opacity: 0.5, margin: '0 auto' }} />
              </div>
              <p style={{ color: '#A89878', fontSize: '18px', fontWeight: 500 }}>No Gallery Images Available</p>
              <p style={{ color: '#A89878', fontSize: '14px', marginTop: '8px' }}>Our beautiful gallery will be updated soon.</p>
            </div>
          )}
        </section>

        {/* ── CONTACT ─────────────────────────────────── */}
        <section className="contact-section" id="contact-section">
          <div className="section-divider">
            <div className="divider-line"/>
            <div className="divider-title">Contact</div>
            <div className="divider-line"/>
          </div>
          <div className="contact-inner">

            <div className="contact-left">
              <div className="contact-h2">Get in touch</div>
              <p className="contact-sub">Reach out and let us help you find your perfect space.</p>
              
              {/* Status message */}
              {contactStatus.message && (
                <div className={`contact-status ${contactStatus.type}`}>
                  {contactStatus.message}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit}>
                <div className="contact-field">
                  <label>Full name *</label>
                  <input 
                    className="contact-input" 
                    placeholder="Full Name" 
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="contact-field">
                  <label>Email *</label>
                  <input 
                    className="contact-input" 
                    placeholder="your@example.com" 
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
               <div className="contact-field">
                <label>Phone Number *</label>
                <input 
                  className="contact-input" 
                  placeholder="09171234567" 
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => {
                    // Allow only numbers and limit to 11 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setContactForm({...contactForm, phone: value});
                  }}
                  pattern="[0-9]{11}"
                  maxLength="11"
                  required
                />
                {contactForm.phone && contactForm.phone.length !== 11 && (
                  <small style={{ color: 'var(--rust)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Phone number must be exactly 11 digits
                  </small>
                )}
              </div>
                
                <div className="contact-field">
                  <label>Message *</label>
                  <textarea 
                    className="contact-input" 
                    placeholder="Tell us about your stay…"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="contact-btn"
                  disabled={isSubmitting}
                  style={{
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="contact-info-col">
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <div className="contact-info-card-title">Our Location</div>
                  <div className="contact-info-card-row">
                    <MapPin size={13}/>
                    <span>Victor Wahing Street, Alegria, Cordova, 6017 Cebu, Philippines</span>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-card-title">Contact Info</div>
                  <div className="contact-info-card-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
                    <span>+63 932 517 8889</span>
                  </div>
                  <div className="contact-info-card-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span><a href="mailto:solazhotels@gmail.com">solazhotels@gmail.com</a></span>
                  </div>
                  <div className="contact-info-card-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Reception: 24/7</span>
                  </div>
                </div>
              </div>

              <div className="contact-map-wrap">
                <iframe
                  title="Solaz Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.862412850785!2d123.9515514!3d10.272765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a065606835d%3A0x34aca4149a45ef14!2sVictor%20Wahing%20St%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1715678901234!5m2!1sen!2sph"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQS ────────────────────────────────────── */}
        <section className="faqs-section" id="faqs-section">
          <div className="section-divider">
            <div className="divider-line"/>
            <div className="divider-title">FAQs</div>
            <div className="divider-line"/>
          </div>
          <div className="faqs-inner">
            <div className="faqs-header">
              <div className="faqs-title">Frequently Asked Questions</div>
              <p className="faqs-subtitle">Got questions? We're here to help you find your peace.</p>
            </div>
            
            <div className="faq-categories">
              <div className="faq-category">
                <h3 className="faq-category-title">BOOKING & RESERVATIONS</h3>
                <div className="faq-items">
                  <div className="faq-item">
                    <button className="faq-question" onClick={() => setFaqOpen(faqOpen === 'booking1' ? null : 'booking1')}>
                      <span className="faq-question-text">How do I make a reservation?</span>
                      <span className={`faq-chevron${faqOpen === 'booking1' ? ' open' : ''}`}>
                        <Plus size={18}/>
                      </span>
                    </button>
                    <div className={`faq-answer${faqOpen === 'booking1' ? ' open' : ''}`}>
                      You can make a reservation directly through our website using the search bar above, or by contacting our reservations team at +63 32 517 8889. We recommend booking in advance to secure your preferred dates.
                    </div>
                  </div>
                  
                  <div className="faq-item">
                    <button className="faq-question" onClick={() => setFaqOpen(faqOpen === 'booking2' ? null : 'booking2')}>
                      <span className="faq-question-text">What is the check-in and check-out time?</span>
                      <span className={`faq-chevron${faqOpen === 'booking2' ? ' open' : ''}`}>
                        <Plus size={18}/>
                      </span>
                    </button>
                    <div className={`faq-answer${faqOpen === 'booking2' ? ' open' : ''}`}>
                      Check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged subject to availability. Please contact us in advance and we'll do our best to accommodate your request.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="faq-category">
                <h3 className="faq-category-title">CANCELLATIONS & REFUNDS</h3>
                <div className="faq-items">
                  <div className="faq-item">
                    <button className="faq-question" onClick={() => setFaqOpen(faqOpen === 'cancellation' ? null : 'cancellation')}>
                      <span className="faq-question-text">What is your cancellation policy?</span>
                      <span className={`faq-chevron${faqOpen === 'cancellation' ? ' open' : ''}`}>
                        <Plus size={18}/>
                      </span>
                    </button>
                    <div className={`faq-answer${faqOpen === 'cancellation' ? ' open' : ''}`}>
                      Cancellations made 72 hours or more before check-in are fully refunded. Cancellations within 48–72 hours receive a 50% refund. Changes to dates are subject to availability and any rate differences. Please review our full policy at time of booking.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="faq-category">
                <h3 className="faq-category-title">AMENITIES & SERVICES</h3>
                <div className="faq-items">
                  <div className="faq-item">
                    <button className="faq-question" onClick={() => setFaqOpen(faqOpen === 'breakfast' ? null : 'breakfast')}>
                      <span className="faq-question-text">Is breakfast included in the stay?</span>
                      <span className={`faq-chevron${faqOpen === 'breakfast' ? ' open' : ''}`}>
                        <Plus size={18}/>
                      </span>
                    </button>
                    <div className={`faq-answer${faqOpen === 'breakfast' ? ' open' : ''}`}>
                      Yes, a complimentary breakfast is included with all stays. We serve a farm-to-table breakfast daily from 7:00 AM to 10:30 AM in our dining room, featuring local produce and artisanal products.
                    </div>
                  </div>
                  
                  <div className="faq-item">
                    <button className="faq-question" onClick={() => setFaqOpen(faqOpen === 'wifi' ? null : 'wifi')}>
                      <span className="faq-question-text">Do you have high-speed Wi-Fi?</span>
                      <span className={`faq-chevron${faqOpen === 'wifi' ? ' open' : ''}`}>
                        <Plus size={18}/>
                      </span>
                    </button>
                    <div className={`faq-answer${faqOpen === 'wifi' ? ' open' : ''}`}>
                      Yes, we offer complimentary high-speed Wi-Fi throughout the property. The connection is suitable for video calls, streaming, and all your connectivity needs. Ask our staff for the network password upon check-in.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}