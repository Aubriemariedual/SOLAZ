// Admin/pages/AdminHome.jsx
import React, { useState } from 'react';
import { CalendarPlus, UserPlus, FileText, Settings, ArrowUpRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminNavbar';


// ── Mock Data ─────────────────────────────────────────────────────────────────
const RECENT_BOOKINGS = [
  { id: 'BK-1041', guest: 'Isabella Monroe',  room: 'Ocean Suite 04',     checkIn: 'Mar 22, 2026', checkOut: 'Mar 27, 2026', status: 'Confirmed'   },
  { id: 'BK-1040', guest: 'Luca Ferreira',    room: 'Garden Villa 11',    checkIn: 'Mar 21, 2026', checkOut: 'Mar 24, 2026', status: 'Checked In'  },
  { id: 'BK-1039', guest: 'Naomi Takahashi',  room: 'Clifftop Suite 02',  checkIn: 'Mar 20, 2026', checkOut: 'Mar 23, 2026', status: 'Checked In'  },
  { id: 'BK-1038', guest: 'James Whitfield',  room: 'Pool Cabana 07',     checkIn: 'Mar 18, 2026', checkOut: 'Mar 21, 2026', status: 'Checked Out' },
  { id: 'BK-1037', guest: 'Sofia Reyes',      room: 'Beachfront Room 03', checkIn: 'Mar 17, 2026', checkOut: 'Mar 20, 2026', status: 'Checked Out' },
  { id: 'BK-1036', guest: 'Oliver Bennett',   room: 'Ocean Suite 01',     checkIn: 'Mar 25, 2026', checkOut: 'Mar 30, 2026', status: 'Pending'     },
];

const STATUS_STYLES = {
  'Confirmed':   { bg: '#EBF4E8', color: '#2D5016', dot: '#2D5016'  },
  'Checked In':  { bg: '#EAF3FB', color: '#1A5C8A', dot: '#2A82C5'  },
  'Checked Out': { bg: '#F5F4F0', color: '#7A6A4E', dot: '#B0A992'  },
  'Pending':     { bg: '#FEF9EC', color: '#8A6A0A', dot: '#C9950C'  },
};

const QUICK_ACTIONS = [
  { label: 'New Booking', icon: CalendarPlus, path: '/admin/bookings/new' },
  { label: 'Add Guest',   icon: UserPlus,     path: '/admin/guests/new'   },
  { label: 'Reports',     icon: FileText,     path: '/admin/reports'      },
  { label: 'Settings',    icon: Settings,     path: '/admin/settings'     },
];

function HomeContent() {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredRow,    setHoveredRow]    = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      className="min-h-screen p-8 lg:p-10"
      style={{ backgroundColor: '#F4F2EA', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={13} style={{ color: '#B0A992' }} />
          <span className="text-xs" style={{ color: '#B0A992', letterSpacing: '0.04em' }}>{today}</span>
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: '#231C0F', letterSpacing: '-0.01em' }}>
          Good morning, Admin
        </h1>
        <p className="text-sm mt-1" style={{ color: '#A89878' }}>Here's a snapshot of today's activity.</p>
      </div>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#A89878', letterSpacing: '0.1em' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, path }, i) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              onMouseEnter={() => setHoveredAction(i)}
              onMouseLeave={() => setHoveredAction(null)}
              className="flex flex-col items-start gap-3 p-5 rounded-2xl text-left"
              style={{
                background:  hoveredAction === i ? '#fff' : '#FDFCF7',
                border:     `1.5px solid ${hoveredAction === i ? '#D0CBB8' : '#E4E0D4'}`,
                boxShadow:   hoveredAction === i ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                transform:   hoveredAction === i ? 'translateY(-2px)' : 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.18s',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: hoveredAction === i ? '#EBF4E8' : '#F0EDE4' }}>
                <Icon size={16} style={{ color: '#2D5016' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#231C0F' }}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Bookings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#A89878', letterSpacing: '0.1em' }}>
            Recent Bookings
          </h2>
          <button
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: '#2D5016', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => navigate('/admin/bookings')}
          >
            View all <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EEEBE0' }}>
                  {['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: '#A89878', letterSpacing: '0.08em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((b, i) => {
                  const s = STATUS_STYLES[b.status];
                  return (
                    <tr
                      key={b.id}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: i === RECENT_BOOKINGS.length - 1 ? 'none' : '1px solid #EEEBE0',
                        background: hoveredRow === i ? '#F7F5EE' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td className="px-5 py-4 text-xs font-mono" style={{ color: '#A89878' }}>{b.id}</td>
                      <td className="px-5 py-4 text-sm font-medium whitespace-nowrap" style={{ color: '#231C0F' }}>{b.guest}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: '#7A6A4E' }}>{b.room}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: '#7A6A4E' }}>{b.checkIn}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: '#7A6A4E' }}>{b.checkOut}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                          style={{ background: s.bg, color: s.color }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminHome() {
  return (
    <AdminLayout><HomeContent /></AdminLayout>
  );
}