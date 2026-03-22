// SelectRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, MapPin, Star, Wifi, Wind, Car, Bath, 
  Coffee, Tv, Heart, ChevronLeft, ChevronRight, Search, Plus, Minus, X 
} from 'lucide-react';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

  .selectroom-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    position: relative;
  }

  .selectroom-back-btn {
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

  .selectroom-back-btn:hover {
    transform: translateX(-5px);
    border-color: var(--rust);
    color: var(--rust);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

  .sr-hero {
    background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=80');
    background-size: cover;
    background-position: center;
    padding: 100px 40px 80px;
    text-align: center;
    color: white;
  }

  .sr-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 600;
    margin-bottom: 16px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }

  .sr-hero-subtitle {
    font-size: 18px;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.95;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .sr-search-wrap {
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

  .search-results-badge {
    text-align: center;
    margin-bottom: 24px;
  }
  .results-badge {
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

  .sr-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 40px 20px;
    text-align: center;
  }
  .sr-section-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--rust);
    margin-bottom: 10px;
  }
  .sr-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
  }
  .sr-title span {
    color: var(--rust);
    font-style: italic;
  }
  .sr-subtitle {
    font-size: 16px;
    color: var(--muted);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .sr-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px 80px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  @media (max-width: 900px) { .sr-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 580px) { .sr-grid { grid-template-columns: 1fr; padding: 0 20px 60px; } }

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

  .card-select-btn {
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

  .card-select-btn:hover {
    background: linear-gradient(135deg, var(--forest2), var(--forest));
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(45,80,22,0.3);
  }

  .empty-state {
    grid-column: 1/-1;
    text-align: center;
    padding: 100px 20px;
  }
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  .empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    color: var(--text);
    margin-bottom: 10px;
  }
  .empty-sub {
    font-size: 16px;
    color: var(--muted);
  }

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
    .selectroom-back-btn {
      top: 20px;
      left: 20px;
      padding: 8px 16px;
      font-size: 13px;
    }
  }
`;

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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function isSameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isBetween(d, a, b) { if (!a || !b) return false; const [s, e] = a < b ? [a, b] : [b, a]; return d > s && d < e; }

function CalMonth({ year, month, startDate, endDate, hoverDate, onDayClick, onDayHover, showPrev, showNext, onPrev, onNext }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  const rangeEnd = endDate || hoverDate;
  return (
    <div>
      <div className="cal-month-head">
        <button className={`cal-nav-btn${!showPrev ? ' hidden' : ''}`} onClick={onPrev}><ChevronLeft size={13} /></button>
        <span className="cal-month-title">{MONTHS[month]} {year}</span>
        <button className={`cal-nav-btn${!showNext ? ' hidden' : ''}`} onClick={onNext}><ChevronRight size={13} /></button>
      </div>
      <div className="cal-grid">
        {DAYS.map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="cal-day empty" />;
          const isPast = day < today, isStart = isSameDay(day, startDate), isEnd = isSameDay(day, endDate);
          const inRange = !isPast && isBetween(day, startDate, rangeEnd);
          let cls = 'cal-day';
          if (isPast) cls += ' past';
          if (isStart) cls += ` range-start${endDate ? ' has-end' : ''}`;
          if (isEnd) cls += ` range-end${startDate ? ' has-start' : ''}`;
          if (inRange) cls += ' in-range';
          return <div key={i} className={cls} onClick={() => !isPast && onDayClick(day)} onMouseEnter={() => !isPast && onDayHover(day)}>{day.getDate()}</div>;
        })}
      </div>
    </div>
  );
}

function SelectRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBar, setOpenBar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [calOffset, setCalOffset] = useState(0);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const barRef = useRef(null);

  const bookingData = location.state;

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

  // Filter rooms based on search criteria
  useEffect(() => {
    if (!rooms.length) return;
    
    let filtered = [...rooms];
    const totalGuestsCount = guests.adults + guests.children;
    
    // Filter by room name/type search
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchTerm) || 
        room.type.toLowerCase().includes(searchTerm) ||
        (room.desc && room.desc.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by date availability (placeholder - implement actual availability check)
    if (startDate && endDate) {
      // Implement actual availability check here
      // For now, we'll show all rooms
    }
    
    // Filter by guest capacity
    if (totalGuestsCount > 0) {
      filtered = filtered.filter(room => (room.capacity || room.guests) >= totalGuestsCount);
    }
    
    setFilteredRooms(filtered);
  }, [rooms, searchQuery, startDate, endDate, guests.adults, guests.children]);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests === 0 ? null
    : `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`;

  const fmt = d => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
  const whenLabel = startDate && endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : startDate ? `${fmt(startDate)} – ?` : null;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const baseDate = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  function handleDayClick(day) {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      setHoverDate(null);
    } else {
      if (day < startDate) {
        setStartDate(day);
        setEndDate(null);
      } else {
        setEndDate(day);
        setHoverDate(null);
      }
    }
  }

  const adjGuest = (key, delta) => setGuests(g => ({ ...g, [key]: Math.max(0, g[key] + delta) }));

  const handleSelectRoom = (room) => {
    navigate('/booknow', {
      state: {
        selectedRoom: room,
        hotel: {
          id: 'solaz-main',
          name: 'Solaz Resort & Spa',
          location: 'Cordova, Cebu, Philippines'
        },
        guests: totalGuests,
        checkInDate: startDate ? startDate.toISOString().split('T')[0] : bookingData?.checkInDate || null,
        checkOutDate: endDate ? endDate.toISOString().split('T')[0] : bookingData?.checkOutDate || null
      }
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
    setGuests({ adults: 2, children: 0, infants: 0 });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenBar(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSearchActive = searchQuery.trim() !== '' || (startDate && endDate) || totalGuests > 2;

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="selectroom-page">
          <button className="selectroom-back-btn" onClick={() => navigate('/')}><ArrowLeft size={18} /> Back to Home</button>
          <div className="sr-hero"><h1 className="sr-hero-title">Select Your Room</h1><p className="sr-hero-subtitle">Choose from our luxurious accommodations for your perfect stay.</p></div>
          <div className="sr-grid"><div className="loading-spinner"><div className="spinner"></div><p style={{ color: 'var(--muted)' }}>Loading available rooms...</p></div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="selectroom-page">
        <button className="selectroom-back-btn" onClick={() => navigate('/')}><ArrowLeft size={18} /> Back to Home</button>

        <div className="sr-hero">
          <h1 className="sr-hero-title">Select Your Room</h1>
          <p className="sr-hero-subtitle">Choose from our luxurious accommodations for your perfect stay.</p>
        </div>

        <div className="sr-search-wrap">
          <div className="airbnb-bar" ref={barRef}>
            <div className={`ab-field${openBar === 'room' ? ' open' : ''}`} style={{ flex: 1.6 }}
              onClick={() => setOpenBar(o => o === 'room' ? null : 'room')}>
              <div className="ab-label">Room</div>
              {openBar === 'room' ? (
                <input className="ab-input" placeholder="Search by room name or type" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} onClick={e => e.stopPropagation()} autoFocus />
              ) : (
                <div className={`ab-value${searchQuery ? ' filled' : ''}`}>{searchQuery || 'Search rooms by name or type'}</div>
              )}
            </div>
            <div className="ab-sep" />
            <div className={`ab-field${openBar === 'when' ? ' open' : ''}`} style={{ flex: 1.3 }}
              onClick={() => setOpenBar(o => o === 'when' ? null : 'when')}>
              <div className="ab-label">When</div>
              <div className={`ab-value${whenLabel ? ' filled' : ''}`}>{whenLabel || 'Add dates'}</div>
              {openBar === 'when' && (
                <div className="ab-dropdown" onClick={e => e.stopPropagation()}>
                  <div className="cal-months">
                    <CalMonth year={baseDate.getFullYear()} month={baseDate.getMonth()}
                      startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                      onDayClick={handleDayClick} onDayHover={setHoverDate}
                      showPrev={calOffset > 0} showNext={false}
                      onPrev={() => setCalOffset(o => o - 1)} onNext={() => setCalOffset(o => o + 1)} />
                    <CalMonth year={nextDate.getFullYear()} month={nextDate.getMonth()}
                      startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                      onDayClick={handleDayClick} onDayHover={setHoverDate}
                      showPrev={false} showNext={true}
                      onPrev={() => setCalOffset(o => o - 1)} onNext={() => setCalOffset(o => o + 1)} />
                  </div>
                </div>
              )}
            </div>
            <div className="ab-sep" />
            <div className={`ab-field${openBar === 'who' ? ' open' : ''}`} style={{ flex: 0.9 }}
              onClick={() => setOpenBar(o => o === 'who' ? null : 'who')}>
              <div className="ab-label">Who</div>
              <div className={`ab-value${guestLabel ? ' filled' : ''}`}>{guestLabel || 'Add guests'}</div>
              {openBar === 'who' && (
                <div className="ab-dropdown guests-drop" onClick={e => e.stopPropagation()}>
                  {[
                    { key: 'adults', label: 'Adults', desc: 'Ages 13+' },
                    { key: 'children', label: 'Children', desc: 'Ages 2–12' },
                    { key: 'infants', label: 'Infants', desc: 'Under 2' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="guest-row">
                      <div><div className="g-name">{label}</div><div className="g-desc">{desc}</div></div>
                      <div className="g-counter">
                        <button className="g-btn" disabled={guests[key] <= 0} onClick={() => adjGuest(key, -1)}><Minus size={13} /></button>
                        <span className="g-count">{guests[key]}</span>
                        <button className="g-btn" onClick={() => adjGuest(key, 1)}><Plus size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="ab-search-btn" onClick={() => setOpenBar(null)}><Search size={18} /> Search</button>
          </div>
        </div>

        <div className="sr-header">
          <div className="sr-section-label">FIND YOUR PERFECT STAY</div>
          <h1 className="sr-title">Choose Your <span>Room</span></h1>
          <p className="sr-subtitle">Each of our accommodations is thoughtfully designed to provide the perfect blend of luxury, comfort, and Filipino hospitality.</p>
        </div>

        {isSearchActive && (
          <div className="search-results-badge">
            <div className="results-badge">
              Found {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} matching your search
              <button className="clear-filters-btn" onClick={clearAllFilters}>Clear all filters</button>
            </div>
          </div>
        )}

        <div className="sr-grid">
          {filteredRooms.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <div className="empty-title">No Rooms Found</div>
              <p className="empty-sub">Try adjusting your search criteria or clear the filters.</p>
            </div>
          )}
          {filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="card-img-wrap">
                <img className="card-img" src={room.imageUrl} alt={room.name} />
                <div className="card-badge">{room.badge}</div>
              </div>
              <div className="card-body">
                <div className="card-name">{room.name}</div>
                <div className="card-location"><MapPin size={12} />{room.location}</div>
                <div className="card-amenities-row">
                  {room.amenities && room.amenities.slice(0, 3).map((amenity, i) => (
                    <div key={i} className="card-amenity-chip">{amenity}</div>
                  ))}
                </div>
                <div className="card-desc">{room.desc}</div>
                <div className="card-footer">
                  <div className="card-price">₱{room.price}<span>/night</span></div>
                  <div className="card-rating"><Star size={14} />{room.rating} ({room.reviews})</div>
                </div>
                <button className="card-select-btn" onClick={() => handleSelectRoom(room)}>SELECT ROOM</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SelectRoom;