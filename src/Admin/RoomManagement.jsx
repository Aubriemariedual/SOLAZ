// Admin/RoomManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from './AdminNavbar';
import {
  Plus, Search, Pencil, Trash2, BedDouble,
  CheckCircle2, X, ChevronDown,
  MapPin, Users, Layers, Upload, Image, ChevronLeft, ChevronRight
} from 'lucide-react';
import { db } from '../../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';

/* ─── Cloudinary Configuration ──────────────────────────────────────────── */
const CLOUDINARY_CLOUD_NAME = 'drrs8lvbl';
const CLOUDINARY_UPLOAD_PRESET = 'Solaz_rooms';

// Cloudinary upload function for multiple images
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }
  
  // Validate file size (5MB max)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('Image size must be less than 5MB');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'rooms');
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/* ─── Constants ──────────────────────────────────────────────────────────── */
const AMENITY_LIST = ['WiFi', 'AC', 'TV', 'Ref', 'Hotwater', 'Balcony', 'Bathtub', 'Minibar', 'Safe'];
const AMENITY_ICONS = { WiFi:'📶', AC:'❄️', TV:'📺', Ref:'🧊', Hotwater:'🚿', Balcony:'🌿', Bathtub:'🛁', Minibar:'🍾', Safe:'🔐' };
const BLANK_FORM = { 
  name: '', 
  type: 'Standard', 
  capacity: 2, 
  ratePerDay: '', 
  status: 'available', 
  floor: '', 
  description: '', 
  amenities: [], 
  images: [], // Array of image objects { url, publicId, order }
  newImages: [] // Temporary array for new images to upload
};

const ROOM_TYPES = ['All Rooms', 'Suites', 'Villas', 'Bungalows', 'Maintenance'];

const STATUS_CONFIG = {
  available:   { label: 'Available',   bg: '#22c55e',  text: '#fff' },
  occupied:    { label: 'Occupied',    bg: '#f97316',  text: '#fff' },
  maintenance: { label: 'Maintenance', bg: '#94a3b8',  text: '#fff' },
};

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputCls = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 bg-[#F7F4EC] border border-[#E4E0D4] text-[#231C0F] focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 focus:bg-white placeholder:text-[#C8C2B0]`;
const labelCls = 'block text-[0.68rem] font-semibold uppercase tracking-widest text-[#7A6A4E] mb-1.5';

/* ─── Placeholder room images by type ───────────────────────────────────── */
const TYPE_IMAGES = {
  Standard:  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  Superior:  'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=600&q=80',
  Deluxe:    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  Suite:     'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
};

/* ─── Room Card with Multiple Image Preview ─────────────────────────────── */
function RoomCard({ room, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const s = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;
  
  const images = room.images && room.images.length > 0 
    ? room.images.sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];
  
  const mainImage = images.length > 0 
    ? images[currentImageIndex]?.url 
    : (room.imageUrl || TYPE_IMAGES[room.type] || TYPE_IMAGES.Standard);

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: '#fff',
        border: '1.5px solid #E4E0D4',
        boxShadow: hovered ? '0 12px 32px rgba(30,58,15,0.13)' : '0 2px 8px rgba(30,58,15,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={mainImage}
          alt={`${room.name} - view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          onError={e => { e.target.src = TYPE_IMAGES.Standard; }}
        />
        
        {/* Image navigation buttons - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <ChevronLeft size={14} style={{ color: 'white' }} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <ChevronRight size={14} style={{ color: 'white' }} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: idx === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    width: idx === currentImageIndex ? '6px' : '4px',
                    height: idx === currentImageIndex ? '6px' : '4px',
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        <span
          className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10"
          style={{ background: s.bg, color: s.text, letterSpacing: '0.08em', fontSize: '0.6rem' }}
        >
          {s.label}
        </span>
        
        {images.length > 1 && (
          <span
            className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full z-10"
            style={{ background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)', fontSize: '0.6rem' }}
          >
            {currentImageIndex + 1}/{images.length}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold leading-tight flex-1" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>
            {room.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-lg font-bold" style={{ color: '#2D5016' }}>
              ₱{Number(room.ratePerDay).toLocaleString()}
            </span>
            <div className="text-xs font-light" style={{ color: '#A89878' }}>per night</div>
          </div>
        </div>

        {(room.floor || room.type) && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={11} style={{ color: '#A89878', flexShrink: 0 }} />
            <span className="text-xs" style={{ color: '#A89878' }}>
              {[room.type, room.floor ? `Floor ${room.floor}` : null].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #EEEBE0' }}>
          <div className="flex items-center gap-1">
            <Users size={12} style={{ color: '#A89878' }} />
            <span className="text-xs" style={{ color: '#7A6A4E' }}>{room.capacity} pax</span>
          </div>
          {room.amenities?.length > 0 && (
            <div className="flex items-center gap-1">
              <Layers size={12} style={{ color: '#A89878' }} />
              <span className="text-xs" style={{ color: '#7A6A4E' }}>
                {room.amenities.slice(0, 2).map(a => AMENITY_ICONS[a] || a).join(' ')}
                {room.amenities.length > 2 && <span style={{ color: '#B0A992' }}> +{room.amenities.length - 2}</span>}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{ border: '1.5px solid #E4E0D4', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EBF4E8'; e.currentTarget.style.borderColor = '#7A9E5C'; e.currentTarget.style.color = '#2D5016'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E0D4'; e.currentTarget.style.color = '#7A6A4E'; }}
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(room)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 flex-shrink-0"
            style={{ border: '1.5px solid #E4E0D4', background: 'transparent', color: '#A89878', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FAEDEA'; e.currentTarget.style.borderColor = '#8B3A2A'; e.currentTarget.style.color = '#8B3A2A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E0D4'; e.currentTarget.style.color = '#A89878'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add New Room Card ──────────────────────────────────────────────────── */
function AddRoomCard({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
      style={{
        minHeight: 280,
        border: `2px dashed ${hovered ? '#2D5016' : '#D0CBB8'}`,
        background: hovered ? 'rgba(45,80,22,0.04)' : 'transparent',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: hovered ? '#EBF4E8' : '#F0EDE4' }}
      >
        <Plus size={22} style={{ color: hovered ? '#2D5016' : '#A89878' }} />
      </div>
      <span className="text-sm font-semibold" style={{ color: hovered ? '#2D5016' : '#A89878' }}>Add New Rooms</span>
    </button>
  );
}

/* ─── Multiple Image Upload Component ───────────────────────────────────── */
function MultipleImageUpload({ images, onImagesChange, disabled = false }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Create temporary preview URLs for new images
      const newImagePreviews = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        order: images.length + 1
      }));
      
      // Update the form with new images to be uploaded
      onImagesChange([...images, ...newImagePreviews]);
      
      showToast('Images ready to upload. Click Save to upload to Cloudinary.', 'info');
    } catch (error) {
      console.error('Error preparing images:', error);
      showToast('Failed to prepare images', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const removedImage = updatedImages[index];
    
    // Revoke preview URL if it's a temporary preview
    if (removedImage.preview && removedImage.isNew) {
      URL.revokeObjectURL(removedImage.preview);
    }
    
    updatedImages.splice(index, 1);
    // Reorder remaining images
    updatedImages.forEach((img, idx) => {
      img.order = idx + 1;
    });
    
    onImagesChange(updatedImages);
  };

  const showToast = (msg, type) => {
    // Simple alert for now - you can replace with your toast system
    console.log(`${type}: ${msg}`);
  };

  return (
    <div className="col-span-2">
      <label className={labelCls}>Room Photos (4-5 recommended)</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img
                src={image.preview || image.url}
                alt={`Room view ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  style={{ background: 'rgba(139,58,42,0.9)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#6e2e1e'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,58,42,0.9)'}
                >
                  <X size={12} style={{ color: 'white' }} />
                </button>
              )}
              {image.isNew && !image.url && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-semibold" 
                     style={{ background: 'rgba(45,80,22,0.9)', color: 'white' }}>
                  New
                </div>
              )}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-semibold"
                   style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                {index + 1}
              </div>
            </div>
          </div>
        ))}
        
        {!disabled && images.length < 8 && (
          <div
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              !disabled && !uploading ? 'hover:border-[#2D5016] hover:bg-[#EBF4E8]' : 'cursor-not-allowed opacity-50'
            }`}
            style={{ borderColor: '#E4E0D4', aspectRatio: '1/1' }}
          >
            <Upload size={24} style={{ color: '#A89878' }} />
            <p className="text-xs mt-2 text-center px-2" style={{ color: '#A89878' }}>
              Add Photo
            </p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      <p className="text-xs mt-2" style={{ color: '#C8C2B0' }}>
        Upload 4-5 images showing different sides of the room (max 5MB each)
      </p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
function RoomContent() {
  const [rooms,        setRooms]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [activeTab,    setActiveTab]    = useState('All Rooms');
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState(BLANK_FORM);
  const [editId,       setEditId]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [uploading,    setUploading]    = useState(false);

  const roomsCollection = collection(db, 'rooms');

  useEffect(() => {
    const q = query(roomsCollection, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error(err);
      showToast('Failed to load rooms', 'error');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.name?.toLowerCase().includes(q) || r.type?.toLowerCase().includes(q);
    const matchTab =
      activeTab === 'All Rooms'   ? true :
      activeTab === 'Suites'      ? r.type === 'Suite' :
      activeTab === 'Villas'      ? r.type === 'Deluxe' :
      activeTab === 'Bungalows'   ? r.type === 'Standard' || r.type === 'Superior' :
      activeTab === 'Maintenance' ? r.status === 'maintenance' : true;
    return matchSearch && matchTab;
  });

  const tabCounts = {
    'All Rooms':   rooms.length,
    'Suites':      rooms.filter(r => r.type === 'Suite').length,
    'Villas':      rooms.filter(r => r.type === 'Deluxe').length,
    'Bungalows':   rooms.filter(r => r.type === 'Standard' || r.type === 'Superior').length,
    'Maintenance': rooms.filter(r => r.status === 'maintenance').length,
  };

  const openAdd = () => { 
    setForm(BLANK_FORM); 
    setEditId(null); 
    setModal('add'); 
  };
  
  const openEdit = (r) => { 
    const { id, ...d } = r; 
    setForm({ 
      name: d.name || '',
      type: d.type || 'Standard',
      capacity: d.capacity || 2,
      ratePerDay: d.ratePerDay || '',
      status: d.status || 'available',
      floor: d.floor || '',
      description: d.description || '',
      amenities: d.amenities || [],
      images: (d.images || []).map(img => ({ ...img, isNew: false, preview: img.url })),
      newImages: []
    }); 
    setEditId(r.id); 
    setModal('edit'); 
  };
  
  const openDelete = (r) => { 
    setDeleteTarget(r); 
    setModal('delete'); 
  };
  
  const closeModal = () => { 
    setModal(null); 
    setDeleteTarget(null);
    setForm(BLANK_FORM);
  };

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'capacity' || name === 'ratePerDay' ? value : value }));
  };
  
  const toggleAmenity = (a) => setForm(f => ({
    ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
  }));

  const handleImagesChange = (newImages) => {
    setForm(f => ({ ...f, images: newImages }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.ratePerDay) { 
      showToast('Please fill in required fields', 'error'); 
      return; 
    }
    
    const ratePerDayNum = Number(form.ratePerDay);
    if (isNaN(ratePerDayNum) || ratePerDayNum <= 0) {
      showToast('Please enter a valid rate per night', 'error');
      return;
    }
    
    setUploading(true);
    
    try {
      // Process images: upload new ones, keep existing
      const processedImages = [];
      const newImagesToUpload = form.images.filter(img => img.isNew && img.file);
      
      // Keep existing images that are already uploaded
      for (const img of form.images) {
        if (!img.isNew && img.url) {
          processedImages.push({
            url: img.url,
            publicId: img.publicId,
            order: img.order || processedImages.length + 1
          });
        }
      }
      
      // Upload new images
      if (newImagesToUpload.length > 0) {
        showToast(`Uploading ${newImagesToUpload.length} image(s)...`, 'info');
        
        for (let i = 0; i < newImagesToUpload.length; i++) {
          const img = newImagesToUpload[i];
          try {
            const result = await uploadToCloudinary(img.file);
            processedImages.push({
              url: result.url,
              publicId: result.publicId,
              order: img.order || processedImages.length + 1
            });
          } catch (uploadError) {
            console.error(`Failed to upload image ${i + 1}:`, uploadError);
            showToast(`Failed to upload image ${i + 1}. Please try again.`, 'error');
            setUploading(false);
            return;
          }
        }
        
        showToast('All images uploaded successfully!', 'success');
      }
      
      // Sort images by order
      processedImages.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Get the first image URL for backward compatibility
      const firstImageUrl = processedImages.length > 0 ? processedImages[0].url : TYPE_IMAGES[form.type];
      
      const data = {
        name: form.name.trim(),
        type: form.type,
        capacity: Number(form.capacity),
        ratePerDay: ratePerDayNum,
        status: form.status,
        floor: form.floor ? form.floor.trim() : '',
        description: form.description ? form.description.trim() : '',
        amenities: form.amenities || [],
        images: processedImages,
        imageUrl: firstImageUrl, // Keep for backward compatibility
        updatedAt: serverTimestamp(),
      };
      
      if (modal === 'add') {
        await addDoc(roomsCollection, {
          ...data,
          createdAt: serverTimestamp(),
        });
        showToast('Room added successfully', 'success');
      } else {
        await updateDoc(doc(db, 'rooms', editId), data);
        showToast('Room updated successfully', 'success');
      }
      closeModal();
    } catch (e) { 
      console.error('Save error:', e); 
      showToast(`Failed to save room: ${e.message || 'Unknown error'}`, 'error'); 
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setUploading(true);
    try {
      await deleteDoc(doc(db, 'rooms', deleteTarget.id));
      showToast('Room removed successfully', 'success');
      closeModal();
    } catch (e) { 
      console.error(e); 
      showToast('Failed to delete room', 'error'); 
    } finally {
      setUploading(false);
    }
  };

  const canSave = form.name.trim() && form.ratePerDay && !uploading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F2EA' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5016] mb-4" />
          <p style={{ color: '#7A6A4E', fontFamily: "'DM Sans', sans-serif" }}>Loading rooms…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-10" style={{ backgroundColor: '#F4F2EA', fontFamily: "'DM Sans', sans-serif" }}>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>
            Room Management
          </h1>
          <p className="text-sm mt-1 font-light" style={{ color: '#A89878' }}>
            Overview of all luxury suites and villas. Track status, pricing, and availability in real-time.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: '#2D5016', boxShadow: '0 2px 10px rgba(45,80,22,0.25)', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1E3A0F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'none'; }}
        >
          <Plus size={16} /> Add New Room
        </button>
      </div>

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1" style={{ borderBottom: '1px solid #E4E0D4' }}>
        {ROOM_TYPES.map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 relative"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: active ? '#2D5016' : '#A89878',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 600 : 400,
                borderBottom: active ? '2px solid #2D5016' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: active ? '#EBF4E8' : '#F0EDE4', color: active ? '#2D5016' : '#A89878', fontSize: '0.65rem' }}
              >
                {tabCounts[tab]}
              </span>
            </button>
          );
        })}

        <div className="ml-auto relative flex-shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A89878' }} />
          <input
            className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-200"
            style={{ background: '#FDFCF7', border: '1.5px solid #E4E0D4', color: '#231C0F', width: 200, fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Search rooms…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 2px rgba(45,80,22,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#E4E0D4'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {filtered.map(room => (
          <RoomCard key={room.id} room={room} onEdit={openEdit} onDelete={openDelete} />
        ))}
        <AddRoomCard onClick={openAdd} />
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BedDouble size={40} style={{ color: '#A89878', opacity: 0.3, marginBottom: 12 }} />
          <p className="text-sm" style={{ color: '#A89878' }}>No rooms found.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>

            <div className="flex items-start justify-between px-7 pt-6 pb-5" style={{ borderBottom: '1px solid #EEEBE0' }}>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>
                  {modal === 'add' ? 'Add New Room' : 'Edit Room'}
                </h2>
                <p className="text-xs mt-1 font-light" style={{ color: '#A89878' }}>
                  {modal === 'add' ? 'Fill in the details for the new room.' : `Editing: ${form.name}`}
                </p>
              </div>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors duration-150"
                style={{ background: '#F0EBD8', border: 'none', cursor: 'pointer', color: '#7A6A4E' }}
                onMouseEnter={e => e.currentTarget.style.background = '#DDD5BB'}
                onMouseLeave={e => e.currentTarget.style.background = '#F0EBD8'}>
                <X size={14} />
              </button>
            </div>

            <div className="px-7 py-5 grid grid-cols-2 gap-4">
              <MultipleImageUpload
                images={form.images}
                onImagesChange={handleImagesChange}
                disabled={uploading}
              />
              
              <div className="col-span-2">
                <label className={labelCls}>Room Name *</label>
                <input className={inputCls} name="name" value={form.name} onChange={handleField} placeholder="e.g. Deluxe Ocean Suite" disabled={uploading} />
              </div>
              
              <div>
                <label className={labelCls}>Room Type</label>
                <div className="relative">
                  <select className={inputCls + ' pr-8 appearance-none cursor-pointer'} name="type" value={form.type} onChange={handleField} disabled={uploading}>
                    {['Standard','Superior','Deluxe','Suite'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A89878' }} />
                </div>
              </div>
              
              <div>
                <label className={labelCls}>Status</label>
                <div className="relative">
                  <select className={inputCls + ' pr-8 appearance-none cursor-pointer'} name="status" value={form.status} onChange={handleField} disabled={uploading}>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A89878' }} />
                </div>
              </div>
              
              <div>
                <label className={labelCls}>Capacity (pax)</label>
                <input className={inputCls} type="number" min="1" max="20" name="capacity" value={form.capacity} onChange={handleField} disabled={uploading} />
              </div>
              
              <div>
                <label className={labelCls}>Rate / Night (₱) *</label>
                <input className={inputCls} type="number" min="0" name="ratePerDay" value={form.ratePerDay} onChange={handleField} placeholder="1500" disabled={uploading} />
              </div>
              
              <div className="col-span-2">
                <label className={labelCls}>Floor / Location</label>
                <input className={inputCls} name="floor" value={form.floor} onChange={handleField} placeholder="e.g. 2nd Floor, North Wing" disabled={uploading} />
              </div>
              
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <textarea className={inputCls + ' resize-y min-h-[80px]'} name="description" value={form.description} onChange={handleField} placeholder="Brief room description…" disabled={uploading} />
              </div>
              
              <div className="col-span-2">
                <label className={labelCls}>Amenities</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {AMENITY_LIST.map(a => {
                    const checked = form.amenities.includes(a);
                    return (
                      <button key={a} type="button" onClick={() => toggleAmenity(a)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150"
                        style={{
                          border: `1.5px solid ${checked ? '#2D5016' : '#E4E0D4'}`,
                          background: checked ? 'rgba(122,158,92,0.12)' : 'transparent',
                          color: checked ? '#2D5016' : '#7A6A4E',
                          fontWeight: checked ? 600 : 400,
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                          opacity: uploading ? 0.5 : 1,
                        }}
                        disabled={uploading}>
                        <span>{AMENITY_ICONS[a]}</span> {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-7 py-4" style={{ borderTop: '1px solid #EEEBE0' }}>
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#A89878'; e.currentTarget.style.color = '#231C0F'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD5BB'; e.currentTarget.style.color = '#7A6A4E'; }}
                disabled={uploading}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!canSave}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center gap-2"
                style={{
                  background: canSave ? '#2D5016' : '#A89878',
                  cursor: canSave ? 'pointer' : 'not-allowed',
                  border: 'none', fontFamily: "'DM Sans', sans-serif",
                  boxShadow: canSave ? '0 2px 8px rgba(45,80,22,0.22)' : 'none',
                }}
                onMouseEnter={e => { if (canSave) { e.currentTarget.style.background = '#1E3A0F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = canSave ? '#2D5016' : '#A89878'; e.currentTarget.style.transform = 'none'; }}>
                {uploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {modal === 'add' ? (uploading ? 'Uploading...' : 'Add Room') : (uploading ? 'Saving...' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === 'delete' && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(20,35,10,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-sm rounded-2xl text-center"
            style={{ background: '#fff', border: '1px solid #E4E0D4', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div className="px-8 pt-8 pb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FAEDEA' }}>
                <Trash2 size={22} style={{ color: '#8B3A2A' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1E3A0F', fontFamily: 'Georgia, serif' }}>Remove Room?</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A89878' }}>
                You are about to permanently remove <strong style={{ color: '#3D3222' }}>{deleteTarget.name}</strong>. This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 px-8 pb-7">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{ border: '1.5px solid #DDD5BB', background: 'transparent', color: '#7A6A4E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#A89878'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDD5BB'}
                disabled={uploading}>
                Keep Room
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 flex items-center justify-center gap-2"
                style={{ background: '#8B3A2A', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: uploading ? 0.5 : 1 }}
                onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = '#6e2e1e'; }}
                onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = '#8B3A2A'; }}
                disabled={uploading}>
                {uploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

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

export default function RoomManagement() {
  return (
    <AdminLayout>
      <RoomContent />
    </AdminLayout>
  );
}