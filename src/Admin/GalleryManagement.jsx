// Admin/GalleryManagement.jsx
import React, { useState, useRef, useEffect } from 'react';
import { AdminLayout } from './AdminNavbar';
import {
  Plus, Search, Pencil, Trash2, Images, Star, Tag,
  LayoutGrid, List, X, ZoomIn, CheckCircle2, ChevronDown,
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
  serverTimestamp 
} from 'firebase/firestore';

/* ─── Cloudinary Configuration ───────────────────────────────────────────── */
const CLOUDINARY_CLOUD_NAME = 'drrs8lvbl';
const CLOUDINARY_UPLOAD_PRESET = 'Solaz_rooms';

/* ─── Constants ───────────────────────────────────────────────────────────────── */
const CATEGORIES = ['rooms', 'amenities', 'exterior', 'dining', 'events', 'other'];

const BLANK = { 
  title: '', 
  caption: '', 
  category: 'rooms', 
  featured: false, 
  order: '', 
  url: '',
  imageFile: null // For handling file uploads
};

/* ─── Category pill colors ───────────────────────────────────────────────── */
const CAT_STYLE = {
  rooms:      { bg: '#EBF4E8', color: '#2D5016' },
  amenities:  { bg: '#FEF9EC', color: '#8A6A0A' },
  exterior:   { bg: '#EAF0FB', color: '#3a5080' },
  dining:     { bg: '#FDF0E6', color: '#7a4a1a' },
  events:     { bg: '#FAEDEA', color: '#8B3A2A' },
  other:      { bg: '#F0EDE4', color: '#7A6A4E' },
};

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
  bg-[#F7F4EC] border border-[#E4E0D4] text-[#231C0F]
  focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 focus:bg-white
  placeholder:text-[#C8C2B0]
`.replace(/\s+/g, ' ').trim();

const labelCls = 'block text-[0.68rem] font-semibold uppercase tracking-widest text-[#7A6A4E] mb-1.5';

/* ─── Cloudinary Upload Function ─────────────────────────────────────────── */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/* ─── Component ──────────────────────────────────────────────────────────── */
function GalleryContent() {
  const [items,         setItems]        = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [search,        setSearch]       = useState('');
  const [filterCat,     setFilterCat]    = useState('all');
  const [viewMode,      setViewMode]     = useState('grid');
  const [modal,         setModal]        = useState(null);
  const [form,          setForm]         = useState(BLANK);
  const [editId,        setEditId]       = useState(null);
  const [deleteTarget,  setDeleteTarget] = useState(null);
  const [lightbox,      setLightbox]     = useState(null);
  const [toast,         setToast]        = useState(null);
  const [uploading,     setUploading]    = useState(false);
  const fileRef = useRef();

  // Reference to the gallery collection
  const galleryCollection = collection(db, 'gallery');

  // Load gallery items from Firebase on component mount
  useEffect(() => {
    const q = query(galleryCollection, orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const galleryData = [];
      snapshot.forEach((doc) => {
        galleryData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setItems(galleryData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading gallery:", error);
      showToast('Failed to load gallery', 'error');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    return (
      (it.title?.toLowerCase().includes(q) || it.caption?.toLowerCase().includes(q)) &&
      (filterCat === 'all' || it.category === filterCat)
    );
  });

  const stats = {
    total:    items.length,
    featured: items.filter(i => i.featured).length,
    cats:     [...new Set(items.map(i => i.category))].length,
  };

  const openAdd    = () => { setForm(BLANK); setEditId(null); setModal('add'); };
  const openEdit   = item => { 
    const { id, ...itemData } = item;
    setForm(itemData); 
    setEditId(id); 
    setModal('edit'); 
  };
  const openDelete = item => { setDeleteTarget(item); setModal('delete'); };
  const closeModal = () => { setModal(null); setDeleteTarget(null); setForm(BLANK); };

  const handleField = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const toggleFeatured = () => setForm(f => ({ ...f, featured: !f.featured }));

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Store file for upload
    setForm(f => ({ ...f, imageFile: file }));
    
    // Show preview
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, url: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = form.url;
      
      // If there's a new image file to upload to Cloudinary
      if (form.imageFile) {
        try {
          // Upload to Cloudinary
          imageUrl = await uploadToCloudinary(form.imageFile);
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          showToast('Failed to upload image to Cloudinary', 'error');
          setUploading(false);
          return;
        }
      } else if (!imageUrl) {
        showToast('Please provide an image', 'error');
        setUploading(false);
        return;
      }

      const galleryData = {
        title: form.title,
        caption: form.caption || '',
        category: form.category,
        featured: form.featured || false,
        order: Number(form.order) || items.length + 1,
        url: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (modal === 'add') {
        // Add new gallery item to Firebase
        galleryData.createdAt = serverTimestamp();
        await addDoc(galleryCollection, galleryData);
        showToast('Photo added to gallery');
      } else {
        // Update existing gallery item in Firebase
        const itemRef = doc(db, 'gallery', editId);
        await updateDoc(itemRef, galleryData);
        showToast('Photo updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      showToast('Failed to save photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete document from Firestore
      const itemRef = doc(db, 'gallery', deleteTarget.id);
      await deleteDoc(itemRef);
      showToast('Photo removed successfully', 'error');
      closeModal();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      showToast('Failed to delete photo', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 lg:p-10 flex items-center justify-center" style={{ backgroundColor: '#F4F2EA' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016] mb-4"></div>
          <p style={{ color: '#7A6A4E' }}>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-10" style={{ backgroundColor: '#F4F2EA', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#7A9E5C', letterSpacing: '0.18em' }}>Admin Panel</p>
          <h1 className="text-3xl font-bold leading-tight" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>Gallery Management</h1>
          <p className="text-sm mt-1 font-light" style={{ color: '#A89878' }}>Manage photos displayed on the public gallery.</p>
        </div>
        <button
          onClick={openAdd}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ 
            background: '#2D5016', 
            boxShadow: '0 2px 10px rgba(45,80,22,0.25)', 
            border: 'none', 
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.5 : 1,
            fontFamily: "'DM Sans', sans-serif" 
          }}
          onMouseEnter={e => { if (!uploading) { e.currentTarget.style.background = '#1E3A0F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
          onMouseLeave={e => { if (!uploading) { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'none'; }}}
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { icon: Images,       iconBg: '#EBF4E8', iconColor: '#2D5016', num: stats.total,    label: 'Total Photos' },
          { icon: Star,         iconBg: '#FEF9EC', iconColor: '#8A6A0A', num: stats.featured, label: 'Featured'     },
          { icon: Tag,          iconBg: '#FAEDEA', iconColor: '#8B3A2A', num: stats.cats,     label: 'Categories'   },
        ].map(({ icon: Icon, iconBg, iconColor, num, label }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{num}</div>
              <div className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: '#A89878' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#A89878' }} />
          <input className={inputCls + ' pl-10'} placeholder="Search photos…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select
            className={inputCls + ' pr-9 appearance-none cursor-pointer min-w-[160px]'}
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A89878' }} />
        </div>
        {/* View toggle */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4' }}>
          {[{ mode: 'grid', Icon: LayoutGrid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                background: viewMode === mode ? '#2D5016' : 'transparent',
                color: viewMode === mode ? '#fff' : '#A89878',
                border: 'none', cursor: 'pointer',
              }}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        filtered.length === 0
          ? <EmptyState />
          : <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {filtered.map((item, i) => {
                const cat = CAT_STYLE[item.category] || CAT_STYLE.other;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden transition-all duration-200 group"
                    style={{
                      background: '#FDFCF7',
                      border: '1.5px solid #E4E0D4',
                      boxShadow: '0 1px 4px rgba(30,58,15,0.06)',
                      animationDelay: `${i * 0.04}s`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,15,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(30,58,15,0.06)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: 160, background: '#EDE8D8' }}>
                      {item.url
                        ? <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        : <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ color: '#A89878' }}>
                            <Images size={28} style={{ opacity: 0.3 }} />
                            <span className="text-xs">No image</span>
                          </div>
                      }
                      {/* Category tag */}
                      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(30,58,15,0.7)', color: '#fff', backdropFilter: 'blur(4px)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      {/* Featured badge */}
                      {item.featured && (
                        <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#C9A84C', color: '#fff', fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          ★ Featured
                        </span>
                      )}
                      {/* Hover actions */}
                      <div className="absolute inset-0 flex items-end justify-end gap-1.5 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'linear-gradient(to top, rgba(20,35,10,0.5) 0%, transparent 55%)' }}>
                        {item.url && (
                          <button onClick={() => setLightbox(item)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150" style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', color: '#1E3A0F' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <ZoomIn size={13} />
                          </button>
                        )}
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', color: '#1E3A0F' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => openDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', color: '#8B3A2A' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{item.title}</p>
                      <p className="text-xs mt-0.5 truncate font-light" style={{ color: '#A89878' }}>{item.caption || <em>No caption</em>}</p>
                    </div>
                    <div className="flex items-center justify-between px-4 pb-3">
                      <span className="text-xs" style={{ color: '#B0A992' }}>Order #{item.order}</span>
                      {item.featured && <span className="text-xs font-semibold" style={{ color: '#C9A84C' }}>★ Featured</span>}
                    </div>
                  </div>
                );
              })}
            </div>
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4', boxShadow: '0 4px 20px rgba(30,58,15,0.07)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#EDE8D8', borderBottom: '1px solid #DDD5BB' }}>
                  {['Photo', 'Title', 'Category', 'Order', 'Featured', 'Actions'].map((h, i) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                      style={{ color: '#7A6A4E', letterSpacing: '0.1em', textAlign: i === 5 ? 'right' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={6} className="py-16 text-center"><EmptyState inline /></td></tr>
                  : filtered.map((item, i) => {
                      const cat = CAT_STYLE[item.category] || CAT_STYLE.other;
                      return (
                        <tr key={item.id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #EEEBE0' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F7F5EE'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td className="px-5 py-3">
                            {item.url
                              ? <img src={item.url} alt={item.title} onClick={() => setLightbox(item)}
                                  className="rounded-lg object-cover cursor-pointer transition-transform duration-150 hover:scale-105"
                                  style={{ width: 56, height: 42, border: '1.5px solid #E4E0D4' }} />
                              : <div className="rounded-lg flex items-center justify-center" style={{ width: 56, height: 42, background: '#EDE8D8', border: '1.5px solid #E4E0D4' }}>
                                  <Images size={18} style={{ color: '#A89878', opacity: 0.4 }} />
                                </div>
                            }
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm font-semibold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>{item.title}</p>
                            <p className="text-xs font-light mt-0.5" style={{ color: '#A89878' }}>{item.caption || '—'}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                              style={{ background: cat.bg, color: cat.color }}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm font-mono" style={{ color: '#A89878' }}>#{item.order}</td>
                          <td className="px-5 py-3">
                            {item.featured
                              ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#FEF9EC', color: '#8A6A0A' }}>⭐ Featured</span>
                              : <span style={{ color: '#DDD5BB', fontSize: '0.8rem' }}>—</span>
                            }
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                style={{ border: '1.5px solid #E4E0D4', background: 'transparent', color: '#7A6A4E', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EBF4E8'; e.currentTarget.style.borderColor = '#7A9E5C'; e.currentTarget.style.color = '#2D5016'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E0D4'; e.currentTarget.style.color = '#7A6A4E'; }}>
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => openDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                style={{ border: '1.5px solid #E4E0D4', background: 'transparent', color: '#7A6A4E', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#FAEDEA'; e.currentTarget.style.borderColor = '#8B3A2A'; e.currentTarget.style.color = '#8B3A2A'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E0D4'; e.currentTarget.style.color = '#7A6A4E'; }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>

            {/* Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5" style={{ borderBottom: '1px solid #EEEBE0' }}>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>
                  {modal === 'add' ? 'Add Photo' : 'Edit Photo'}
                </h2>
                <p className="text-xs mt-1 font-light" style={{ color: '#A89878' }}>
                  {modal === 'add' ? 'Upload an image and fill in the details.' : `Editing: ${form.title}`}
                </p>
              </div>
              <button onClick={closeModal} disabled={uploading} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors duration-150"
                style={{ background: '#F0EBD8', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', color: '#7A6A4E' }}
                onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = '#DDD5BB'; }}
                onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = '#F0EBD8'; }}>
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-5 flex flex-col gap-4">
              {/* Image upload */}
              <div>
                <label className={labelCls}>Image</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                {form.url
                  ? <div className="relative rounded-xl overflow-hidden cursor-pointer group" style={{ height: 180 }} onClick={() => !uploading && fileRef.current.click()}>
                      <img src={form.url} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium"
                        style={{ background: 'rgba(20,35,10,0.45)' }}>
                        <Images size={20} /> Change Image
                      </div>
                    </div>
                  : <div className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all duration-200 text-center"
                      style={{ height: 140, border: '2px dashed #DDD5BB', background: '#F7F4EC' }}
                      onClick={() => !uploading && fileRef.current.click()}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D5016'; e.currentTarget.style.background = '#F0EDE4'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD5BB'; e.currentTarget.style.background = '#F7F4EC'; }}>
                      <Images size={24} style={{ color: '#B0A992' }} />
                      <span className="text-sm" style={{ color: '#A89878' }}>Click to upload image</span>
                      <span className="text-xs" style={{ color: '#C8C2B0' }}>JPG, PNG, WebP — will be uploaded to Cloudinary</span>
                    </div>
                }
              </div>

              {/* URL fallback */}
              <div>
                <label className={labelCls}>Image URL <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(or paste Cloudinary URL)</span></label>
                <input className={inputCls} name="url" value={form.url} onChange={handleField} placeholder="https://res.cloudinary.com/..." disabled={uploading} />
              </div>

              {/* Title */}
              <div>
                <label className={labelCls}>Title *</label>
                <input className={inputCls} name="title" value={form.title} onChange={handleField} placeholder="e.g. Garden View Room" disabled={uploading} />
              </div>

              {/* Caption */}
              <div>
                <label className={labelCls}>Caption</label>
                <textarea className={inputCls + ' resize-y min-h-[72px]'} name="caption" value={form.caption} onChange={handleField} placeholder="Short description shown in gallery…" disabled={uploading} />
              </div>

              {/* Category + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <div className="relative">
                    <select className={inputCls + ' pr-8 appearance-none cursor-pointer'} name="category" value={form.category} onChange={handleField} disabled={uploading}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A89878' }} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input className={inputCls + ' text-center'} type="number" min="1" name="order" value={form.order} onChange={handleField} placeholder="1" disabled={uploading} />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F7F4EC', border: '1.5px solid #E4E0D4' }}>
                <div>
                  <p className="text-sm" style={{ color: '#3D3222' }}>Featured Photo</p>
                  <p className="text-xs font-light mt-0.5" style={{ color: '#A89878' }}>Highlighted on the public homepage</p>
                </div>
                <button
                  type="button"
                  onClick={toggleFeatured}
                  disabled={uploading}
                  className="relative flex-shrink-0 rounded-full transition-all duration-300"
                  style={{ width: 40, height: 22, background: form.featured ? '#2D5016' : '#DDD5BB', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                  <span className="absolute top-[3px] rounded-full bg-white transition-all duration-300"
                    style={{ width: 16, height: 16, left: form.featured ? 21 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-4" style={{ borderTop: '1px solid #EEEBE0' }}>
              <button onClick={closeModal} disabled={uploading} className="px-5 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = '#A89878'; e.currentTarget.style.color = '#231C0F'; }}}
                onMouseLeave={e => { if (!uploading) { e.currentTarget.style.borderColor = '#DDD5BB'; e.currentTarget.style.color = '#7A6A4E'; }}}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!form.title.trim() || uploading}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: (form.title.trim() && !uploading) ? '#2D5016' : '#A89878',
                  cursor: (form.title.trim() && !uploading) ? 'pointer' : 'not-allowed',
                  border: 'none', fontFamily: "'DM Sans', sans-serif",
                  boxShadow: (form.title.trim() && !uploading) ? '0 2px 8px rgba(45,80,22,0.22)' : 'none',
                }}
                onMouseEnter={e => { if (form.title.trim() && !uploading) { e.currentTarget.style.background = '#1E3A0F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = (form.title.trim() && !uploading) ? '#2D5016' : '#A89878'; e.currentTarget.style.transform = 'none'; }}>
                {uploading ? 'Uploading to Cloudinary...' : (modal === 'add' ? 'Add Photo' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {modal === 'delete' && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-sm rounded-2xl text-center" style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div className="px-8 pt-8 pb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FAEDEA' }}>
                <Trash2 size={22} style={{ color: '#8B3A2A' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>Remove Photo?</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A89878' }}>
                You're about to remove <strong style={{ color: '#3D3222' }}>{deleteTarget.title}</strong> from the gallery. This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 px-8 pb-7">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-sm transition-colors duration-150"
                style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#A89878'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDD5BB'}>
                Keep Photo
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-150"
                style={{ background: '#8B3A2A', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = '#6e2e1e'}
                onMouseLeave={e => e.currentTarget.style.background = '#8B3A2A'}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 cursor-zoom-out"
          style={{ background: 'rgba(10,18,6,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <X size={18} />
          </button>
          <img src={lightbox.url} alt={lightbox.title} onClick={e => e.stopPropagation()}
            className="rounded-2xl object-contain" style={{ maxWidth: '90vw', maxHeight: '85vh', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }} />
          {(lightbox.title || lightbox.caption) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm whitespace-nowrap px-5 py-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)' }}>
              {lightbox.title}{lightbox.caption ? ` — ${lightbox.caption}` : ''}
            </div>
          )}
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-white"
          style={{
            background: toast.type === 'error' ? '#8B3A2A' : '#1E3A0F',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            fontFamily: "'DM Sans', sans-serif",
            animation: 'slideUp 0.3s cubic-bezier(.34,1.4,.64,1)',
          }}>
          {toast.type === 'error' ? <Trash2 size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px) scale(.96); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ inline }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${inline ? 'py-8' : 'py-20'}`}>
      <Images size={32} style={{ color: '#A89878', opacity: 0.3 }} />
      <p className="text-sm" style={{ color: '#A89878' }}>No photos found.</p>
    </div>
  );
}

export default function GalleryManagement() {
  return (
    <AdminLayout>
      <GalleryContent />
    </AdminLayout>
  );
}