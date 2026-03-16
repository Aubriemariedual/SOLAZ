import React, { useState, useRef, useEffect } from 'react';
import {
  Search, MapPin, Calendar, Users, Heart, ChevronLeft, ChevronRight,
  Plus, Minus, X, Wifi, Wind, Car, Bath, Home as HomeIcon, Utensils,
  Star, Waves, Coffee, Tv, Shield, Phone, ArrowLeft, Award, Maximize2, Coffee as CoffeeIcon, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:   #F0EFE4;
    --cream2:  #E8E7DA;
    --forest:  #2D5016;
    --forest2: #3D6B20;
    --rust:    #8B3A2A;
    --text:    #2A2A2A;
    --muted:   #6B6B5A;
    --border:  #D0CFC0;
    --white:   #FFFFFF;
    --gold:    #C6A43F;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rooms-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    position: relative;
  }

  /* Back button */
  .rooms-back-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-decoration: none;
  }

  .rooms-back-btn:hover {
    transform: translateX(-5px);
    border-color: var(--rust);
    color: var(--rust);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

  /* ── HERO SECTION ──────────────────────────────────────── */
  .rp-hero {
    background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=80');
    background-size: cover;
    background-position: center;
    padding: 100px 40px 80px;
    text-align: center;
    color: white;
  }

  .rp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 600;
    margin-bottom: 16px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }

  .rp-hero-subtitle {
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.95;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  /* ── SEARCH BAR (CENTERED) ───────────────────────────── */
  .rp-search-wrap {
    padding: 0 40px;
    max-width: 1200px;
    margin: -30px auto 0;
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
  }
  
  .airbnb-bar {
    background: var(--white);
    border-radius: 100px;
    box-shadow: 0 20px 50px rgba(42,42,42,0.2);
    display: flex;
    align-items: center;
    height: 72px;
    border: 1px solid var(--border);
    width: 100%;
    max-width: 1000px;
    position: relative;
  }
  
  .ab-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24px;
    cursor: pointer;
    height: 100%;
    border-radius: 100px;
    transition: background 0.15s;
    min-width: 0;
    position: relative;
  }
  .ab-field:hover { background: var(--cream2); }
  .ab-field.open { background: var(--white); box-shadow: 0 4px 20px rgba(42,42,42,0.1); z-index: 10; }
  .ab-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.03em;
    margin-bottom: 2px;
  }
  .ab-value {
    font-size: 14px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ab-value.filled {
    color: var(--forest);
    font-weight: 500;
  }
  .ab-input {
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    width: 100%;
  }
  .ab-input::placeholder { color: #b0b0b0; }
  .ab-sep {
    width: 1px;
    height: 32px;
    background: var(--border);
    flex-shrink: 0;
  }
  .ab-search-btn {
    height: 54px;
    border-radius: 100px;
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    flex-shrink: 0;
    padding: 0 26px;
    box-shadow: 0 6px 18px rgba(45,80,22,0.3);
    color: white;
    transition: transform 0.15s, box-shadow 0.15s;
    font-weight: 500;
    gap: 8px;
  }
  .ab-search-btn:hover { transform: scale(1.02); box-shadow: 0 8px 25px rgba(45,80,22,0.4); }

  /* Dropdowns - same as before */
  .ab-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--white);
    border-radius: 20px;
    box-shadow: 0 16px 60px rgba(42,42,42,0.15);
    border: 1px solid var(--border);
    z-index: 300;
    padding: 20px;
    min-width: 620px;
    animation: dropIn 0.18s ease;
  }
  .ab-dropdown.guests-drop {
    min-width: 320px;
    left: auto;
    right: 0;
    transform: none;
    animation: dropInR 0.18s ease;
  }
  @keyframes dropIn { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  @keyframes dropInR { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  .cal-months { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .cal-month-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .cal-month-title { font-size: 14px; font-weight: 600; }
  .cal-nav-btn { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .cal-nav-btn:hover { background: var(--cream2); }
  .cal-nav-btn.hidden { visibility: hidden; }
  .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
  .cal-dow { text-align: center; font-size: 10px; font-weight: 600; color: var(--muted); padding-bottom: 8px; letter-spacing: 0.04em; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 12px; cursor: pointer; transition: background 0.12s; }
  .cal-day:hover:not(.past):not(.empty) { background: var(--cream2); }
  .cal-day.past { color: var(--border); pointer-events: none; }
  .cal-day.empty { pointer-events: none; }
  .cal-day.in-range { background: rgba(45,80,22,0.1); border-radius: 0; }
  .cal-day.range-start, .cal-day.range-end { background: var(--forest) !important; color: white !important; border-radius: 50% !important; font-weight: 600; }
  .cal-day.range-start.has-end { border-radius: 50% 0 0 50% !important; }
  .cal-day.range-end.has-start { border-radius: 0 50% 50% 0 !important; }

  .guest-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .guest-row:last-child { border-bottom: none; }
  .guest-row:first-child { padding-top: 0; }
  .g-name { font-size: 14px; font-weight: 600; }
  .g-desc { font-size: 12px; color: var(--muted); }
  .g-counter { display: flex; align-items: center; gap: 12px; }
  .g-btn { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--forest); transition: all 0.15s; }
  .g-btn:hover:not(:disabled) { border-color: var(--forest); background: rgba(45,80,22,0.07); }
  .g-btn:disabled { opacity: 0.3; cursor: default; }
  .g-count { font-size: 15px; font-weight: 500; min-width: 16px; text-align: center; }

  /* ── SECTION HEADER ──────────────────────────────────── */
  .rp-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 40px 20px;
    text-align: center;
  }
  .rp-section-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--rust);
    margin-bottom: 10px;
  }
  .rp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
  }
  .rp-title span {
    color: var(--rust);
    font-style: italic;
  }
  .rp-subtitle {
    font-size: 16px;
    color: var(--muted);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .rp-filter-bar {
    max-width: 1200px;
    margin: 30px auto 20px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .rp-filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .rp-filter-tab {
    padding: 8px 18px;
    border-radius: 100px;
    background: var(--white);
    border: 1px solid var(--border);
    font-size: 14px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .rp-filter-tab:hover,
  .rp-filter-tab.active {
    background: var(--forest);
    border-color: var(--forest);
    color: white;
  }

  .wishlist-toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    padding: 10px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s;
  }
  .wishlist-toggle-btn:hover {
    border-color: var(--rust);
    color: var(--rust);
  }
  .wishlist-toggle-btn.active {
    background: var(--rust);
    border-color: var(--rust);
    color: white;
  }
  .wishlist-toggle-btn svg { transition: fill 0.2s; }
  .wishlist-toggle-btn.active svg { fill: white; color: white; }

  /* ── GRID ────────────────────────────────────────────── */
  .rp-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px 80px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  @media (max-width: 900px) { .rp-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 580px) { .rp-grid { grid-template-columns: 1fr; padding: 0 20px 60px; } }

  /* ── ROOM CARD ───────────────────────────────────────── */
  .room-card {
    background: var(--white);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    position: relative;
    animation: fadeUp 0.5s ease both;
    border: 1px solid var(--border);
  }
  .room-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

  /* stagger delay */
  .room-card:nth-child(1) { animation-delay: 0.05s; }
  .room-card:nth-child(2) { animation-delay: 0.10s; }
  .room-card:nth-child(3) { animation-delay: 0.15s; }
  .room-card:nth-child(4) { animation-delay: 0.20s; }
  .room-card:nth-child(5) { animation-delay: 0.25s; }
  .room-card:nth-child(6) { animation-delay: 0.30s; }

  .card-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
  }
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .room-card:hover .card-img { transform: scale(1.08); }

  /* Badge */
  .card-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: var(--gold);
    color: white;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 100px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  /* Heart button */
  .card-heart {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2;
  }
  .card-heart:hover { transform: scale(1.15); background: white; }
  .card-heart svg { transition: all 0.2s; }
  .card-heart.wishlisted svg { fill: #e53e3e; color: #e53e3e; }

  .card-body {
    padding: 24px 20px 20px;
  }

  .card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 6px;
  }

  .card-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 15px;
  }

  /* Amenities chips */
  .card-amenities-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .card-amenity-chip {
    background: var(--cream);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    color: var(--forest);
    letter-spacing: 0.02em;
    border: 1px solid var(--border);
  }

  .card-amenity-chip.highlight {
    background: var(--forest);
    color: white;
    border-color: var(--forest);
  }

  .card-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 20px;
    border-left: 3px solid var(--rust);
    padding-left: 15px;
    font-style: italic;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid var(--border);
  }

  .card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--forest);
  }
  .card-price span {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--muted);
    font-weight: 400;
  }

  .card-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
  }
  .card-rating svg {
    fill: var(--gold);
    color: var(--gold);
  }

  /* BOOK NOW button */
  .card-book-btn {
    width: 100%;
    margin-top: 18px;
    padding: 14px;
    background: linear-gradient(135deg, var(--forest), var(--forest2));
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(45,80,22,0.2);
  }

  .card-book-btn:hover {
    background: linear-gradient(135deg, var(--forest2), var(--forest));
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(45,80,22,0.3);
  }

  /* ── DETAIL MODAL ────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease; overflow-y: auto;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .modal-box {
    background: var(--white); border-radius: 24px;
    width: 100%; max-width: 1000px; max-height: 90vh;
    overflow-y: auto; position: relative;
    box-shadow: 0 40px 80px rgba(0,0,0,0.3);
    animation: slideUp 0.28s ease;
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  .modal-close {
    position: sticky; top: 20px; float: right; margin: 20px 20px 0 0;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.95); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text); z-index: 10;
    transition: all 0.18s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .modal-close:hover { background: var(--cream2); transform: scale(1.05); }

  .modal-images {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4px;
    height: 380px;
    margin-top: -60px;
  }
  .modal-img-main {
    height: 380px;
    object-fit: cover;
    width: 100%;
    border-radius: 24px 0 0 0;
    display: block;
  }
  .modal-img-side {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 4px;
  }
  .modal-img-side img {
    width: 100%;
    height: 188px;
    object-fit: cover;
    display: block;
  }
  .modal-img-side img:first-child { border-radius: 0 24px 0 0; }

  .modal-content { padding: 30px 36px 40px; }
  .modal-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 6px; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 600; color: var(--text); }
  .modal-price-big { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 600; color: var(--forest); white-space: nowrap; }
  .modal-price-big span { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--muted); font-weight: 400; }
  .modal-location { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); margin-bottom: 14px; }
  .modal-rating { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); margin-bottom: 22px; }
  .modal-rating svg { fill: var(--gold); color: var(--gold); }
  .modal-divider { height: 1px; background: var(--border); margin: 26px 0; }
  .modal-section-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--text); margin-bottom: 18px; }
  .modal-desc { font-size: 15px; color: var(--muted); line-height: 1.8; }

  .inclusions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 12px; }
  .inclusion-chip {
    display: flex; align-items: center; gap: 10px;
    background: var(--cream); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 16px;
    font-size: 14px; color: var(--text);
    transition: border-color 0.2s;
  }
  .inclusion-chip:hover { border-color: var(--forest); }
  .inclusion-chip svg { color: var(--forest); flex-shrink: 0; }

  .modal-map {
    width: 100%; height: 280px; border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border); margin-top: 4px;
    position: relative;
  }
  .modal-map iframe { width: 100%; height: 100%; border: none; display: block; }

  .modal-reserve-row { display: flex; align-items: center; gap: 16px; margin-top: 30px; flex-wrap: wrap; }
  .modal-reserve-btn {
    flex: 1; padding: 16px; background: linear-gradient(135deg, var(--forest), var(--forest2)); color: white;
    border: none; border-radius: 12px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.2s; min-width: 200px; box-shadow: 0 4px 15px rgba(45,80,22,0.3);
  }
  .modal-reserve-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45,80,22,0.4); }
  .modal-wishlist-btn {
    width: 56px; height: 56px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .modal-wishlist-btn:hover { border-color: #e53e3e; }
  .modal-wishlist-btn.wishlisted { background: #fff5f5; border-color: #e53e3e; }
  .modal-wishlist-btn.wishlisted svg { fill: #e53e3e; color: #e53e3e; }

  .wishlist-empty {
    grid-column: 1/-1; text-align: center; padding: 100px 20px;
  }
  .wishlist-empty-icon { font-size: 64px; margin-bottom: 20px; }
  .wishlist-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: var(--text); margin-bottom: 10px; }
  .wishlist-empty-sub { font-size: 16px; color: var(--muted); }

  /* Responsive adjustments for back button */
  @media (max-width: 768px) {
    .rooms-back-btn {
      top: 20px;
      left: 20px;
      padding: 8px 16px;
      font-size: 13px;
    }
  }
`;

/* ── Data ──────────────────────────────────────────────── */
const ROOMS = [
  {
    id: 1,
    name: 'Deluxe Suite',
    badge: 'Best Seller',
    price: 180,
    guests: 2,
    rating: 4.9,
    reviews: 128,
    location: 'Tagaytay, Cavite',
    mapQuery: 'Tagaytay+Cavite+Philippines',
    desc: 'Spacious living area with floor-to-ceiling windows and premium king-sized bed.',
    longDesc: 'Experience unparalleled comfort in our Deluxe Suite, featuring floor-to-ceiling windows that frame breathtaking views of Taal Volcano. The suite includes a premium king-sized bed, separate living area, and 24/7 dedicated service.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80',
    ],
    amenities: ['WR', 'KING', '24/7 SERVICE'],
    inclusions: [
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Air Conditioning', Icon: Wind },
      { label: 'Parking', Icon: Car },
      { label: 'Private Bathroom', Icon: Bath },
      { label: 'Breakfast Included', Icon: Coffee },
      { label: 'Smart TV', Icon: Tv },
    ],
  },
  {
    id: 2,
    name: 'Ocean View',
    badge: 'Premium',
    price: 240,
    guests: 2,
    rating: 4.9,
    reviews: 96,
    location: 'Palawan',
    mapQuery: 'Palawan+Philippines',
    desc: 'Breathtaking panoramic views of the turquoise sea with a private balcony.',
    longDesc: 'Wake up to the most stunning sunrise over the turquoise waters of Palawan. This room features a private balcony where you can enjoy your morning coffee while watching the waves. The interior is designed with coastal elegance and modern comforts.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80',
    ],
    amenities: ['AMAZON', 'TUE', 'WR'],
    inclusions: [
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Air Conditioning', Icon: Wind },
      { label: 'Private Balcony', Icon: Eye },
      { label: 'Private Bathroom', Icon: Bath },
      { label: 'Breakfast Included', Icon: Coffee },
      { label: 'Beach Access', Icon: Waves },
    ],
  },
  {
    id: 3,
    name: 'Garden Villa',
    badge: 'New',
    price: 320,
    guests: 4,
    rating: 5.0,
    reviews: 42,
    location: 'Tagaytay, Cavite',
    mapQuery: 'Tagaytay+Cavite+Philippines',
    desc: 'Absolute privacy surrounded by lush tropical gardens and your own plunge pool.',
    longDesc: 'Escape to your private sanctuary nestled within lush tropical gardens. The Garden Villa features a private plunge pool, outdoor shower, and a spacious living area that opens directly onto the garden. Perfect for those seeking seclusion and tranquility.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    ],
    amenities: ['FOLD', 'CARE', 'AC'],
    inclusions: [
      { label: 'Private Pool', Icon: Waves },
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Air Conditioning', Icon: Wind },
      { label: 'Garden View', Icon: Eye },
      { label: 'Private Bathroom', Icon: Bath },
      { label: 'Mini Bar', Icon: CoffeeIcon },
    ],
  },
  {
    id: 4,
    name: 'Penthouse Suite',
    badge: 'Luxury',
    price: 450,
    guests: 6,
    rating: 4.9,
    reviews: 67,
    location: 'Cebu City',
    mapQuery: 'Cebu+City+Philippines',
    desc: 'The pinnacle of luxury with a private rooftop terrace, cinema room, and personal butler.',
    longDesc: 'The Penthouse Suite represents the ultimate in urban luxury. Spread across two levels, it features a private rooftop terrace with panoramic city views, a dedicated cinema room, and 24/7 personal butler service. Every detail has been curated for the discerning traveler.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80',
    ],
    amenities: ['SUITE', 'TERRACE', 'WIFI'],
    inclusions: [
      { label: 'Private Butler', Icon: Phone },
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Cinema Room', Icon: Tv },
      { label: 'Rooftop Terrace', Icon: Maximize2 },
      { label: 'Air Conditioning', Icon: Wind },
      { label: 'Breakfast Included', Icon: Coffee },
    ],
  },
  {
    id: 5,
    name: 'Beachfront Bungalow',
    badge: 'Top Pick',
    price: 380,
    guests: 3,
    rating: 4.8,
    reviews: 89,
    location: 'Boracay',
    mapQuery: 'Boracay+Philippines',
    desc: 'Step directly onto the white sands from your porch.',
    longDesc: 'Experience the ultimate beachfront living. Your private porch opens directly onto the famous white sands of Boracay. The bungalow features an open-air dining area where you can enjoy meals with your feet in the sand and the sound of waves as your soundtrack.',
    image: 'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?w=800&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    ],
    amenities: ['FEATURING AN OPEN-AIR DINING AREA'],
    inclusions: [
      { label: 'Beachfront Access', Icon: Waves },
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Air Conditioning', Icon: Wind },
      { label: 'Open-air Dining', Icon: Utensils },
      { label: 'Private Bathroom', Icon: Bath },
      { label: 'Daily Housekeeping', Icon: Shield },
    ],
  },
  {
    id: 6,
    name: 'Royal Suite',
    badge: 'Presidential',
    price: 650,
    guests: 8,
    rating: 5.0,
    reviews: 34,
    location: 'Manila',
    mapQuery: 'Manila+Philippines',
    desc: 'Our most prestigious accommodation. Two master bedrooms, grand dining hall, and private spa.',
    longDesc: 'The Royal Suite is our crowning jewel, offering 300 square meters of pure luxury. Featuring two master bedrooms, a grand dining hall that seats 12, a private spa with sauna, and a dedicated concierge team. Perfect for VIPs, celebrities, and those who demand the absolute best.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=400&q=80',
    ],
    amenities: ['SPA', 'KITCHEN', 'WIFI'],
    inclusions: [
      { label: 'Private Spa', Icon: Bath },
      { label: 'Full Kitchen', Icon: Utensils },
      { label: 'Free WiFi', Icon: Wifi },
      { label: 'Dining Hall', Icon: HomeIcon },
      { label: 'Air Conditioning', Icon: Wind },
      { label: '24/7 Butler', Icon: Phone },
    ],
  },
];

/* ── Calendar helpers ───────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['S','M','T','W','T','F','S'];
function isSameDay(a,b){ return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function isBetween(d,a,b){ if(!a||!b)return false; const[s,e]=a<b?[a,b]:[b,a]; return d>s&&d<e; }

function CalMonth({ year, month, startDate, endDate, hoverDate, onDayClick, onDayHover, showPrev, showNext, onPrev, onNext }) {
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
        <button className={`cal-nav-btn${!showPrev?' hidden':''}`} onClick={onPrev}><ChevronLeft size={13}/></button>
        <span className="cal-month-title">{MONTHS[month]} {year}</span>
        <button className={`cal-nav-btn${!showNext?' hidden':''}`} onClick={onNext}><ChevronRight size={13}/></button>
      </div>
      <div className="cal-grid">
        {DAYS.map((d,i)=><div key={i} className="cal-dow">{d}</div>)}
        {cells.map((day,i)=>{
          if(!day) return <div key={i} className="cal-day empty"/>;
          const isPast=day<today, isStart=isSameDay(day,startDate), isEnd=isSameDay(day,endDate);
          const inRange=!isPast&&isBetween(day,startDate,rangeEnd);
          let cls='cal-day';
          if(isPast) cls+=' past';
          if(isStart) cls+=` range-start${endDate?' has-end':''}`;
          if(isEnd)   cls+=` range-end${startDate?' has-start':''}`;
          if(inRange) cls+=' in-range';
          return <div key={i} className={cls} onClick={()=>!isPast&&onDayClick(day)} onMouseEnter={()=>!isPast&&onDayHover(day)}>{day.getDate()}</div>;
        })}
      </div>
    </div>
  );
}

/* ── Room Detail Modal ──────────────────────────────────── */
function RoomModal({ room, wishlisted, onWishlist, onClose, onBookNow }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = e => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown', h); };
  }, [onClose]);

  const mapSrc = `https://maps.google.com/maps?q=${room.mapQuery}&output=embed&z=13`;

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}><X size={18}/></button>

        {/* Images */}
        <div className="modal-images">
          <img className="modal-img-main" src={room.images[0]} alt={room.name}/>
          <div className="modal-img-side">
            <img src={room.images[1]} alt={room.name}/>
            <img src={room.images[2]} alt={room.name}/>
          </div>
        </div>

        <div className="modal-content">
          {/* Title + Price */}
          <div className="modal-top">
            <div>
              <h2 className="modal-title">{room.name}</h2>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="modal-price-big">₱{room.price}<span>/night</span></div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:2}}>Up to {room.guests} guests</div>
            </div>
          </div>

          <div className="modal-location"><MapPin size={14}/>{room.location}, Philippines</div>
          <div className="modal-rating">
            {[1,2,3,4,5].map(i=><Star key={i} size={14}/>)}
            <span>{room.rating} · {room.reviews} reviews</span>
          </div>

          <p className="modal-desc">{room.longDesc}</p>

          <div className="modal-divider"/>

          {/* Inclusions & Amenities */}
          <div className="modal-section-title">Inclusions & Amenities</div>
          <div className="inclusions-grid">
            {room.inclusions.map(({label, Icon}, i) => (
              <div key={i} className="inclusion-chip"><Icon size={16}/>{label}</div>
            ))}
          </div>

          <div className="modal-divider"/>

          {/* Map */}
          <div className="modal-section-title"><MapPin size={18} style={{display:'inline',marginRight:8,color:'var(--rust)'}}/>Location</div>
          <div style={{fontSize:14,color:'var(--muted)',marginBottom:14}}>{room.location}, Philippines</div>
          <div className="modal-map">
            <iframe
              title={`Map of ${room.location}`}
              src={mapSrc}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Reserve + Wishlist */}
          <div className="modal-reserve-row">
            <button className="modal-reserve-btn" onClick={onBookNow}>
              <Calendar size={18}/> Reserve Now — ₱{room.price}/night
            </button>
            <button
              className={`modal-wishlist-btn${wishlisted?' wishlisted':''}`}
              onClick={e => { e.stopPropagation(); onWishlist(room.id); }}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={22}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function Rooms({ room, onBack }) {
  const navigate = useNavigate();
  const [openBar, setOpenBar]       = useState(null);
  const [location, setLocation]     = useState('');
  const [startDate, setStartDate]   = useState(null);
  const [endDate, setEndDate]       = useState(null);
  const [hoverDate, setHoverDate]   = useState(null);
  const [calOffset, setCalOffset]   = useState(0);
  const [guests, setGuests]         = useState({adults:0,children:0,infants:0,pets:0});
  const [wishlisted, setWishlisted] = useState(new Set());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const barRef = useRef(null);

  const today = new Date(); today.setHours(0,0,0,0);
  const baseDate = new Date(today.getFullYear(), today.getMonth()+calOffset, 1);
  const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth()+1, 1);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests===0 ? null
    : `${totalGuests} guest${totalGuests>1?'s':''}${guests.infants?`, ${guests.infants} infant${guests.infants>1?'s':''}`:''}`
    + (guests.pets?`, ${guests.pets} pet${guests.pets>1?'s':''}` : '');

  const adjGuest = (key, delta) => setGuests(g => ({...g, [key]: Math.max(0, g[key]+delta)}));

  function handleDayClick(day) {
    if (!startDate || (startDate && endDate)) { setStartDate(day); setEndDate(null); setHoverDate(null); }
    else { if(day < startDate) { setStartDate(day); setEndDate(null); } else { setEndDate(day); setHoverDate(null); } }
  }
  const fmt = d => d ? d.toLocaleDateString('en-US',{month:'short',day:'numeric'}) : null;
  const whenLabel = startDate && endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : startDate ? `${fmt(startDate)} – ?` : null;

  const toggleWishlist = (id) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if(next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBookNow = (roomId) => {
    // Navigate to login/signup page when book now is clicked
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    const h = e => { if(barRef.current && !barRef.current.contains(e.target)) setOpenBar(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filterTabs = ['all', 'popular', 'new', 'luxury'];
  
  const filteredRooms = () => {
    let rooms = showWishlist ? ROOMS.filter(r => wishlisted.has(r.id)) : ROOMS;
    
    if (activeFilter === 'popular') {
      rooms = rooms.filter(r => r.badge === 'Best Seller' || r.badge === 'Top Pick');
    } else if (activeFilter === 'new') {
      rooms = rooms.filter(r => r.badge === 'New');
    } else if (activeFilter === 'luxury') {
      rooms = rooms.filter(r => r.badge === 'Luxury' || r.badge === 'Presidential');
    }
    
    return rooms;
  };

  const displayedRooms = filteredRooms();

  return (
    <>
      <style>{STYLES}</style>
      <div className="rooms-page">

        {/* Back button */}
        <button className="rooms-back-btn" onClick={onBack}>      
        <ArrowLeft size={18} />
          Back to Home
        </button>

        {selectedRoom && (
          <RoomModal
            room={selectedRoom}
            wishlisted={wishlisted.has(selectedRoom.id)}
            onWishlist={toggleWishlist}
            onClose={() => setSelectedRoom(null)}
            onBookNow={() => handleBookNow(selectedRoom.id)}
          />
        )}

        {/* Hero Section */}
        <div className="rp-hero">
          <h1 className="rp-hero-title">Our Luxury Accommodations</h1>
          <p className="rp-hero-subtitle">
            Experience unparalleled comfort and breathtaking views in our meticulously designed rooms and suites.
          </p>
        </div>

        {/* Search Bar - Centered */}
        <div className="rp-search-wrap">
          <div className="airbnb-bar" ref={barRef}>
            {/* Room */}
            <div className={`ab-field${openBar==='room'?' open':''}`} style={{flex:1.6}}
              onClick={() => setOpenBar(o => o==='room'?null:'room')}>
              <div className="ab-label">Room</div>
              {openBar==='room' ? (
                <input className="ab-input" placeholder="Search room" value={location}
                  onChange={e=>setLocation(e.target.value)} onClick={e=>e.stopPropagation()} autoFocus/>
              ) : (
                <div className={`ab-value${location?' filled':''}`}>{location||'Search rooms'}</div>
              )}
            </div>
            <div className="ab-sep"/>
            {/* When */}
            <div className={`ab-field${openBar==='when'?' open':''}`} style={{flex:1.3}}
              onClick={() => setOpenBar(o => o==='when'?null:'when')}>
              <div className="ab-label">When</div>
              <div className={`ab-value${whenLabel?' filled':''}`}>{whenLabel||'Add dates'}</div>
              {openBar==='when' && (
                <div className="ab-dropdown" onClick={e=>e.stopPropagation()}>
                  <div className="cal-months">
                    <CalMonth year={baseDate.getFullYear()} month={baseDate.getMonth()}
                      startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                      onDayClick={handleDayClick} onDayHover={setHoverDate}
                      showPrev={calOffset>0} showNext={false}
                      onPrev={()=>setCalOffset(o=>o-1)} onNext={()=>setCalOffset(o=>o+1)}/>
                    <CalMonth year={nextDate.getFullYear()} month={nextDate.getMonth()}
                      startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                      onDayClick={handleDayClick} onDayHover={setHoverDate}
                      showPrev={false} showNext={true}
                      onPrev={()=>setCalOffset(o=>o-1)} onNext={()=>setCalOffset(o=>o+1)}/>
                  </div>
                </div>
              )}
            </div>
            <div className="ab-sep"/>
            {/* Who */}
            <div className={`ab-field${openBar==='who'?' open':''}`} style={{flex:0.9}}
              onClick={() => setOpenBar(o => o==='who'?null:'who')}>
              <div className="ab-label">Who</div>
              <div className={`ab-value${guestLabel?' filled':''}`}>{guestLabel||'Add guests'}</div>
              {openBar==='who' && (
                <div className="ab-dropdown guests-drop" onClick={e=>e.stopPropagation()}>
                  {[
                    {key:'adults',label:'Adults',desc:'Ages 13+'},
                    {key:'children',label:'Children',desc:'Ages 2–12'},
                    {key:'infants',label:'Infants',desc:'Under 2'},
                    {key:'pets',label:'Pets',desc:'Service animals?'},
                  ].map(({key,label,desc})=>(
                    <div key={key} className="guest-row">
                      <div><div className="g-name">{label}</div><div className="g-desc">{desc}</div></div>
                      <div className="g-counter">
                        <button className="g-btn" disabled={guests[key]<=0} onClick={()=>adjGuest(key,-1)}><Minus size={13}/></button>
                        <span className="g-count">{guests[key]}</span>
                        <button className="g-btn" onClick={()=>adjGuest(key,1)}><Plus size={13}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="ab-search-btn" onClick={()=>setOpenBar(null)}><Search size={18}/> Search</button>
          </div>
        </div>

        {/* Header */}
        <div className="rp-header">
          <div className="rp-section-label">EXCLUSIVE STAYS</div>
          <h1 className="rp-title">Our <span>Rooms</span> & Suites</h1>
          <p className="rp-subtitle">
            Each of our accommodations is thoughtfully designed to provide the perfect blend of luxury, comfort, and Filipino hospitality.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="rp-filter-bar">
          <div className="rp-filter-tabs">
            <button 
              className={`rp-filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Rooms
            </button>
            <button 
              className={`rp-filter-tab ${activeFilter === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveFilter('popular')}
            >
              Most Popular
            </button>
            <button 
              className={`rp-filter-tab ${activeFilter === 'new' ? 'active' : ''}`}
              onClick={() => setActiveFilter('new')}
            >
              New Arrivals
            </button>
            <button 
              className={`rp-filter-tab ${activeFilter === 'luxury' ? 'active' : ''}`}
              onClick={() => setActiveFilter('luxury')}
            >
              Luxury Collection
            </button>
          </div>
          <button
            className={`wishlist-toggle-btn${showWishlist?' active':''}`}
            onClick={() => setShowWishlist(s=>!s)}
          >
            <Heart size={15} style={showWishlist?{fill:'white'}:{}}/>
            {showWishlist ? `Wishlist (${wishlisted.size})` : 'View Wishlist'}
          </button>
        </div>

        {/* Grid */}
        <div className="rp-grid">
          {displayedRooms.length === 0 && (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">🤍</div>
              <div className="wishlist-empty-title">Your wishlist is empty</div>
              <p className="wishlist-empty-sub">Click the heart on any room to save it here.</p>
            </div>
          )}
          {displayedRooms.map(room => (
            <div key={room.id} className="room-card" onClick={() => setSelectedRoom(room)}>
              <div className="card-img-wrap">
                <img className="card-img" src={room.image} alt={room.name}/>
                <div className="card-badge">{room.badge}</div>
                <button
                  className={`card-heart${wishlisted.has(room.id)?' wishlisted':''}`}
                  onClick={e => { e.stopPropagation(); toggleWishlist(room.id); }}
                  title={wishlisted.has(room.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart size={18}/>
                </button>
              </div>
              <div className="card-body">
                <div className="card-name">{room.name}</div>
                <div className="card-location"><MapPin size={12}/>{room.location}</div>
                
                {/* Amenities chips in the style of the image */}
                <div className="card-amenities-row">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className={`card-amenity-chip ${amenity.includes('24/7') ? 'highlight' : ''}`}>
                      {amenity}
                    </div>
                  ))}
                </div>
                
                <div className="card-desc">{room.desc}</div>
                
                <div className="card-footer">
                  <div className="card-price">₱{room.price}<span>/night</span></div>
                  <div className="card-rating"><Star size={14}/>{room.rating} ({room.reviews})</div>
                </div>
                
                {/* BOOK NOW button */}
                <button 
                  className="card-book-btn"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleBookNow(room.id);
                  }}
                >
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}