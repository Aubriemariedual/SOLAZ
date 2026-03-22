// Admin/Booking.jsx
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminNavbar';
import {
  Clock, CheckCircle2, BedDouble, PhilippinePeso,
  Search, ChevronDown, Eye, Check, X,
  LogIn, LogOut, Mail, Phone, Users, Moon,
  MapPin, MessageSquare, CalendarDays, CheckCircle,
} from 'lucide-react';
import { db } from '../../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';

/* ─── Constants ────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'all',         label: 'All'         },
  { key: 'pending',     label: 'Pending'     },
  { key: 'confirmed',   label: 'Confirmed'   },
  { key: 'checked-in',  label: 'Checked In'  },
  { key: 'checked-out', label: 'Checked Out' },
  { key: 'cancelled',   label: 'Cancelled'   },
];

const STATUS = {
  'pending':     { label: 'Pending',     pill: 'bg-[#FEF9EC] text-[#8A6A0A]', dot: 'bg-[#C9A84C]', bar: '#C9A84C' },
  'confirmed':   { label: 'Confirmed',   pill: 'bg-[#EBF4E8] text-[#2D5016]', dot: 'bg-[#7A9E5C]', bar: '#7A9E5C' },
  'checked-in':  { label: 'Checked In',  pill: 'bg-[#EAF0FB] text-[#3B5FA0]', dot: 'bg-[#3B82C4]', bar: '#3B82C4' },
  'checked-out': { label: 'Checked Out', pill: 'bg-[#F5F4F0] text-[#7A6A4E]', dot: 'bg-[#B0A992]', bar: '#B0A992' },
  'cancelled':   { label: 'Cancelled',   pill: 'bg-[#FAEDEA] text-[#8B3A2A]', dot: 'bg-[#8B3A2A]', bar: '#8B3A2A' },
};

/* ─── Avatar initials ────────────────────────────────────────────────────── */
function Avatar({ name }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const colors = ['#2D5016', '#1E3A0F', '#8B3A2A', '#3B82C4', '#8A6A0A', '#475569'];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
      style={{ background: bg }}>
      {initials}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconBg, iconColor, num, label }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div>
        <div className="text-2xl font-bold leading-none" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{num}</div>
        <div className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: '#A89878' }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Booking Row Card ───────────────────────────────────────────────────── */
function BookingCard({ booking: b, onView, onAction, index }) {
  const [hovered, setHovered] = useState(false);
  const s = STATUS[b.status];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 flex"
      style={{
        background: '#FDFCF7',
        border: '1.5px solid #E4E0D4',
        boxShadow: hovered ? '0 8px 24px rgba(30,58,15,0.09)' : '0 1px 4px rgba(30,58,15,0.05)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        borderLeft: `4px solid ${s.bar}`,
        animationDelay: `${index * 0.04}s`,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1 p-5">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={b.guestName} />
            <div>
              <p className="text-base font-semibold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{b.guestName}</p>
              <p className="text-xs mt-0.5" style={{ color: '#B0A992' }}>{b.id} · {b.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {b.bookingType === 'walk-in' && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                style={{ background: '#EAF0FB', color: '#3B5FA0', fontSize: '0.62rem' }}>
                Walk-in
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${s.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
              {s.label}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3 pb-3" style={{ borderBottom: '1px solid #EEEBE0' }}>
          {[
            { icon: BedDouble, text: b.room },
            { icon: CalendarDays, text: `${b.checkIn} → ${b.checkOut}` },
            { icon: Users, text: `${b.guests} guest${b.guests > 1 ? 's' : ''}` },
            { icon: Moon, text: `${b.nights} night${b.nights > 1 ? 's' : ''}` },
            { icon: Mail, text: b.email },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: '#A89878', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: '#7A6A4E' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xl font-bold" style={{ color: '#8B3A2A', fontFamily: 'Georgia, serif' }}>
              ₱{b.total.toLocaleString()}
            </span>
            <span className="text-xs ml-1.5" style={{ color: '#B0A992' }}>· Pay at property</span>
            {b.specialRequest && b.specialRequest !== 'None' && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <MessageSquare size={11} style={{ color: '#C9A84C' }} />
                <span className="text-xs" style={{ color: '#8A6A0A' }}>{b.specialRequest}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <ActionButtons booking={b} onView={onView} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}

/* ─── Action Buttons ─────────────────────────────────────────────────────── */
function ActionButtons({ booking, onView, onAction }) {
  const { status } = booking;
  const btnBase = "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* View */}
      <button onClick={() => onView(booking)} className={btnBase}
        style={{ background: 'transparent', borderColor: '#E4E0D4', color: '#7A6A4E', fontFamily: "'DM Sans', sans-serif" }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0EDE4'; e.currentTarget.style.borderColor = '#C8C2B0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E0D4'; }}>
        <Eye size={12} /> View
      </button>

      {status === 'pending' && <>
        <button onClick={() => onAction(booking, 'confirm')} className={btnBase}
          style={{ background: '#2D5016', borderColor: '#2D5016', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => e.currentTarget.style.background = '#1E3A0F'}
          onMouseLeave={e => e.currentTarget.style.background = '#2D5016'}>
          <Check size={12} /> Confirm
        </button>
        <button onClick={() => onAction(booking, 'cancel')} className={btnBase}
          style={{ background: 'transparent', borderColor: 'rgba(139,58,42,0.3)', color: '#8B3A2A', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FAEDEA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <X size={12} /> Cancel
        </button>
      </>}

      {status === 'confirmed' && <>
        <button onClick={() => onAction(booking, 'checkin')} className={btnBase}
          style={{ background: 'transparent', borderColor: 'rgba(59,130,196,0.3)', color: '#3B5FA0', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EAF0FB'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <LogIn size={12} /> Check In
        </button>
        <button onClick={() => onAction(booking, 'cancel')} className={btnBase}
          style={{ background: 'transparent', borderColor: 'rgba(139,58,42,0.3)', color: '#8B3A2A', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FAEDEA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <X size={12} /> Cancel
        </button>
      </>}

      {status === 'checked-in' && (
        <button onClick={() => onAction(booking, 'checkout')} className={btnBase}
          style={{ background: 'transparent', borderColor: '#E4E0D4', color: '#7A6A4E', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F0EDE4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <LogOut size={12} /> Check Out
        </button>
      )}
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────────── */
function DetailModal({ booking: b, onClose, onAction }) {
  if (!b) return null;
  const s = STATUS[b.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-4" style={{ borderBottom: '1px solid #EEEBE0' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>Booking Details</h2>
            <p className="text-xs mt-1" style={{ color: '#A89878' }}>{b.id} · {b.timestamp}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${s.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-150"
              style={{ background: '#F0EBD8', border: 'none', cursor: 'pointer', color: '#7A6A4E' }}
              onMouseEnter={e => e.currentTarget.style.background = '#DDD5BB'}
              onMouseLeave={e => e.currentTarget.style.background = '#F0EBD8'}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-5 flex flex-col gap-4">
          {/* Guest */}
          <div className="p-4 rounded-xl" style={{ background: '#F7F4EC', border: '1px solid #E4E0D4' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A89878', letterSpacing: '0.1em' }}>Guest Information</p>
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={b.guestName} />
              <div>
                <p className="font-semibold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{b.guestName}</p>
                {b.bookingType === 'walk-in' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#EAF0FB', color: '#3B5FA0', fontSize: '0.6rem' }}>Walk-in</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Mail, label: 'Email', value: b.email },
                { icon: Phone, label: 'Phone', value: b.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#A89878', fontSize: '0.65rem' }}>{label}</p>
                  <div className="flex items-center gap-1.5">
                    <Icon size={11} style={{ color: '#A89878' }} />
                    <p className="text-sm" style={{ color: '#231C0F' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation */}
          <div className="p-4 rounded-xl" style={{ background: '#F7F4EC', border: '1px solid #E4E0D4' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A89878', letterSpacing: '0.1em' }}>Reservation Details</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Room', value: b.room },
                { label: 'Guests', value: `${b.guests} pax` },
                { label: 'Check-in', value: b.checkIn },
                { label: 'Check-out', value: b.checkOut },
                { label: 'Duration', value: `${b.nights} night${b.nights > 1 ? 's' : ''}` },
                { label: 'Rate/Night', value: `₱${b.rate.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#A89878', fontSize: '0.65rem' }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: '#231C0F' }}>{value}</p>
                </div>
              ))}
              {b.specialRequest && b.specialRequest !== 'None' && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#A89878', fontSize: '0.65rem' }}>Special Request</p>
                  <p className="text-sm" style={{ color: '#231C0F' }}>{b.specialRequest}</p>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-5 py-4 rounded-xl"
            style={{ background: '#1E3A0F' }}>
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>Total Amount</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Pay at property</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }}>
              ₱{b.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4" style={{ borderTop: '1px solid #EEEBE0' }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm transition-all duration-150"
            style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A89878'; e.currentTarget.style.color = '#231C0F'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD5BB'; e.currentTarget.style.color = '#7A6A4E'; }}>
            Close
          </button>
          <ActionButtons booking={b} onView={() => {}} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}

/* ─── Action Confirm Modal ───────────────────────────────────────────────── */
function ConfirmModal({ data, onClose, onConfirm }) {
  if (!data) return null;
  const { booking, type } = data;

  const config = {
    confirm:  { title: 'Confirm Booking?',    msg: `Confirm reservation for`,  icon: Check,   iconBg: '#EBF4E8', iconColor: '#2D5016', btnLabel: 'Confirm',    btnBg: '#2D5016' },
    cancel:   { title: 'Cancel Booking?',     msg: `Cancel the booking for`,   icon: X,       iconBg: '#FAEDEA', iconColor: '#8B3A2A', btnLabel: 'Yes, Cancel', btnBg: '#8B3A2A' },
    checkin:  { title: 'Check In Guest?',     msg: `Check in`,                 icon: LogIn,   iconBg: '#EAF0FB', iconColor: '#3B5FA0', btnLabel: 'Check In',   btnBg: '#3B5FA0' },
    checkout: { title: 'Check Out Guest?',    msg: `Check out`,                icon: LogOut,  iconBg: '#F5F4F0', iconColor: '#7A6A4E', btnLabel: 'Check Out',  btnBg: '#7A6A4E' },
  }[type];

  const { title, msg, icon: Icon, iconBg, iconColor, btnLabel, btnBg } = config;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl text-center"
        style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif" }}>
        <div className="px-8 pt-8 pb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: iconBg }}>
            <Icon size={22} color={iconColor} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#A89878' }}>
            {msg} <strong style={{ color: '#3D3222' }}>{booking.guestName}</strong>?
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 px-8 pb-7">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm transition-colors duration-150"
            style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#A89878'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#DDD5BB'}>
            Go Back
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-150"
            style={{ background: btnBg, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
function BookingContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filterRoom, setFilterRoom] = useState('all');
  const [detail, setDetail] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Reference to the bookings collection
  const bookingsCollection = collection(db, 'bookings');

  // Load bookings from Firebase on component mount
  useEffect(() => {
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = [];
      snapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading bookings:", error);
      showToast('Failed to load bookings', 'error');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      (b.guestName?.toLowerCase().includes(q) || 
       b.id?.toLowerCase().includes(q) || 
       b.email?.toLowerCase().includes(q) || 
       b.room?.toLowerCase().includes(q)) &&
      (activeTab === 'all' || b.status === activeTab) &&
      (filterRoom === 'all' || b.room === filterRoom)
    );
  });

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all' ? bookings.length : bookings.filter(b => b.status === t.key).length;
    return acc;
  }, {});

  const stats = {
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    checkedIn: bookings.filter(b => b.status === 'checked-in').length,
    revenue:   bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.total || 0), 0),
  };

  const roomOptions = [...new Set(bookings.map(b => b.room))];

  const handleAction = (booking, type) => setActionModal({ booking, type });

  // Helper function to add blocked dates
  const addBlockedDates = async (booking) => {
    try {
      const bookedDatesRef = collection(db, 'bookedDates');
      
      // Parse dates from the booking
      let checkInDate, checkOutDate;
      
      // Handle different date formats (check for both checkInDate and checkIn fields)
      if (booking.checkInDate) {
        checkInDate = new Date(booking.checkInDate);
        checkOutDate = new Date(booking.checkOutDate);
      } else if (booking.checkIn) {
        // Parse from formatted date strings like "Jan 1, 2024"
        checkInDate = new Date(booking.checkIn);
        checkOutDate = new Date(booking.checkOut);
      } else {
        console.error('No date information found in booking');
        return false;
      }
      
      // Validate dates
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        console.error('Invalid date format in booking');
        return false;
      }
      
      // Generate all dates between check-in and check-out (inclusive)
      const datesToBlock = [];
      const currentDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      
      while (currentDate <= endDate) {
        datesToBlock.push({
          roomId: booking.room,
          roomName: booking.room,
          date: currentDate.toISOString(),
          dateString: currentDate.toDateString(),
          bookingId: booking.id,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          createdAt: serverTimestamp(),
          userId: booking.userId || null,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Add all dates to bookedDates collection
      for (const dateData of datesToBlock) {
        await addDoc(bookedDatesRef, dateData);
      }
      
      console.log(`Added ${datesToBlock.length} blocked dates for room ${booking.room}`);
      return true;
    } catch (error) {
      console.error('Error adding blocked dates:', error);
      throw error;
    }
  };
  
  // Helper function to remove blocked dates
  const removeBlockedDates = async (bookingId) => {
    try {
      const bookedDatesRef = collection(db, 'bookedDates');
      const q = query(bookedDatesRef, where('bookingId', '==', bookingId));
      const snapshot = await getDocs(q);
      
      const deletePromises = [];
      snapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
      console.log(`Removed ${deletePromises.length} blocked dates for booking ${bookingId}`);
      return true;
    } catch (error) {
      console.error('Error removing blocked dates:', error);
      throw error;
    }
  };

  const applyAction = async () => {
    if (!actionModal) return;
    const { booking, type } = actionModal;
    const statusMap = { confirm: 'confirmed', cancel: 'cancelled', checkin: 'checked-in', checkout: 'checked-out' };
    const msgMap = { confirm: 'Booking confirmed', cancel: 'Booking cancelled', checkin: 'Guest checked in', checkout: 'Guest checked out' };
    
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      
      // Handle confirmation - add blocked dates
      if (type === 'confirm') {
        // Update booking status
        await updateDoc(bookingRef, {
          status: statusMap[type],
          updatedAt: serverTimestamp(),
          confirmedAt: serverTimestamp()
        });
        
        // Add blocked dates to prevent double booking
        await addBlockedDates(booking);
        
        showToast(msgMap[type], 'success');
      } 
      // Handle cancellation of confirmed booking - remove blocked dates
      else if (type === 'cancel' && booking.status === 'confirmed') {
        await updateDoc(bookingRef, {
          status: statusMap[type],
          updatedAt: serverTimestamp(),
          cancelledAt: serverTimestamp()
        });
        
        // Remove blocked dates
        await removeBlockedDates(booking.id);
        
        showToast(msgMap[type], 'error');
      }
      // Handle cancellation of pending booking - no blocked dates to remove
      else if (type === 'cancel' && booking.status === 'pending') {
        await updateDoc(bookingRef, {
          status: statusMap[type],
          updatedAt: serverTimestamp(),
          cancelledAt: serverTimestamp()
        });
        
        showToast(msgMap[type], 'error');
      }
      // Handle check-in and check-out - no date blocking changes needed
      else if (type === 'checkin') {
        await updateDoc(bookingRef, {
          status: statusMap[type],
          updatedAt: serverTimestamp(),
          checkedInAt: serverTimestamp()
        });
        showToast(msgMap[type], 'success');
      }
      else if (type === 'checkout') {
        await updateDoc(bookingRef, {
          status: statusMap[type],
          updatedAt: serverTimestamp(),
          checkedOutAt: serverTimestamp()
        });
        showToast(msgMap[type], 'success');
      }
      
    } catch (error) {
      console.error("Error updating booking:", error);
      showToast('Failed to update booking', 'error');
    }
    
    setActionModal(null);
    setDetail(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 lg:p-10 flex items-center justify-center" style={{ backgroundColor: '#F4F2EA' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016] mb-4"></div>
          <p style={{ color: '#7A6A4E' }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-10" style={{ backgroundColor: '#F4F2EA', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#7A9E5C', letterSpacing: '0.18em' }}>Admin Panel</p>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>Bookings</h1>
        <p className="text-sm mt-1 font-light" style={{ color: '#A89878' }}>Review, confirm, and manage all guest reservations.</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <StatCard icon={Clock}           iconBg="#FEF9EC" iconColor="#8A6A0A" num={stats.pending}                        label="Awaiting Confirm" />
        <StatCard icon={CheckCircle2}     iconBg="#EBF4E8" iconColor="#2D5016" num={stats.confirmed}                      label="Confirmed"        />
        <StatCard icon={BedDouble}        iconBg="#EAF0FB" iconColor="#3B5FA0" num={stats.checkedIn}                      label="Checked In"       />
        <StatCard icon={PhilippinePeso}   iconBg="#FAEDEA" iconColor="#8B3A2A" num={`₱${stats.revenue.toLocaleString()}`} label="Total Revenue"    />
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1" style={{ borderBottom: '1px solid #E4E0D4' }}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? '#2D5016' : '#A89878',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 600 : 400,
                borderBottom: active ? '2px solid #2D5016' : '2px solid transparent',
                marginBottom: -1,
              }}>
              {t.label}
              {counts[t.key] > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: active ? '#EBF4E8' : '#F0EDE4', color: active ? '#2D5016' : '#A89878', fontSize: '0.65rem' }}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#A89878' }} />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-[#C8C2B0]"
            style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4', color: '#231C0F', fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Search by name, ID, email, or room…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 2px rgba(45,80,22,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#E4E0D4'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="relative">
          <select
            className="pl-4 pr-9 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer min-w-[160px]"
            style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4', color: '#231C0F', fontFamily: "'DM Sans', sans-serif" }}
            value={filterRoom}
            onChange={e => setFilterRoom(e.target.value)}
          >
            <option value="all">All Rooms</option>
            {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A89878' }} />
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0
          ? <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4' }}>
              <CalendarDays size={36} style={{ color: '#A89878', opacity: 0.3, marginBottom: 12 }} />
              <p className="text-sm" style={{ color: '#A89878' }}>No bookings found.</p>
              <p className="text-xs mt-1" style={{ color: '#C8C2B0' }}>Try adjusting your search or filters.</p>
            </div>
          : filtered.map((b, i) => (
              <BookingCard key={b.id} booking={b} index={i} onView={setDetail} onAction={handleAction} />
            ))
        }
      </div>

      {/* ── Modals ── */}
      <DetailModal booking={detail} onClose={() => setDetail(null)} onAction={handleAction} />
      <ConfirmModal data={actionModal} onClose={() => setActionModal(null)} onConfirm={applyAction} />

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-white"
          style={{
            background: toast.type === 'error' ? '#8B3A2A' : '#1E3A0F',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            fontFamily: "'DM Sans', sans-serif",
            animation: 'slideUp 0.3s cubic-bezier(.34,1.4,.64,1)',
          }}>
          <CheckCircle size={15} />
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px) scale(.96); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

export default function Booking() {
  return (
    <AdminLayout>
      <BookingContent />
    </AdminLayout>
  );
}