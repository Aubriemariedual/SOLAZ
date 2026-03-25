import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, MapPin, Trash2, CheckCheck, Search, Filter,
         ChevronDown, MailOpen, Archive, Star, RefreshCw, X, Send,
         AlertCircle, User, Calendar, MessageSquare, MoreVertical } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';

/* ─── Styles ─────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:    #F0EFE4;
    --cream2:   #E8E7DA;
    --forest:   #2D5016;
    --forest2:  #3D6B20;
    --rust:     #8B3A2A;
    --rust2:    #A04535;
    --text:     #2A2A2A;
    --muted:    #6B6B5A;
    --border:   #D0CFC0;
    --card:     #FFFFFF;
    --tagline:  #477253;
  }

  [data-theme="dark"] {
    --cream:    #131710;
    --cream2:   #1a1f14;
    --forest:   #81a860;
    --forest2:  #94be6e;
    --rust:     #c87060;
    --rust2:    #d4806e;
    --text:     #dedad0;
    --muted:    #9a9888;
    --border:   rgba(129,168,96,0.18);
    --card:     #1c2414;
    --tagline:  #81a860;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text);
    min-height: 100vh;
    padding: 0 0 80px;
    transition: background 0.4s, color 0.4s;
  }

  /* ── PAGE HEADER ── */
  .ac-header {
    padding: 40px 40px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
    transition: background 0.3s, border-color 0.3s;
  }
  .ac-header-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .ac-header-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--rust);
    margin-bottom: 6px; transition: color 0.3s;
  }
  .ac-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 38px; font-weight: 600;
    color: var(--forest); line-height: 1.1;
    transition: color 0.3s;
  }
  .ac-header-sub {
    font-size: 14px; color: var(--muted); margin-top: 6px;
    transition: color 0.3s;
  }

  /* ── STATS ROW ── */
  .ac-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; padding: 28px 40px;
  }
  @media (max-width: 900px) { .ac-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .ac-stats { grid-template-columns: 1fr; } }

  .ac-stat {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 20px 22px;
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  }
  .ac-stat:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  [data-theme="dark"] .ac-stat:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .ac-stat-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px;
    transition: color 0.3s;
  }
  .ac-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 600; line-height: 1;
    transition: color 0.3s;
  }
  .ac-stat-value.forest { color: var(--forest); }
  .ac-stat-value.rust   { color: var(--rust); }
  .ac-stat-value.muted  { color: var(--muted); }
  .ac-stat-sub {
    font-size: 12px; color: var(--muted); margin-top: 6px;
    transition: color 0.3s;
  }

  /* ── TOOLBAR ── */
  .ac-toolbar {
    display: flex; align-items: center; gap: 12px;
    padding: 0 40px 20px; flex-wrap: wrap;
  }
  .ac-search-wrap {
    flex: 1; min-width: 200px; position: relative;
  }
  .ac-search-wrap svg {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--muted); pointer-events: none;
  }
  .ac-search-input {
    width: 100%; border: 1px solid var(--border);
    background: var(--card); border-radius: 8px;
    padding: 9px 12px 9px 36px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--text); outline: none;
    transition: border-color 0.2s, background 0.3s, color 0.3s;
  }
  .ac-search-input:focus { border-color: var(--forest); }
  .ac-search-input::placeholder { color: var(--muted); }

  .ac-filter-btn {
    display: flex; align-items: center; gap: 7px;
    border: 1px solid var(--border); background: var(--card);
    border-radius: 8px; padding: 9px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; color: var(--text); cursor: pointer;
    transition: all 0.2s;
  }
  .ac-filter-btn:hover { border-color: var(--forest); color: var(--forest); }
  .ac-filter-btn.active { border-color: var(--forest); background: var(--forest); color: white; }

  .ac-filter-tabs {
    display: flex; gap: 6px; padding: 0 40px 24px;
    flex-wrap: wrap;
  }
  .ac-tab {
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; color: var(--muted); cursor: pointer;
    transition: all 0.15s; display: flex; align-items: center; gap: 6px;
  }
  .ac-tab:hover { border-color: var(--forest); color: var(--forest); }
  .ac-tab.active { border-color: var(--forest); background: var(--forest); color: white; font-weight: 600; }
  .ac-tab-count {
    background: rgba(255,255,255,0.25); color: inherit;
    border-radius: 100px; padding: 1px 7px; font-size: 11px;
  }
  .ac-tab:not(.active) .ac-tab-count { background: var(--cream2); color: var(--muted); }

  /* ── MESSAGES LIST ── */
  .ac-list { padding: 0 40px; display: flex; flex-direction: column; gap: 10px; }

  .ac-msg-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden;
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
    cursor: pointer;
  }
  .ac-msg-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.09); transform: translateY(-1px); }
  [data-theme="dark"] .ac-msg-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.35); }
  .ac-msg-card.unread { border-left: 3px solid var(--rust); }
  .ac-msg-card.starred { border-left: 3px solid #D4A820; }

  .ac-msg-main {
    display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px;
  }
  .ac-msg-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest2) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;
    font-family: 'Cormorant Garamond', serif; font-style: italic;
  }
  .ac-msg-avatar.rust-bg {
    background: linear-gradient(135deg, var(--rust) 0%, var(--rust2) 100%);
  }
  .ac-msg-avatar.gold-bg {
    background: linear-gradient(135deg, #8B6914 0%, #C4971F 100%);
  }

  .ac-msg-body { flex: 1; min-width: 0; }
  .ac-msg-top {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 12px; margin-bottom: 4px;
  }
  .ac-msg-name {
    font-size: 15px; font-weight: 600; color: var(--text);
    transition: color 0.3s;
  }
  .ac-msg-card.unread .ac-msg-name { color: var(--rust); }
  .ac-msg-time {
    font-size: 11px; color: var(--muted); white-space: nowrap;
    transition: color 0.3s;
  }
  .ac-msg-contact-row {
    display: flex; flex-wrap: wrap; gap: 12px;
    margin-bottom: 8px;
  }
  .ac-msg-contact-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--muted); transition: color 0.3s;
  }
  .ac-msg-contact-item a { color: var(--forest); text-decoration: none; transition: color 0.2s; }
  .ac-msg-contact-item a:hover { color: var(--forest2); text-decoration: underline; }
  .ac-msg-preview {
    font-size: 13px; color: var(--muted); line-height: 1.55;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    transition: color 0.3s;
  }

  .ac-msg-actions {
    display: flex; align-items: center; gap: 8px;
    padding: 0 20px 14px; flex-wrap: wrap;
  }
  .ac-msg-badge {
    padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.04em;
  }
  .ac-msg-badge.unread     { background: rgba(139,58,42,0.1);  color: var(--rust); }
  .ac-msg-badge.read    { background: rgba(45,80,22,0.1);   color: var(--forest); }
  .ac-msg-badge.replied { background: rgba(71,114,83,0.12); color: var(--tagline); }
  .ac-msg-badge.starred { background: rgba(212,168,32,0.12); color: #9a7a10; }
  [data-theme="dark"] .ac-msg-badge.starred { color: #D4A820; }

  .ac-action-btn {
    display: flex; align-items: center; gap: 5px;
    border: 1px solid var(--border); background: transparent;
    border-radius: 6px; padding: 5px 10px;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    color: var(--muted); cursor: pointer; transition: all 0.15s;
  }
  .ac-action-btn:hover { border-color: var(--forest); color: var(--forest); }
  .ac-action-btn.danger:hover { border-color: var(--rust); color: var(--rust); }

  /* ── EXPANDED MESSAGE ── */
  .ac-msg-expanded {
    border-top: 1px solid var(--border);
    padding: 20px 20px 20px 78px;
    background: var(--cream);
    transition: background 0.3s, border-color 0.3s;
  }
  [data-theme="dark"] .ac-msg-expanded { background: rgba(26,31,20,0.5); }
  .ac-msg-full-text {
    font-size: 14px; color: var(--text); line-height: 1.75;
    margin-bottom: 20px; white-space: pre-wrap;
    transition: color 0.3s;
  }

  .ac-reply-box { display: flex; flex-direction: column; gap: 10px; }
  .ac-reply-label {
    font-size: 12px; font-weight: 600; color: var(--forest);
    text-transform: uppercase; letter-spacing: 0.06em;
    transition: color 0.3s;
  }
  .ac-reply-textarea {
    width: 100%; border: 1px solid var(--border);
    background: var(--card); border-radius: 8px;
    padding: 12px 14px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text); resize: none; outline: none;
    transition: border-color 0.2s, background 0.3s, color 0.3s;
    min-height: 90px;
  }
  .ac-reply-textarea:focus { border-color: var(--forest); }
  .ac-reply-textarea::placeholder { color: var(--muted); }
  .ac-reply-row { display: flex; gap: 8px; justify-content: flex-end; }
  .ac-reply-btn {
    display: flex; align-items: center; gap: 7px;
    border: none; border-radius: 8px; padding: 9px 18px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .ac-reply-btn.primary {
    background: var(--forest); color: white;
  }
  .ac-reply-btn.primary:hover { background: var(--forest2); }
  .ac-reply-btn.secondary {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .ac-reply-btn.secondary:hover { border-color: var(--rust); color: var(--rust); }
  .ac-reply-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── EMPTY STATE ── */
  .ac-empty {
    text-align: center; padding: 80px 40px;
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .ac-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--cream2); display: flex; align-items: center;
    justify-content: center; color: var(--muted);
    transition: background 0.3s;
  }
  .ac-empty-title { font-size: 18px; font-weight: 600; color: var(--text); transition: color 0.3s; }
  .ac-empty-sub { font-size: 14px; color: var(--muted); transition: color 0.3s; }

  /* ── LOADING ── */
  .ac-loading {
    display: flex; justify-content: center; align-items: center;
    min-height: 400px;
  }
  .ac-spinner {
    width: 40px; height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--forest);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── SECTION DIVIDER (match Home.jsx style) ── */
  .section-divider {
    display: flex; align-items: center; gap: 16px;
    padding: 32px 40px 20px;
  }
  .divider-line { flex: 1; height: 1px; background: var(--rust); opacity: 0.4; transition: background 0.3s; }
  .divider-title {
    font-family: 'MonteCarlo', serif;
    font-style: italic; font-size: 36px; color: var(--rust);
    white-space: nowrap; transition: color 0.3s;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 700px) {
    .ac-header { padding: 28px 20px 24px; }
    .ac-stats { padding: 20px; }
    .ac-toolbar { padding: 0 20px 16px; }
    .ac-filter-tabs { padding: 0 20px 16px; }
    .ac-list { padding: 0 20px; }
    .ac-msg-expanded { padding: 16px; }
  }
`;

function timeAgo(dateStr) {
  if (!dateStr) return 'recent';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

const AVATAR_COLORS = ['', 'rust-bg', 'gold-bg', '', 'rust-bg'];

/* ─── Main Component ─────────────────────────────────── */
export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [sentIds, setSentIds] = useState([]);
  const [error, setError] = useState(null);

  // Fetch messages from Firebase
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const contactsRef = collection(db, 'contacts');
      const q = query(contactsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          name: data.name || 'Anonymous',
          email: data.email || '',
          phone: data.phone || '',
          message: data.message || '',
          date: data.date || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          status: data.status || 'unread',
          starred: data.starred || false,
        });
      });
      
      setMessages(fetchedMessages);
      console.log(`✅ Loaded ${fetchedMessages.length} messages from Firebase`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, { status: 'read' });
      setMessages(ms => ms.map(m =>
        m.id === id && m.status === 'unread' ? { ...m, status: 'read' } : m
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const toggleStar = async (id) => {
    try {
      const message = messages.find(m => m.id === id);
      const newStarred = !message.starred;
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, { starred: newStarred });
      setMessages(ms => ms.map(m =>
        m.id === id ? { ...m, starred: newStarred } : m
      ));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const messageRef = doc(db, 'contacts', id);
      await deleteDoc(messageRef);
      setMessages(ms => ms.filter(m => m.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const handleExpand = (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    const message = messages.find(m => m.id === id);
    if (message && message.status === 'unread') {
      markRead(id);
    }
  };

  const handleReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    
    try {
      // Update status to replied
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, { status: 'replied' });
      
      setMessages(ms => ms.map(m => 
        m.id === id ? { ...m, status: 'replied' } : m
      ));
      
      setSentIds(s => [...s, id]);
      setTimeout(() => setSentIds(s => s.filter(x => x !== id)), 2500);
      setReplyText(r => ({ ...r, [id]: '' }));
      
      // Here you could also send an actual email using an email service
      console.log(`Reply sent to ${messages.find(m => m.id === id)?.email}: ${replyText[id]}`);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q) ||
      (m.phone && m.phone.toLowerCase().includes(q));
    
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'unread' && m.status === 'unread') ||
      (activeTab === 'read' && m.status === 'read') ||
      (activeTab === 'replied' && m.status === 'replied') ||
      (activeTab === 'starred' && m.starred);
    
    return matchSearch && matchTab;
  });

  const counts = {
    all: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    starred: messages.filter(m => m.starred).length,
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' },
    { id: 'replied', label: 'Replied' },
    { id: 'starred', label: 'Starred' },
  ];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ac-root">
          <div className="ac-loading">
            <div className="ac-spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ac-root">

        {/* ── Header ─────────────────── */}
        <div className="ac-header">
          <div className="ac-header-top">
            <div>
              <div className="ac-header-eyebrow">Admin Panel</div>
              <div className="ac-header-title">Contact Messages</div>
              <div className="ac-header-sub">Manage guest inquiries and messages from your contact form.</div>
            </div>
            <button 
              className="ac-filter-btn"
              onClick={fetchMessages}
              title="Refresh messages"
            >
              <RefreshCw size={14}/>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stats ──────────────────── */}
        <div className="ac-stats">
          <div className="ac-stat">
            <div className="ac-stat-label">Total Messages</div>
            <div className="ac-stat-value forest">{messages.length}</div>
            <div className="ac-stat-sub">All time inquiries</div>
          </div>
          <div className="ac-stat">
            <div className="ac-stat-label">Unread</div>
            <div className="ac-stat-value rust">{counts.unread}</div>
            <div className="ac-stat-sub">Needs your attention</div>
          </div>
          <div className="ac-stat">
            <div className="ac-stat-label">Replied</div>
            <div className="ac-stat-value forest">{counts.replied}</div>
            <div className="ac-stat-sub">Conversations handled</div>
          </div>
          <div className="ac-stat">
            <div className="ac-stat-label">Starred</div>
            <div className="ac-stat-value muted">{counts.starred}</div>
            <div className="ac-stat-sub">Flagged for follow-up</div>
          </div>
        </div>

        {/* ── Toolbar ────────────────── */}
        <div className="ac-toolbar">
          <div className="ac-search-wrap">
            <Search size={14}/>
            <input
              className="ac-search-input"
              placeholder="Search by name, email, message…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button className="ac-filter-btn" onClick={() => setSearch('')}>
              <X size={13}/> Clear
            </button>
          )}
        </div>

        {/* ── Filter Tabs ────────────── */}
        <div className="ac-filter-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`ac-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="ac-tab-count">{counts[tab.id]}</span>
            </button>
          ))}
        </div>

        {/* ── Message List ───────────── */}
        <div className="ac-list">
          {error ? (
            <div className="ac-empty">
              <div className="ac-empty-icon"><AlertCircle size={26}/></div>
              <div className="ac-empty-title">Error loading messages</div>
              <div className="ac-empty-sub">{error}</div>
              <button className="ac-filter-btn" onClick={fetchMessages}>
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-icon"><MessageSquare size={26}/></div>
              <div className="ac-empty-title">No messages found</div>
              <div className="ac-empty-sub">
                {search ? 'Try a different search term.' : 'No messages in this category yet.'}
              </div>
            </div>
          ) : filtered.map((msg, idx) => (
            <div
              key={msg.id}
              className={`ac-msg-card${msg.status === 'unread' ? ' unread' : ''}${msg.starred && msg.status !== 'unread' ? ' starred' : ''}`}
            >
              {/* ── Card Top ── */}
              <div className="ac-msg-main" onClick={() => handleExpand(msg.id)}>
                <div className={`ac-msg-avatar ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                  {initials(msg.name)}
                </div>
                <div className="ac-msg-body">
                  <div className="ac-msg-top">
                    <span className="ac-msg-name">{msg.name}</span>
                    <span className="ac-msg-time">{timeAgo(msg.date)}</span>
                  </div>
                  <div className="ac-msg-contact-row">
                    <span className="ac-msg-contact-item">
                      <Mail size={11}/>
                      <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()}>{msg.email}</a>
                    </span>
                    {msg.phone && (
                      <span className="ac-msg-contact-item">
                        <Phone size={11}/>
                        <span>{msg.phone}</span>
                      </span>
                    )}
                  </div>
                  <div className="ac-msg-preview">{msg.message}</div>
                </div>
              </div>

              {/* ── Card Footer ── */}
              <div className="ac-msg-actions">
                <span className={`ac-msg-badge ${msg.status}`}>
                  {msg.status === 'unread' ? 'New' : msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                </span>
                {msg.starred && (
                  <span className="ac-msg-badge starred">★ Starred</span>
                )}
                <button
                  className="ac-action-btn"
                  title={msg.starred ? 'Unstar' : 'Star'}
                  onClick={e => { e.stopPropagation(); toggleStar(msg.id); }}
                >
                  <Star size={12} fill={msg.starred ? 'currentColor' : 'none'}/>
                  {msg.starred ? 'Starred' : 'Star'}
                </button>
                <button
                  className="ac-action-btn"
                  onClick={e => { e.stopPropagation(); handleExpand(msg.id); }}
                >
                  <MailOpen size={12}/>
                  {expanded === msg.id ? 'Collapse' : 'Reply'}
                </button>
                <button
                  className="ac-action-btn danger"
                  onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }}
                >
                  <Trash2 size={12}/> Delete
                </button>
              </div>

              {/* ── Expanded Reply Panel ── */}
              {expanded === msg.id && (
                <div className="ac-msg-expanded">
                  <div className="ac-msg-full-text">{msg.message}</div>
                  <div className="ac-reply-box">
                    <div className="ac-reply-label">Reply to {msg.name}</div>
                    <textarea
                      className="ac-reply-textarea"
                      placeholder={`Write your reply to ${msg.name}…`}
                      value={replyText[msg.id] || ''}
                      onChange={e => setReplyText(r => ({ ...r, [msg.id]: e.target.value }))}
                    />
                    <div className="ac-reply-row">
                      <button
                        className="ac-reply-btn secondary"
                        onClick={() => setReplyText(r => ({ ...r, [msg.id]: '' }))}
                      >
                        Clear
                      </button>
                      <button
                        className="ac-reply-btn primary"
                        onClick={() => handleReply(msg.id)}
                        disabled={!replyText[msg.id]?.trim()}
                      >
                        {sentIds.includes(msg.id)
                          ? <><CheckCheck size={14}/> Sent!</>
                          : <><Send size={14}/> Send Reply</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}