import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, X } from 'lucide-react';
import { getPhotos, addPhoto, deletePhoto } from '../utils/storage';
import './PhotoJournalPage.css';

function PhotoJournalPage() {
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [viewing, setViewing] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { setPhotos(getPhotos()); }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize to save localStorage space
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * maxSize; w = maxSize; }
        else { w = (w / h) * maxSize; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setPreview(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!preview) return;
    const newPhotos = addPhoto({ dataUrl: preview, caption: caption.trim() });
    setPhotos(newPhotos);
    setPreview(null);
    setCaption('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = (id) => {
    setPhotos(deletePhoto(id));
    setViewing(null);
  };

  const todayHasPhoto = photos.some(p =>
    new Date(p.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="photo-page">
      <header className="page-header">
        <h1>Photo Journal</h1>
        <p className="page-subtitle">One photo a day — capture something, anything 📸</p>
      </header>

      {!todayHasPhoto && !preview && (
        <div className="photo-prompt fade-in">
          <Camera size={32} color="var(--lavender-dark)" />
          <p>What caught your eye today?</p>
          <label className="photo-upload-btn">
            <Camera size={16} /> Take or choose a photo
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="sr-only"
            />
          </label>
        </div>
      )}

      {todayHasPhoto && !preview && (
        <div className="photo-done fade-in">
          ✅ You've captured today's moment! Come back tomorrow 🌸
        </div>
      )}

      {preview && (
        <div className="photo-preview slide-up">
          <img src={preview} alt="Preview" className="preview-img" />
          <input
            className="input-field"
            placeholder="Add a caption (optional)..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          <div className="preview-actions">
            <button className="primary-btn" onClick={handleSave}>Save to journal ✨</button>
            <button className="back-btn" onClick={() => { setPreview(null); setCaption(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-grid">
          <h3 className="section-title">Your moments</h3>
          <div className="grid">
            {photos.map(p => (
              <button key={p.id} className="photo-thumb" onClick={() => setViewing(p)}>
                <img src={p.dataUrl} alt={p.caption || 'Photo'} />
                <span className="photo-date">
                  {new Date(p.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <div className="photo-modal" onClick={() => setViewing(null)}>
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewing(null)} aria-label="Close">
              <X size={20} />
            </button>
            <img src={viewing.dataUrl} alt={viewing.caption || 'Photo'} className="modal-img" />
            {viewing.caption && <p className="modal-caption">{viewing.caption}</p>}
            <p className="modal-date">
              {new Date(viewing.timestamp).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <button className="delete-btn" onClick={() => handleDelete(viewing.id)}>
              <Trash2 size={12} /> Delete photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoJournalPage;
