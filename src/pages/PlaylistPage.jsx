import React, { useState, useEffect } from 'react';
import { Music, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getPlaylists, savePlaylists } from '../utils/storage';
import './PlaylistPage.css';

const MOOD_CATEGORIES = [
  { value: 'calm', label: 'Calm', emoji: '🌊' },
  { value: 'energize', label: 'Energize', emoji: '⚡' },
  { value: 'sad', label: 'Sad', emoji: '🌧️' },
  { value: 'happy', label: 'Happy', emoji: '☀️' },
  { value: 'focus', label: 'Focus', emoji: '🎯' },
  { value: 'sleep', label: 'Sleep', emoji: '🌙' },
];

function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [mood, setMood] = useState('calm');
  const [openPlaylist, setOpenPlaylist] = useState(null);
  const [addingSongTo, setAddingSongTo] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');

  useEffect(() => { setPlaylists(getPlaylists()); }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const updated = [...playlists, { id: Date.now(), name: name.trim(), mood, songs: [] }];
    savePlaylists(updated);
    setPlaylists(updated);
    setName(''); setMood('calm');
    setShowCreate(false);
  };

  const handleAddSong = (playlistId) => {
    if (!songTitle.trim()) return;
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: [...p.songs, { id: Date.now(), title: songTitle.trim(), artist: songArtist.trim() }] };
      }
      return p;
    });
    savePlaylists(updated);
    setPlaylists(updated);
    setSongTitle(''); setSongArtist('');
    setAddingSongTo(null);
  };

  const handleDeleteSong = (playlistId, songId) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    });
    savePlaylists(updated);
    setPlaylists(updated);
  };

  const handleDeletePlaylist = (id) => {
    const updated = playlists.filter(p => p.id !== id);
    savePlaylists(updated);
    setPlaylists(updated);
  };

  return (
    <div className="playlist-page">
      <header className="page-header">
        <h1>Playlists 🎵</h1>
        <p className="page-subtitle">Music for every mood — build your collections</p>
      </header>

      {!showCreate ? (
        <button className="primary-btn" onClick={() => setShowCreate(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Create a playlist
        </button>
      ) : (
        <div className="playlist-form card slide-up">
          <input className="input-field" placeholder="Playlist name..." value={name} onChange={e => setName(e.target.value)} />
          <label className="pl-label">Mood</label>
          <div className="mood-options">
            {MOOD_CATEGORIES.map(m => (
              <button key={m.value} className={`mood-chip ${mood === m.value ? 'active' : ''}`} onClick={() => setMood(m.value)}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleCreate}>Create</button>
            <button className="back-btn" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="playlists-list">
        {playlists.map(pl => {
          const moodInfo = MOOD_CATEGORIES.find(m => m.value === pl.mood);
          const isOpen = openPlaylist === pl.id;
          return (
            <div key={pl.id} className={`playlist-card card ${isOpen ? 'open' : ''}`}>
              <button className="playlist-header" onClick={() => setOpenPlaylist(isOpen ? null : pl.id)}>
                <span className="pl-mood-emoji">{moodInfo?.emoji}</span>
                <div className="pl-info">
                  <span className="pl-name">{pl.name}</span>
                  <span className="pl-count">{pl.songs.length} songs • {moodInfo?.label}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isOpen && (
                <div className="playlist-content slide-up">
                  {pl.songs.length > 0 ? (
                    <div className="song-list">
                      {pl.songs.map((s, i) => (
                        <div key={s.id} className="song-item">
                          <span className="song-num">{i + 1}</span>
                          <div className="song-info">
                            <span className="song-title">{s.title}</span>
                            {s.artist && <span className="song-artist">{s.artist}</span>}
                          </div>
                          <button className="delete-btn" onClick={() => handleDeleteSong(pl.id, s.id)}><Trash2 size={10} /></button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-songs">No songs yet — add some!</p>
                  )}

                  {addingSongTo === pl.id ? (
                    <div className="add-song-form">
                      <input className="input-field" placeholder="Song title" value={songTitle} onChange={e => setSongTitle(e.target.value)} />
                      <input className="input-field" placeholder="Artist (optional)" value={songArtist} onChange={e => setSongArtist(e.target.value)} />
                      <div className="form-actions">
                        <button className="primary-btn" onClick={() => handleAddSong(pl.id)}>Add song</button>
                        <button className="back-btn" onClick={() => setAddingSongTo(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="add-song-btn" onClick={() => setAddingSongTo(pl.id)}>
                      <Plus size={12} /> Add a song
                    </button>
                  )}

                  <button className="delete-playlist-btn" onClick={() => handleDeletePlaylist(pl.id)}>
                    <Trash2 size={12} /> Delete playlist
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {playlists.length === 0 && !showCreate && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🎵</span>
          <p>Create playlists for different moods.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Music can be a powerful coping tool.</p>
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;
