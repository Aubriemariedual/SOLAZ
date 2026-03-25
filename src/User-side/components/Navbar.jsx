import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, UserPlus, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   DARK MODE HOOK
───────────────────────────────────────────────────────────── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('solaz-dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('solaz-dark', String(dark));
  }, [dark]);

  return [dark, setDark];
};

/* ─────────────────────────────────────────────────────────────
   STYLES (keep all your existing styles)
───────────────────────────────────────────────────────────── */
const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

  :root {
    --cream:         #F2F1E6;
    --cream-deep:    #E8E7D8;
    --forest:        #2D5016;
    --forest2:       #3D6B20;
    --forest-pale:   rgba(45,80,22,0.08);
    --forest-mid:    rgba(45,80,22,0.14);
    --rust:          #8B3A2A;
    --gold:          #B89A5A;
    --text:          #161614;
    --text-soft:     #4A4A38;
    --muted:         #898978;
    --border:        rgba(180,178,158,0.55);
    --border-strong: rgba(180,178,158,0.9);
    --bg:            #F2F1E6;
    --card:          #FFFFFF;

    --nb:   rgba(242,241,230,0.94);
    --nt:   #161614;
    --nm:   #7A7A68;
    --nhb:  rgba(45,80,22,0.07);
    --nab:  rgba(45,80,22,0.12);
    --nat:  #2D5016;
    --nsh:  0 1px 0 rgba(180,178,158,0.5);
    --ndb:  #FAFAF4;
    --nds:  0 24px 64px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(180,178,158,0.4);
    --nmb:  #EEEEE0;
    --navh: #d8eacc;
  }

  [data-theme="dark"] {
    --cream:         #e4e2d4;
    --forest:        #81a860;
    --forest2:       #94be6e;
    --forest-pale:   rgba(129,168,96,0.1);
    --forest-mid:    rgba(129,168,96,0.2);
    --rust:          #c87060;
    --gold:          #c4a86a;
    --text:          #e4e2d4;
    --text-soft:     #b0ae9e;
    --muted:         rgba(228,226,212,0.42);
    --border:        rgba(129,168,96,0.16);
    --border-strong: rgba(129,168,96,0.28);
    --bg:            #131710;
    --card:          #1c2414;

    --nb:   rgba(15,20,10,0.97);
    --nt:   #dedad0;
    --nm:   rgba(222,218,208,0.36);
    --nhb:  rgba(80,128,44,0.14);
    --nab:  rgba(80,128,44,0.22);
    --nat:  #94be6e;
    --nsh:  0 1px 0 rgba(129,168,96,0.1), 0 8px 32px rgba(0,0,0,0.55);
    --ndb:  #172010;
    --nds:  0 24px 64px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(129,168,96,0.18);
    --nmb:  #131710;
    --navh: rgba(80,128,44,0.2);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'Montserrat', sans-serif;
    transition: background 0.4s, color 0.4s;
    -webkit-font-smoothing: antialiased;
  }

  .sn {
    position: sticky; top: 0; z-index: 200;
    font-family: 'Montserrat', sans-serif;
    background: var(--nb);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border-bottom: 1px solid var(--border-strong);
    box-shadow: var(--nsh);
    transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
  }
  .sn::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--forest) 60%, transparent 100%);
    opacity: 0.55;
  }
  [data-theme="dark"] .sn::before { opacity: 0.35; }

  .sn-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 52px; height: 68px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 32px;
  }
  @media (max-width: 1024px) { .sn-inner { padding: 0 32px; gap: 20px; } }
  @media (max-width: 768px)  { .sn-inner { padding: 0 20px; gap: 12px; } }

  .sn-logo {
    display: flex; align-items: center;
    flex-shrink: 0; background: none; border: none;
    cursor: pointer; padding: 0; outline: none;
    transition: opacity 0.25s, transform 0.25s;
  }
  .sn-logo:hover { opacity: 0.72; transform: scale(0.96); }
  .sn-logo:focus-visible { outline: 2px solid var(--forest); outline-offset: 4px; border-radius: 4px; }
  .sn-logo img { height: 40px; width: auto; display: block; object-fit: contain; }

  .sn-links {
    display: none; align-items: center; gap: 0;
    flex: 1; justify-content: center;
  }
  @media (min-width: 768px) { .sn-links { display: flex; } }

  .sn-link {
    position: relative;
    padding: 10px 18px;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--nm);
    background: none; border: none; cursor: pointer; outline: none;
    transition: color 0.2s;
    font-family: 'Montserrat', sans-serif;
    white-space: nowrap;
  }
  .sn-link::after {
    content: '';
    position: absolute; bottom: 6px; left: 50%;
    width: 0; height: 1px;
    background: var(--forest);
    transform: translateX(-50%);
    transition: width 0.28s cubic-bezier(.4,0,.2,1);
    border-radius: 1px;
  }
  [data-theme="dark"] .sn-link::after { background: var(--forest2); }
  .sn-link:hover { color: var(--nt); }
  .sn-link:hover::after { width: 20px; }
  .sn-link.active { color: var(--nat); font-weight: 600; }
  .sn-link.active::after { width: 24px; background: var(--forest); }
  [data-theme="dark"] .sn-link.active::after { background: var(--forest2); }
  .sn-link:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; border-radius: 4px; }

  .sn-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .sn-sep {
    width: 1px; height: 22px;
    background: var(--border-strong);
    margin: 0 4px; flex-shrink: 0;
  }

  .sn-icon {
    position: relative;
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--nm); outline: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .sn-icon svg { width: 16px; height: 16px; transition: color 0.2s; }
  .sn-icon:hover {
    background: var(--nhb);
    color: var(--nat);
    border-color: var(--border-strong);
  }
  .sn-icon:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; }

  .sn-theme {
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.45s ease;
  }
  .sn-theme:hover { transform: rotate(25deg); }

  .sn-cta {
    display: inline-flex; align-items: center; gap: 0;
    padding: 0; border: none; background: none;
    cursor: pointer; outline: none;
    font-family: 'Montserrat', sans-serif;
    text-decoration: none;
  }
  .sn-cta-inner {
    display: flex; align-items: center;
    background: var(--forest);
    color: #fff;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    white-space: nowrap;
    box-shadow: 0 2px 0 rgba(0,0,0,0.18), 0 4px 16px rgba(45,80,22,0.22);
    transition: background 0.22s, box-shadow 0.22s, transform 0.16s;
  }
  .sn-cta:hover .sn-cta-inner {
    background: var(--forest2);
    box-shadow: 0 2px 0 rgba(0,0,0,0.18), 0 8px 24px rgba(45,80,22,0.32);
    transform: translateY(-1px);
  }
  .sn-cta:active .sn-cta-inner { transform: translateY(0); box-shadow: 0 1px 0 rgba(0,0,0,0.18); }
  .sn-cta:focus-visible { outline: 2px solid var(--forest); outline-offset: 3px; border-radius: 11px; }

  /* ══ DARK MODE ONLY ICON ═══════════════════════════════════ */
  .sn-darkmode-only {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--nm); outline: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.45s ease;
  }
  .sn-darkmode-only svg { width: 16px; height: 16px; transition: color 0.2s; }
  .sn-darkmode-only:hover {
    background: var(--nhb);
    color: var(--nat);
    border-color: var(--border-strong);
    transform: rotate(25deg);
  }
  .sn-darkmode-only:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; }

  /* ══ HAMBURGER ═══════════════════════════════════════ */
  .sn-burger {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--border); background: transparent;
    cursor: pointer; color: var(--nt); outline: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }
  .sn-burger:hover { background: var(--nhb); color: var(--nat); border-color: var(--border-strong); }
  .sn-burger:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; }
  .sn-burger svg { width: 18px; height: 18px; }
  @media (min-width: 768px) { .sn-burger { display: none; } }

  /* ══ MOBILE DRAWER ═══════════════════════════════════ */
  .sn-drawer {
    background: var(--nmb);
    border-top: 1px solid var(--border);
    padding: 12px 16px 20px;
    animation: drawerIn 0.24s cubic-bezier(.34,1.56,.64,1);
    transition: background 0.4s;
  }
  @keyframes drawerIn {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (min-width: 768px) { .sn-drawer { display: none; } }

  .sn-mob-link {
    display: flex; align-items: center;
    width: 100%; padding: 12px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--nm);
    background: none; border: none; cursor: pointer; text-align: left; outline: none;
    transition: background 0.16s, color 0.16s;
    margin-bottom: 2px;
    font-family: 'Montserrat', sans-serif;
  }
  .sn-mob-link:hover { background: var(--nhb); color: var(--nt); }
  .sn-mob-link.active { background: var(--nab); color: var(--nat); }
  .sn-mob-link:focus-visible { outline: 2px solid var(--forest); outline-offset: -2px; }

  .sn-mob-div { height: 1px; background: var(--border); margin: 10px 0; }

  /* Mobile dark mode only */
  .sn-mob-darkmode {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; border-radius: 10px; cursor: pointer;
    transition: background 0.16s;
  }
  .sn-mob-darkmode:hover { background: var(--nhb); }
  .sn-mob-darkmode-label {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--nt); font-family: 'Montserrat', sans-serif;
  }
  .sn-mob-darkmode-label svg { width: 16px; height: 16px; color: var(--nm); }

  .sn-pill {
    width: 42px; height: 24px; border-radius: 100px; border: none;
    cursor: pointer; position: relative;
    transition: background 0.3s; flex-shrink: 0; outline: none;
  }
  .sn-pill.on  { background: #2A1F1B; }
  .sn-pill.off { background: #1E1612; }
  [data-theme="dark"] .sn-pill.off { background: #241A16; }
  .sn-pill-thumb {
    position: absolute; top: 4px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.22);
    transition: left 0.28s cubic-bezier(.34,1.56,.64,1);
  }
  .sn-pill.on  .sn-pill-thumb { left: 22px; }
  .sn-pill.off .sn-pill-thumb { left: 4px; }
  .sn-pill:focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; }

  .sn-mob-cta {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 14px; margin-top: 12px;
    background: var(--forest); color: white;
    border: none; border-radius: 10px;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; outline: none;
    box-shadow: 0 2px 0 rgba(0,0,0,0.14), 0 4px 16px rgba(45,80,22,0.25);
    transition: background 0.2s, transform 0.16s;
  }
  .sn-mob-cta:hover { background: var(--forest2); transform: translateY(-1px); }
  .sn-mob-cta:active { transform: translateY(0); }
  .sn-mob-cta:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
`;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useDarkMode();
  const [activeLink, setActiveLink] = useState('');

  const links = [
    { label: 'Home',    id: 'home',    target: null, path: '/' },
    { label: 'Rooms',   id: 'rooms',   target: 'rooms-section', path: '/' },
    { label: 'Gallery', id: 'gallery', target: 'gallery-section', path: '/' },
    { label: 'Contact', id: 'contact', target: 'contact-section', path: '/' },
    { label: 'FAQs',    id: 'faqs',    target: 'faqs-section', path: '/' },
  ];

  // Function to scroll to a specific section on the home page
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 72; // Navbar height + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Main navigation handler
  const handleNavigation = async (target, id, path) => {
    setOpen(false);
    
    // If it's the home link
    if (id === 'home') {
      if (location.pathname !== '/') {
        // Navigate to home page
        navigate('/');
      } else {
        // Already on home, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setActiveLink('home');
      return;
    }
    
    // For other sections (rooms, gallery, contact, faqs)
    if (location.pathname === '/') {
      // Already on home page, just scroll to section
      if (target) {
        scrollToSection(target);
      }
    } else {
      // On a different page, navigate to home first, then scroll
      navigate('/');
      // Wait for navigation to complete and page to render
      setTimeout(() => {
        if (target) {
          scrollToSection(target);
        }
      }, 150);
    }
    setActiveLink(id);
  };

  // Handle Book Now button
  const handleBookNow = () => {
    setOpen(false);
    if (location.pathname === '/') {
      // On home page, scroll to rooms section
      scrollToSection('rooms-section');
    } else {
      // On other page, navigate to home and scroll to rooms
      navigate('/');
      setTimeout(() => {
        scrollToSection('rooms-section');
      }, 150);
    }
    setActiveLink('rooms');
  };

  // Update active link based on current page and scroll position
  useEffect(() => {
    const updateActiveLink = () => {
      const path = location.pathname;
      
      if (path === '/') {
        // On home page, check scroll position
        const scrollPosition = window.scrollY + 100;
        
        // Check each section
        const sections = [
          { id: 'home', element: null, threshold: 0 },
          { id: 'rooms', element: document.getElementById('rooms-section'), threshold: 100 },
          { id: 'gallery', element: document.getElementById('gallery-section'), threshold: 100 },
          { id: 'contact', element: document.getElementById('contact-section'), threshold: 100 },
          { id: 'faqs', element: document.getElementById('faqs-section'), threshold: 100 }
        ];
        
        let currentActive = 'home';
        
        // Check from bottom to top
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.id === 'home') {
            if (scrollPosition < 200) {
              currentActive = 'home';
              break;
            }
          } else if (section.element) {
            const elementTop = section.element.offsetTop;
            if (scrollPosition >= elementTop - section.threshold) {
              currentActive = section.id;
              break;
            }
          }
        }
        
        setActiveLink(currentActive);
      } else {
        // On other pages, check if the path matches any link
        const matchingLink = links.find(link => link.id === path.substring(1));
        if (matchingLink) {
          setActiveLink(matchingLink.id);
        } else {
          setActiveLink('');
        }
      }
    };
    
    // Initial update
    updateActiveLink();
    
    // Add scroll listener only on home page
    if (location.pathname === '/') {
      window.addEventListener('scroll', updateActiveLink);
    }
    
    return () => {
      window.removeEventListener('scroll', updateActiveLink);
    };
  }, [location.pathname]);

  // Check if a link should be active
  const isActive = (id) => {
    return activeLink === id;
  };

  return (
    <>
      <style>{NAV_STYLES}</style>

      <nav className="sn" role="navigation" aria-label="Main navigation">
        <div className="sn-inner">

          {/* Logo */}
          <button 
            className="sn-logo" 
            onClick={() => handleNavigation(null, 'home', '/')} 
            aria-label="Go to home"
          >
            <img src="/src/assets/SolazLogo.png" alt="Solaz" />
          </button>

          {/* Center links */}
          <div className="sn-links" role="list">
            {links.map(({ label, id, target, path }) => (
              <button
                key={id}
                role="listitem"
                className={`sn-link${isActive(id) ? ' active' : ''}`}
                onClick={() => handleNavigation(target, id, path)}
                aria-current={isActive(id) ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="sn-right">

            {/* Book Now */}
            <button
              className="sn-cta"
              onClick={handleBookNow}
              aria-label="Book a stay"
            >
              <span className="sn-cta-inner">Book Now</span>
            </button>

            {/* Dark Mode Only Icon */}
            <button
              className="sn-darkmode-only"
              onClick={() => setDark(d => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun /> : <Moon />}
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="sn-burger"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="sn-drawer" role="navigation" aria-label="Mobile navigation">
            {links.map(({ label, id, target, path }) => (
              <button
                key={id}
                className={`sn-mob-link${isActive(id) ? ' active' : ''}`}
                onClick={() => handleNavigation(target, id, path)}
                aria-current={isActive(id) ? 'page' : undefined}
              >
                {label}
              </button>
            ))}

            <div className="sn-mob-div" aria-hidden="true" />

            {/* Dark mode toggle in mobile drawer */}
            <div
              className="sn-mob-darkmode"
              onClick={() => setDark(d => !d)}
              role="button"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="sn-mob-darkmode-label" aria-hidden="true">
                {dark ? <Sun /> : <Moon />}
                <span>Dark Mode</span>
              </div>
              <button
                className={`sn-pill${dark ? ' on' : ' off'}`}
                onClick={e => { e.stopPropagation(); setDark(d => !d); }}
                role="switch"
                aria-checked={dark}
                aria-label="Toggle dark mode"
              >
                <div className="sn-pill-thumb" />
              </button>
            </div>

            {/* Mobile Book Now button */}
            <button
              className="sn-mob-cta"
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

// Icon components
const Sun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const Moon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);