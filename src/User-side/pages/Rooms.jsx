// Rooms.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, MapPin, Calendar, Users, Heart, ChevronLeft, ChevronRight,
  Plus, Minus, X, Wifi, Wind, Car, Bath, Home as HomeIcon, Utensils,
  Star, Waves, Coffee, Tv, Shield, Phone, ArrowLeft, Award, Maximize2, Coffee as CoffeeIcon, Eye
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

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

  .search-results-badge {
    background: var(--forest);
    color: white;
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .clear-filters-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 100px;
    padding: 4px 12px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background 0.2s;
  }

  .clear-filters-btn:hover {
    background: rgba(255,255,255,0.3);
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
    z-index: 2;
  }

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
  .card-heart.wishlisted svg { fill: #e53e3e; color: #e53e3e; }

  /* Image Navigation Buttons */
  .card-img-nav {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }
  .card-img-nav-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: white;
  }
  .card-img-nav-btn:hover {
    background: rgba(0,0,0,0.8);
    transform: scale(1.1);
  }
  .card-img-dots {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 6px;
    z-index: 2;
  }
  .card-img-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transition: all 0.2s;
    cursor: pointer;
  }
  .card-img-dot.active {
    width: 8px;
    height: 8px;
    background: white;
  }
  .card-img-counter {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    color: white;
    z-index: 2;
  }

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

  /* Modal Gallery Styles */
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

  .modal-gallery {
    position: relative;
    width: 100%;
    height: 450px;
    background: #1a1a1a;
    margin-top: -60px;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
  }
  .modal-gallery-main {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .modal-gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: white;
  }
  .modal-gallery-nav:hover {
    background: rgba(0,0,0,0.8);
    transform: translateY(-50%) scale(1.05);
  }
  .modal-gallery-nav.prev { left: 20px; }
  .modal-gallery-nav.next { right: 20px; }
  .modal-gallery-dots {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 10px;
    z-index: 2;
  }
  .modal-gallery-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transition: all 0.2s;
    cursor: pointer;
  }
  .modal-gallery-dot.active {
    width: 10px;
    height: 10px;
    background: white;
  }
  .modal-gallery-counter {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: white;
  }
  .modal-thumbnails {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }
  .modal-thumbnail {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
    border: 2px solid transparent;
  }
  .modal-thumbnail:hover,
  .modal-thumbnail.active {
    opacity: 1;
    border-color: var(--forest);
  }

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

  .loading-spinner {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
  }
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border);
    border-top-color: var(--forest);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .rooms-back-btn {
      top: 20px;
      left: 20px;
      padding: 8px 16px;
      font-size: 13px;
    }
    .modal-gallery {
      height: 300px;
    }
    .modal-thumbnails {
      padding: 8px 12px;
    }
    .modal-thumbnail {
      width: 50px;
      height: 50px;
    }
  }
`;

const INCLUSIONS_ICONS = {
  'WiFi': Wifi,
  'Air Conditioning': Wind,
  'Parking': Car,
  'Private Bathroom': Bath,
  'Breakfast Included': Coffee,
  'Smart TV': Tv,
  'Private Balcony': Eye,
  'Beach Access': Waves,
  'Private Pool': Waves,
  'Garden View': Eye,
  'Mini Bar': CoffeeIcon,
  'Private Butler': Phone,
  'Cinema Room': Tv,
  'Rooftop Terrace': Maximize2,
  'Full Kitchen': Utensils,
  'Dining Hall': HomeIcon,
  '24/7 Butler': Phone,
  'Daily Housekeeping': Shield,
  'Open-air Dining': Utensils,
  'Free WiFi': Wifi,
  'AC': Wind,
  'TV': Tv,
  'Ref': CoffeeIcon,
  'Hotwater': Waves,
  'Balcony': Eye,
  'Bathtub': Bath,
  'Minibar': CoffeeIcon,
  'Safe': Shield
};

const TYPE_IMAGES = {
  Standard: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  Superior: 'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80',
  Deluxe: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  Suite: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
};

const getBadgeByType = (type) => {
  const badges = {
    'Standard': 'Classic',
    'Superior': 'Premium',
    'Deluxe': 'Luxury',
    'Suite': 'VIP Suite'
  };
  return badges[type] || 'Featured';
};

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

// Room Card Component with Multi-Image Support
function RoomCard({ room, wishlisted, onWishlist, onClick, onBookNow }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get images array from room data
  const images = room.images && room.images.length > 0 
    ? room.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map(img => img.url)
    : [room.imageUrl || TYPE_IMAGES[room.type] || TYPE_IMAGES.Standard];
  
  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className="room-card" onClick={() => onClick(room)}>
      <div className="card-img-wrap">
        <img className="card-img" src={currentImage} alt={`${room.name} - view ${currentImageIndex + 1}`}/>
        <div className="card-badge">{room.badge}</div>
        <button className={`card-heart${wishlisted?' wishlisted':''}`} onClick={e => { e.stopPropagation(); onWishlist(room.id); }}><Heart size={18}/></button>
        
        {hasMultipleImages && (
          <>
            <div className="card-img-nav">
              <button className="card-img-nav-btn" onClick={prevImage}>
                <ChevronLeft size={16}/>
              </button>
              <button className="card-img-nav-btn" onClick={nextImage}>
                <ChevronRight size={16}/>
              </button>
            </div>
            <div className="card-img-dots">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`card-img-dot ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => goToImage(idx, e)}
                />
              ))}
            </div>
            <div className="card-img-counter">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      <div className="card-body">
        <div className="card-name">{room.name}</div>
        <div className="card-location"><MapPin size={12}/>{room.location}</div>
        <div className="card-amenities-row">
          {room.amenities && room.amenities.slice(0, 3).map((amenity, i) => (<div key={i} className="card-amenity-chip">{amenity}</div>))}
        </div>
        <div className="card-desc">{room.desc}</div>
        <div className="card-footer">
          <div className="card-price">₱{room.price}<span>/night</span></div>
          <div className="card-rating"><Star size={14}/>{room.rating} ({room.reviews})</div>
        </div>
        <button className="card-book-btn" onClick={(e) => { e.stopPropagation(); onBookNow(room); }}>BOOK NOW</button>
      </div>
    </div>
  );
}

// Modal Component with Multi-Image Gallery
function RoomModal({ room, wishlisted, onWishlist, onClose, onBookNow }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = e => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown', h); };
  }, [onClose]);

  // Get images array from room data
  const images = room.images && room.images.length > 0 
    ? room.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map(img => img.url)
    : [room.imageUrl || TYPE_IMAGES[room.type] || TYPE_IMAGES.Standard];
  
  // Add more placeholder images if we have less than 4
  while (images.length < 4 && images.length < 8) {
    images.push(room.imageUrl || TYPE_IMAGES[room.type] || TYPE_IMAGES.Standard);
  }
  
  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const mapSrc = `https://maps.google.com/maps?q=Cordova,Cebu,Philippines&output=embed&z=13`;

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}><X size={18}/></button>
        
        <div className="modal-gallery">
          <img className="modal-gallery-main" src={currentImage} alt={`${room.name} - view ${currentImageIndex + 1}`}/>
          
          {hasMultipleImages && (
            <>
              <button className="modal-gallery-nav prev" onClick={prevImage}>
                <ChevronLeft size={24}/>
              </button>
              <button className="modal-gallery-nav next" onClick={nextImage}>
                <ChevronRight size={24}/>
              </button>
              <div className="modal-gallery-dots">
                {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`modal-gallery-dot ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(idx)}
                  />
                ))}
              </div>
              <div className="modal-gallery-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        
        {hasMultipleImages && (
          <div className="modal-thumbnails">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`modal-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToImage(idx)}
              />
            ))}
          </div>
        )}
        
        <div className="modal-content">
          <div className="modal-top">
            <div><h2 className="modal-title">{room.name}</h2></div>
            <div style={{textAlign:'right'}}>
              <div className="modal-price-big">₱{room.price}<span>/night</span></div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:2}}>Up to {room.capacity || room.guests} guests</div>
            </div>
          </div>
          <div className="modal-location"><MapPin size={14}/>{room.location || 'Cordova, Cebu, Philippines'}</div>
          <div className="modal-rating">{[...Array(5)].map((_,i)=><Star key={i} size={14}/>)}<span>{room.rating || 4.8} · {room.reviews || 128} reviews</span></div>
          <p className="modal-desc">{room.longDesc || room.description || room.desc || 'Experience luxury and comfort in our carefully designed spaces.'}</p>
          <div className="modal-divider"/>
          <div className="modal-section-title">Inclusions & Amenities</div>
          <div className="inclusions-grid">
            {room.amenities && room.amenities.map((amenity, i) => {
              const Icon = INCLUSIONS_ICONS[amenity] || Wifi;
              return (<div key={i} className="inclusion-chip"><Icon size={16}/>{amenity}</div>);
            })}
          </div>
          <div className="modal-divider"/>
          <div className="modal-section-title"><MapPin size={18} style={{display:'inline',marginRight:8,color:'var(--rust)'}}/>Location</div>
          <div style={{fontSize:14,color:'var(--muted)',marginBottom:14}}>{room.location || 'Cordova, Cebu, Philippines'}</div>
          <div className="modal-map"><iframe title="Map" src={mapSrc} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>
          <div className="modal-reserve-row">
            <button className="modal-reserve-btn" onClick={() => onBookNow(room)}><Calendar size={18}/> Book Now — ₱{room.price}/night</button>
            <button className={`modal-wishlist-btn${wishlisted?' wishlisted':''}`} onClick={e => { e.stopPropagation(); onWishlist(room.id); }}><Heart size={22}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rooms({ room, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBar, setOpenBar]       = useState(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [startDate, setStartDate]   = useState(null);
  const [endDate, setEndDate]       = useState(null);
  const [hoverDate, setHoverDate]   = useState(null);
  const [calOffset, setCalOffset]   = useState(0);
  const [guests, setGuests]         = useState({adults:2,children:0,infants:0,pets:0});
  const [wishlisted, setWishlisted] = useState(new Set());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const barRef = useRef(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecking && isLoggedIn) {
      const pending = sessionStorage.getItem('pendingBooking');
      if (pending) {
        try {
          const bookingData = JSON.parse(pending);
          sessionStorage.removeItem('pendingBooking');
          navigate('/login', { 
            state: { 
              selectedRoom: bookingData.room,
              hotel: { id: 'solaz-main', name: 'Solaz Resort & Spa', location: 'Cordova, Cebu, Philippines' },
              guests: bookingData.selectedDates?.guests || 2,
              checkInDate: bookingData.selectedDates?.checkInDate || null,
              checkOutDate: bookingData.selectedDates?.checkOutDate || null
            } 
          });
        } catch (error) {
          console.error('Error parsing pending booking:', error);
          sessionStorage.removeItem('pendingBooking');
        }
      }
    }
  }, [authChecking, isLoggedIn, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomsCollection = collection(db, 'rooms');
        const roomsQuery = query(roomsCollection, orderBy('createdAt', 'desc'));
        const roomsSnapshot = await getDocs(roomsQuery);
        
        if (roomsSnapshot.empty) {
          setRooms([]);
          setFilteredRooms([]);
          setLoading(false);
          return;
        }
        
        const roomsData = roomsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Luxury Room',
            type: data.type || 'Standard',
            badge: getBadgeByType(data.type),
            price: data.ratePerDay || 180,
            ratePerDay: data.ratePerDay || 180,
            guests: data.capacity || 2,
            capacity: data.capacity || 2,
            rating: 4.8,
            reviews: 128,
            location: data.floor ? `${data.type} Room, Floor ${data.floor}` : `${data.type} Room`,
            desc: data.description || 'A serene haven designed for your comfort.',
            longDesc: data.description || 'Experience luxury and comfort in our carefully designed spaces.',
            imageUrl: data.imageUrl || TYPE_IMAGES[data.type] || TYPE_IMAGES.Standard,
            images: data.images || [], // Add multiple images support
            amenities: data.amenities || ['WiFi', 'AC', 'TV'],
            status: data.status
          };
        });
        
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
        setFilteredRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Filter rooms based on all search criteria
  useEffect(() => {
    if (!rooms.length) return;
    
    let filtered = [...rooms];
    const totalGuestsCount = guests.adults + guests.children;
    
    // Filter by location/room name search
    if (locationFilter.trim()) {
      const searchTerm = locationFilter.toLowerCase().trim();
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchTerm) || 
        room.type.toLowerCase().includes(searchTerm) ||
        (room.desc && room.desc.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by guest capacity
    if (totalGuestsCount > 0) {
      filtered = filtered.filter(room => (room.capacity || room.guests) >= totalGuestsCount);
    }
    
    // Apply wishlist filter if active
    if (showWishlist) {
      filtered = filtered.filter(r => wishlisted.has(r.id));
    }
    
    // Apply type filter
    if (activeFilter === 'popular') {
      filtered = filtered.filter(r => r.badge === 'Classic' || r.badge === 'Premium');
    } else if (activeFilter === 'luxury') {
      filtered = filtered.filter(r => r.badge === 'Luxury' || r.badge === 'VIP Suite');
    }
    
    setFilteredRooms(filtered);
  }, [rooms, locationFilter, guests.adults, guests.children, showWishlist, wishlisted, activeFilter]);

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

  const handleBookNow = (room) => {
    if (!isLoggedIn) {
      const bookingData = {
        roomId: room.id,
        room: room,
        selectedDates: {
          checkInDate: startDate ? startDate.toISOString().split('T')[0] : null,
          checkOutDate: endDate ? endDate.toISOString().split('T')[0] : null,
          guests: totalGuests
        },
        timestamp: Date.now()
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/login', { 
        state: { 
          from: location.pathname,
          returnTo: '/rooms',
          selectedRoom: room
        } 
      });
      return;
    }
    
    navigate('/login', { 
      state: { 
        selectedRoom: room,
        hotel: { id: 'solaz-main', name: 'Solaz Resort & Spa', location: 'Cordova, Cebu, Philippines' },
        guests: totalGuests,
        checkInDate: startDate ? startDate.toISOString().split('T')[0] : null,
        checkOutDate: endDate ? endDate.toISOString().split('T')[0] : null
      } 
    });
  };

  const clearAllFilters = () => {
    setLocationFilter('');
    setStartDate(null);
    setEndDate(null);
    setGuests({adults:2, children:0, infants:0, pets:0});
    setActiveFilter('all');
    setShowWishlist(false);
  };

  useEffect(() => {
    const h = e => { if(barRef.current && !barRef.current.contains(e.target)) setOpenBar(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (room) {
      setSelectedRoom(room);
    }
  }, [room]);

  const isSearchActive = locationFilter.trim() !== '' || (startDate && endDate) || totalGuests > 2 || activeFilter !== 'all';

  if (loading || authChecking) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="rooms-page">
          <button className="rooms-back-btn" onClick={() => navigate('/')}><ArrowLeft size={18}/> Back to Home</button>
          <div className="rp-hero"><h1 className="rp-hero-title">Our Luxury Accommodations</h1><p className="rp-hero-subtitle">Experience unparalleled comfort and breathtaking views in our meticulously designed rooms and suites.</p></div>
          <div className="rp-grid"><div className="loading-spinner"><div className="spinner"></div><p style={{ color: 'var(--muted)' }}>Loading luxurious rooms...</p></div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="rooms-page">
        <button className="rooms-back-btn" onClick={onBack || (() => navigate('/'))}><ArrowLeft size={18}/> Back to Home</button>

        {selectedRoom && (
          <RoomModal
            room={selectedRoom}
            wishlisted={wishlisted.has(selectedRoom.id)}
            onWishlist={toggleWishlist}
            onClose={() => setSelectedRoom(null)}
            onBookNow={handleBookNow}
          />
        )}

        <div className="rp-hero">
          <h1 className="rp-hero-title">Our Luxury Accommodations</h1>
          <p className="rp-hero-subtitle">Experience unparalleled comfort and breathtaking views in our meticulously designed rooms and suites.</p>
        </div>

        <div className="rp-search-wrap">
          <div className="airbnb-bar" ref={barRef}>
            <div className={`ab-field${openBar==='room'?' open':''}`} style={{flex:1.6}} onClick={() => setOpenBar(o => o==='room'?null:'room')}>
              <div className="ab-label">Room</div>
              {openBar==='room' ? (
                <input className="ab-input" placeholder="Search by room name or type" value={locationFilter}
                  onChange={e=>setLocationFilter(e.target.value)} onClick={e=>e.stopPropagation()} autoFocus/>
              ) : (
                <div className={`ab-value${locationFilter?' filled':''}`}>{locationFilter||'Search rooms by name or type'}</div>
              )}
            </div>
            <div className="ab-sep"/>
            <div className={`ab-field${openBar==='when'?' open':''}`} style={{flex:1.3}} onClick={() => setOpenBar(o => o==='when'?null:'when')}>
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
            <div className={`ab-field${openBar==='who'?' open':''}`} style={{flex:0.9}} onClick={() => setOpenBar(o => o==='who'?null:'who')}>
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

        <div className="rp-header">
          <div className="rp-section-label">EXCLUSIVE STAYS</div>
          <h1 className="rp-title">Our <span>Rooms</span> & Suites</h1>
          <p className="rp-subtitle">Each of our accommodations is thoughtfully designed to provide the perfect blend of luxury, comfort, and Filipino hospitality.</p>
        </div>

        <div className="rp-filter-bar">
          <div className="rp-filter-tabs">
            <button className={`rp-filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Rooms ({rooms.length})</button>
            <button className={`rp-filter-tab ${activeFilter === 'popular' ? 'active' : ''}`} onClick={() => setActiveFilter('popular')}>Most Popular</button>
            <button className={`rp-filter-tab ${activeFilter === 'luxury' ? 'active' : ''}`} onClick={() => setActiveFilter('luxury')}>Luxury Collection</button>
          </div>
          <button className={`wishlist-toggle-btn${showWishlist?' active':''}`} onClick={() => setShowWishlist(s=>!s)}>
            <Heart size={15} style={showWishlist?{fill:'white'}:{}}/>
            {showWishlist ? `Wishlist (${wishlisted.size})` : 'View Wishlist'}
          </button>
        </div>

        {isSearchActive && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="search-results-badge">
              Found {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} matching your search
              <button className="clear-filters-btn" onClick={clearAllFilters}>Clear all filters</button>
            </div>
          </div>
        )}

        <div className="rp-grid">
          {filteredRooms.length === 0 && (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">🏨</div>
              <div className="wishlist-empty-title">{showWishlist ? 'Your wishlist is empty' : 'No rooms found'}</div>
              <p className="wishlist-empty-sub">
                {showWishlist 
                  ? 'Click the heart on any room to save it here.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
          {filteredRooms.map(room => (
            <RoomCard 
              key={room.id}
              room={room}
              wishlisted={wishlisted.has(room.id)}
              onWishlist={toggleWishlist}
              onClick={setSelectedRoom}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      </div>
    </>
  );
}