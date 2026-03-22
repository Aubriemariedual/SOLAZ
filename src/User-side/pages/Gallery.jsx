import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { X, ZoomIn, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --cream: #F5F0E8;
    --parchment: #EDE5D4;
    --gold: #B8922A;
    --gold-light: #D4A94B;
    --forest: #1C3A0D;
    --forest-mid: #2D5016;
    --bark: #7A6A4E;
    --dust: #A89878;
    --white: #FDFAF5;
    --shadow-soft: 0 4px 24px rgba(28, 58, 13, 0.08);
    --shadow-hover: 0 16px 48px rgba(28, 58, 13, 0.18);
    --transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .gallery-root {
    min-height: 100vh;
    background-color: var(--cream);
    background-image: 
      radial-gradient(ellipse at 20% 0%, rgba(184, 146, 42, 0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(45, 80, 22, 0.05) 0%, transparent 60%);
    font-family: 'Jost', sans-serif;
    padding: 0 0 80px;
  }

  /* ── LOADER ── */
  .gallery-loader {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    gap: 20px;
  }
  .loader-ring {
    width: 48px;
    height: 48px;
    border: 2px solid var(--parchment);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loader-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    color: var(--bark);
    letter-spacing: 0.12em;
    font-style: italic;
  }

  /* ── HERO HEADER ── */
  .gallery-hero {
    position: relative;
    text-align: center;
    padding: 80px 24px 60px;
    overflow: hidden;
  }
  .gallery-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, transparent, var(--gold));
  }
  .gallery-eyebrow {
    display: inline-block;
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .gallery-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 300;
    line-height: 1.05;
    color: var(--forest);
    letter-spacing: -0.01em;
    margin-bottom: 16px;
  }
  .gallery-title em {
    font-style: italic;
    color: var(--gold);
  }
  .gallery-subtitle {
    font-size: 0.95rem;
    color: var(--bark);
    max-width: 420px;
    margin: 0 auto;
    line-height: 1.7;
    font-weight: 300;
  }
  .gallery-rule {
    width: 60px;
    height: 1px;
    background: var(--gold);
    margin: 28px auto 0;
    opacity: 0.5;
  }

  /* ── CONTROLS ── */
  .gallery-controls {
    max-width: 1320px;
    margin: 0 auto 44px;
    padding: 0 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .filter-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dust);
    margin-right: 4px;
  }
  .filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .filter-pill {
    padding: 8px 20px;
    border-radius: 100px;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: 1px solid transparent;
    transition: var(--transition);
    text-transform: capitalize;
    background: var(--white);
    color: var(--bark);
    border-color: rgba(168, 152, 120, 0.3);
  }
  .filter-pill:hover {
    border-color: var(--gold);
    color: var(--gold);
  }
  .filter-pill.active {
    background: var(--forest);
    color: var(--white);
    border-color: var(--forest);
    box-shadow: 0 4px 16px rgba(28, 58, 13, 0.25);
  }
  .view-toggle {
    display: flex;
    background: var(--white);
    border: 1px solid rgba(168, 152, 120, 0.3);
    border-radius: 10px;
    padding: 4px;
    gap: 2px;
  }
  .view-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: 7px;
    cursor: pointer;
    color: var(--dust);
    transition: var(--transition);
  }
  .view-btn.active {
    background: var(--forest);
    color: var(--white);
    box-shadow: 0 2px 8px rgba(28, 58, 13, 0.25);
  }
  .view-btn:hover:not(.active) {
    background: var(--parchment);
    color: var(--forest);
  }

  /* ── GRID LAYOUT ── */
  .gallery-grid-wrap {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
  .gallery-card {
    position: relative;
    background: var(--white);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid rgba(237, 229, 212, 0.6);
  }
  .gallery-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-6px);
  }
  .card-img-wrap {
    position: relative;
    height: 260px;
    overflow: hidden;
    background: var(--parchment);
  }
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: block;
  }
  .gallery-card:hover .card-img {
    transform: scale(1.08);
  }
  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(28, 58, 13, 0) 40%,
      rgba(28, 58, 13, 0.65) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gallery-card:hover .card-overlay {
    opacity: 1;
  }
  .zoom-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transform: scale(0.7);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .gallery-card:hover .zoom-icon {
    transform: scale(1);
    opacity: 1;
  }
  .badge-cat {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 5px 12px;
    border-radius: 100px;
    font-family: 'Jost', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(15, 15, 15, 0.55);
    backdrop-filter: blur(6px);
    color: #fff;
  }
  .badge-featured {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 5px 12px;
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    background: var(--gold);
    color: #fff;
  }
  .card-body {
    padding: 20px 22px 22px;
  }
  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--forest);
    margin-bottom: 6px;
    line-height: 1.2;
  }
  .card-caption {
    font-size: 0.82rem;
    color: var(--bark);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 300;
  }
  .no-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--dust);
  }
  .placeholder-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--parchment);
  }

  /* ── LIST VIEW ── */
  .gallery-list-wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .list-header {
    display: grid;
    grid-template-columns: 100px 1fr 140px 1fr;
    gap: 16px;
    padding: 12px 24px;
    margin-bottom: 4px;
  }
  .list-header-cell {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dust);
  }
  .list-row {
    display: grid;
    grid-template-columns: 100px 1fr 140px 1fr;
    gap: 16px;
    align-items: center;
    padding: 16px 24px;
    background: var(--white);
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid rgba(237, 229, 212, 0.5);
    transition: var(--transition);
    box-shadow: 0 1px 4px rgba(28, 58, 13, 0.04);
  }
  .list-row:hover {
    box-shadow: var(--shadow-hover);
    transform: translateX(4px);
    border-color: rgba(184, 146, 42, 0.3);
  }
  .list-thumb {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--parchment);
    flex-shrink: 0;
  }
  .list-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .list-row:hover .list-thumb img {
    transform: scale(1.1);
  }
  .list-title-cell .list-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--forest);
  }
  .list-featured-tag {
    font-size: 0.68rem;
    color: var(--gold);
    letter-spacing: 0.05em;
    margin-top: 3px;
  }
  .list-cat-pill {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 100px;
    background: rgba(45, 80, 22, 0.08);
    color: var(--forest-mid);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: capitalize;
  }
  .list-caption {
    font-size: 0.82rem;
    color: var(--bark);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── EMPTY STATE ── */
  .gallery-empty {
    text-align: center;
    padding: 100px 24px;
    color: var(--bark);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-style: italic;
    font-weight: 300;
  }

  /* ── LIGHTBOX ── */
  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(10, 20, 6, 0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .lb-close {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: all 0.25s ease;
  }
  .lb-close:hover { background: rgba(255,255,255,0.18); transform: rotate(90deg); }
  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: all 0.25s ease;
  }
  .lb-nav:hover { background: rgba(255,255,255,0.2); }
  .lb-nav.left { left: 24px; }
  .lb-nav.right { right: 24px; }
  .lb-image-wrap {
    max-width: 90vw;
    max-height: 88vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: zoomIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoomIn { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .lb-image {
    max-width: 100%;
    max-height: 88vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    display: block;
  }
  .lb-caption {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 20, 6, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 12px 28px;
    border-radius: 100px;
    text-align: center;
    white-space: nowrap;
    max-width: 90vw;
    white-space: normal;
  }
  .lb-caption-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    color: #fff;
    font-weight: 400;
    letter-spacing: 0.03em;
  }
  .lb-caption-sub {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.6);
    margin-top: 3px;
    font-weight: 300;
  }
  .lb-counter {
    position: absolute;
    bottom: 32px;
    right: 32px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.4);
  }
  .lb-counter span { color: rgba(255,255,255,0.9); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .gallery-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
    .gallery-grid-wrap, .gallery-list-wrap { padding: 0 16px; }
    .gallery-controls { padding: 0 16px; }
    .list-header { display: none; }
    .list-row {
      grid-template-columns: 80px 1fr;
      grid-template-rows: auto auto;
    }
    .list-cat-col, .list-cap-col { display: none; }
    .lb-nav.left { left: 12px; }
    .lb-nav.right { right: 12px; }
  }
  @media (max-width: 480px) {
    .gallery-grid { grid-template-columns: 1fr; }
  }
`;

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const galleryCollection = collection(db, 'gallery');
    const q = query(galleryCollection, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      const cats = new Set();
      snapshot.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        items.push(item);
        if (item.category) cats.add(item.category);
      });
      setGalleryItems(items);
      setCategories(['all', ...Array.from(cats)]);
      setLoading(false);
    }, (error) => {
      console.error('Error loading gallery:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (item, index) => {
    setLightboxImage(item);
    setCurrentLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (currentLightboxIndex < filteredItems.length - 1) {
      const i = currentLightboxIndex + 1;
      setCurrentLightboxIndex(i);
      setLightboxImage(filteredItems[i]);
    }
  };

  const prevImage = () => {
    if (currentLightboxIndex > 0) {
      const i = currentLightboxIndex - 1;
      setCurrentLightboxIndex(i);
      setLightboxImage(filteredItems[i]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentLightboxIndex, filteredItems]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="gallery-loader">
          <div className="loader-ring" />
          <p className="loader-text">Curating the collection…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="gallery-root">

        {/* Hero Header */}
        <div className="gallery-hero">
          <span className="gallery-eyebrow">Visual Collection</span>
          <h1 className="gallery-title">Our <em>Gallery</em></h1>
          <p className="gallery-subtitle">
            Explore our beautiful spaces, amenities, and memorable moments captured in time.
          </p>
          <div className="gallery-rule" />
        </div>

        {/* Controls */}
        <div className="gallery-controls">
          <div className="filter-pills">
            <span className="filter-label">
              <SlidersHorizontal size={14} />
              Filter
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All Photos' : cat}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="gallery-empty">No photographs found in this collection.</div>
        )}

        {/* Grid View */}
        {filteredItems.length > 0 && viewMode === 'grid' && (
          <div className="gallery-grid-wrap">
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => openLightbox(item, index)}
                >
                  <div className="card-img-wrap">
                    {item.url ? (
                      <img src={item.url} alt={item.title} className="card-img" />
                    ) : (
                      <div className="no-img-placeholder">
                        <div className="placeholder-dot" />
                        <span style={{ fontSize: '0.75rem' }}>No image</span>
                      </div>
                    )}
                    <span className="badge-cat">{item.category}</span>
                    {item.featured && <span className="badge-featured">★ Featured</span>}
                    <div className="card-overlay">
                      <div className="zoom-icon"><ZoomIn size={20} /></div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{item.title}</h3>
                    {item.caption && <p className="card-caption">{item.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {filteredItems.length > 0 && viewMode === 'list' && (
          <div className="gallery-list-wrap">
            <div className="list-header">
              <div className="list-header-cell">Photo</div>
              <div className="list-header-cell">Title</div>
              <div className="list-header-cell">Category</div>
              <div className="list-header-cell">Description</div>
            </div>
            {filteredItems.map((item, index) => (
              <div key={item.id} className="list-row" onClick={() => openLightbox(item, index)}>
                <div className="list-thumb">
                  {item.url ? (
                    <img src={item.url} alt={item.title} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--parchment)' }} />
                  )}
                </div>
                <div className="list-title-cell">
                  <div className="list-title">{item.title}</div>
                  {item.featured && <div className="list-featured-tag">★ Featured</div>}
                </div>
                <div className="list-cat-col">
                  <span className="list-cat-pill">{item.category}</span>
                </div>
                <div className="list-cap-col">
                  <p className="list-caption">{item.caption || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div className="lightbox-backdrop" onClick={closeLightbox}>
            <button className="lb-close" onClick={closeLightbox}>
              <X size={18} />
            </button>

            {currentLightboxIndex > 0 && (
              <button className="lb-nav left" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                <ChevronLeft size={24} />
              </button>
            )}
            {currentLightboxIndex < filteredItems.length - 1 && (
              <button className="lb-nav right" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                <ChevronRight size={24} />
              </button>
            )}

            <div className="lb-image-wrap" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImage.url} alt={lightboxImage.title} className="lb-image" />
            </div>

            {(lightboxImage.title || lightboxImage.caption) && (
              <div className="lb-caption" onClick={(e) => e.stopPropagation()}>
                {lightboxImage.title && <p className="lb-caption-title">{lightboxImage.title}</p>}
                {lightboxImage.caption && <p className="lb-caption-sub">{lightboxImage.caption}</p>}
              </div>
            )}

            <div className="lb-counter">
              <span>{currentLightboxIndex + 1}</span> / {filteredItems.length}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;