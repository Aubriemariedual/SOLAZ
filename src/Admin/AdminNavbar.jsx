// Admin/components/AdminNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BedDouble, Images, CalendarDays, LogOut, ChevronRight, Leaf
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

/* ─── Nav config ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'bookings', label: 'Bookings',  icon: CalendarDays, path: '/admin/bookings' },
  { id: 'rooms',    label: 'Rooms',     icon: BedDouble,    path: '/admin/rooms'              },
  { id: 'gallery',  label: 'Gallery',   icon: Images,       path: '/admin/gallery'            },
];

/* ─── Layout wrapper (use this in your router) ───────────────────────────── */
export function AdminLayout({ children, onLogout }) {
  const [expanded, setExpanded] = useState(false);

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      if (onLogout) {
        onLogout();
      }
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F2EA' }}>
      <AdminNavbar 
        expanded={expanded} 
        setExpanded={setExpanded} 
        onLogout={handleLogoutClick}
      />
      {/* Main content shifts with the sidebar */}
      <main
        style={{
          flex: 1,
          marginLeft: expanded ? 220 : 64,
          transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)',
          minHeight: '100vh',
          backgroundColor: '#F4F2EA',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {children}
      </main>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
function AdminNavbar({ expanded, setExpanded, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const timeoutRef = useRef(null);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const isActive = (path) => location.pathname === path;

  // Fetch pending bookings count in real-time
  useEffect(() => {
    const bookingsRef = collection(db, 'bookings');
    // Query for pending bookings (adjust status field name as per your database)
    const pendingQuery = query(bookingsRef, where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
      setPendingBookingsCount(snapshot.size);
    }, (error) => {
      console.error('Error fetching bookings:', error);
    });

    return () => unsubscribe();
  }, []);

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a timeout to collapse after 300ms
    timeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 300);
  };

  const handleMouseEnter = () => {
    // Clear the collapse timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpanded(true);
  };

  // Set up event listeners
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      // Fallback logout
      try {
        await signOut(auth);
        navigate('/admin/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  // Check if current route is bookings or root admin route
  const isBookingsActive = () => {
    return location.pathname === '/admin/bookings' || 
           location.pathname === '/admin' || 
           location.pathname === '/admin/';
  };

  return (
    <aside
      ref={sidebarRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: expanded ? 220 : 64,
        backgroundColor: '#1E3A0F',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        zIndex: 200,
        boxShadow: '2px 0 20px rgba(10,20,6,.18)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Gold top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, #C9A84C 0%, transparent 100%)',
        opacity: 0.7,
      }} />

      {/* ── Logo ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 1rem',
        height: 64,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
        overflow: 'hidden',
        cursor: 'pointer',
      }} onClick={() => navigate('/admin/bookings')}>
        {/* Logo image */}
        <img
          src="/SolazLogo.png"
          alt="Solaz"
          style={{
            height: 28,
            width: 'auto',
            flexShrink: 0,
            filter: 'brightness(0) invert(1)',
            opacity: 0.92,
          }}
        />
        {/* Wordmark shown only when expanded */}
        <span style={{
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          whiteSpace: 'nowrap',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}>
          Admin Panel
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: '0.5rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => {
          // Make Bookings active for /admin, /admin/, and /admin/bookings
          const active = id === 'bookings' 
            ? isBookingsActive()
            : isActive(path);
          
          // Only show badge for bookings
          const badge = id === 'bookings' && pendingBookingsCount > 0 ? pendingBookingsCount : null;
          
          return (
            <NavItem
              key={id}
              label={label}
              icon={<Icon size={16} />}
              badge={badge}
              active={active}
              expanded={expanded}
              onClick={() => navigate(path)}
            />
          );
        })}
      </nav>

      {/* ── Bottom: logout + toggle ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.5rem 0 0.75rem', flexShrink: 0 }}>
        <NavItem
          label="Log Out"
          icon={<LogOut size={16} />}
          expanded={expanded}
          isLogout
          onClick={handleLogout}
        />

        {/* Expand / Collapse toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'flex-end' : 'center',
            width: expanded ? 'calc(100% - 1rem)' : 40,
            margin: expanded ? '0.25rem 0.5rem 0' : '0.25rem auto 0',
            padding: '0.45rem',
            borderRadius: '0.45rem',
            border: 'none',
            background: 'rgba(255,255,255,0.05)',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <ChevronRight
            size={14}
            color="rgba(255,255,255,0.35)"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s',
              flexShrink: 0,
            }}
          />
        </button>
      </div>
    </aside>
  );
}

/* ─── Nav Item ───────────────────────────────────────────────────────────── */
function NavItem({ label, icon, badge, active, expanded, isLogout, onClick }) {
  const [hovered, setHovered] = useState(false);

  const bg = active
    ? 'rgba(122,158,92,0.18)'
    : hovered
    ? 'rgba(255,255,255,0.07)'
    : 'transparent';

  const iconBg = active
    ? 'rgba(122,158,92,0.25)'
    : isLogout
    ? 'rgba(139,58,42,0.18)'
    : 'rgba(255,255,255,0.06)';

  const iconColor = isLogout ? '#c07060' : active ? '#A8D58A' : 'rgba(255,255,255,0.6)';
  const labelColor = active ? '#fff' : isLogout ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.65)';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: 'calc(100% - 1rem)',
          margin: '0.1rem 0.5rem',
          padding: '0.6rem 0.75rem',
          borderRadius: '0.55rem',
          border: 'none',
          background: bg,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'background 0.15s',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Active bar */}
        {active && (
          <div style={{
            position: 'absolute',
            left: 0, top: '20%', bottom: '20%',
            width: 3,
            borderRadius: '0 3px 3px 0',
            background: '#C9A84C',
          }} />
        )}

        {/* Icon */}
        <div style={{
          width: 32, height: 32,
          borderRadius: '0.4rem',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor,
          flexShrink: 0,
          transition: 'background 0.15s',
        }}>
          {icon}
        </div>

        {/* Label */}
        <span style={{
          fontSize: '0.82rem',
          fontWeight: active ? 600 : 400,
          color: labelColor,
          whiteSpace: 'nowrap',
          opacity: expanded ? 1 : 0,
          transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.22s, transform 0.22s',
          pointerEvents: 'none',
        }}>
          {label}
        </span>

        {/* Badge */}
        {badge !== null && badge > 0 && (
          <span style={{
            marginLeft: 'auto',
            background: '#C9A84C',
            color: '#1E3A0F',
            fontSize: '0.58rem',
            fontWeight: 700,
            padding: '0.15rem 0.45rem',
            borderRadius: 100,
            flexShrink: 0,
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.22s, transform 0.22s',
          }}>
            {badge}
          </span>
        )}
      </button>

      {/* Tooltip when collapsed */}
      {!expanded && hovered && (
        <div style={{
          position: 'fixed',
          left: 72,
          top: 'auto',
          background: '#231C0F',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '0.35rem 0.75rem',
          borderRadius: '0.4rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          zIndex: 300,
          transform: 'translateY(-50%)',
          marginTop: 16,
        }}>
          {label}{badge ? ` (${badge})` : ''}
        </div>
      )}
    </div>
  );
}

export default AdminNavbar;