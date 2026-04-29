import React, { useState } from 'react';
import { Plus, Trash2, LogOut, UserCircle } from 'lucide-react';
import { getProfiles, createProfile, deleteProfile, setActiveProfile, getActiveProfileId } from '../utils/storage';
import './ProfilePage.css';

const AVATARS = ['🌸', '🌊', '🦋', '🌙', '⭐', '🌈', '🔥', '🍀', '🎵', '💜', '🌻', '🐱', '🐶', '🦊', '🐰', '🎨'];

function ProfilePage({ onProfileSelected }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const [creating, setCreating] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = () => {
    if (!name.trim()) return;
    const profile = createProfile(name.trim(), avatar);
    setProfiles(getProfiles());
    setCreating(false);
    setName('');
    onProfileSelected(profile);
  };

  const handleSelect = (profile) => {
    setActiveProfile(profile.id);
    onProfileSelected(profile);
  };

  const handleDelete = (id) => {
    const updated = deleteProfile(id);
    setProfiles(updated);
    setConfirmDelete(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="profile-logo">🌸</span>
        <h1>Bloom</h1>
        <p>Who's here today?</p>
      </div>

      {!creating && profiles.length > 0 && (
        <div className="profile-list fade-in">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-card-wrapper">
              <button
                className="profile-card"
                onClick={() => handleSelect(profile)}
              >
                <span className="profile-avatar">{profile.avatar}</span>
                <span className="profile-name">{profile.name}</span>
              </button>
              {confirmDelete === profile.id ? (
                <div className="delete-confirm">
                  <span>Delete {profile.name}'s data?</span>
                  <button className="confirm-yes" onClick={() => handleDelete(profile.id)}>Yes</button>
                  <button className="confirm-no" onClick={() => setConfirmDelete(null)}>No</button>
                </div>
              ) : (
                <button
                  className="profile-delete"
                  onClick={() => setConfirmDelete(profile.id)}
                  aria-label={`Delete ${profile.name}'s profile`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          <button className="add-profile-btn" onClick={() => setCreating(true)}>
            <Plus size={18} />
            <span>Add another person</span>
          </button>
        </div>
      )}

      {creating && (
        <div className="create-profile slide-up">
          <h2>{profiles.length === 0 ? "Let's set you up!" : 'New person'}</h2>

          <label className="create-label" htmlFor="profile-name">What's your name?</label>
          <input
            id="profile-name"
            className="create-input"
            placeholder="Your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
            maxLength={20}
          />

          <label className="create-label">Pick your avatar</label>
          <div className="avatar-grid">
            {AVATARS.map(a => (
              <button
                key={a}
                className={`avatar-btn ${avatar === a ? 'active' : ''}`}
                onClick={() => setAvatar(a)}
                aria-label={`Select ${a} avatar`}
              >
                {a}
              </button>
            ))}
          </div>

          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            {profiles.length === 0 ? "Let's go! ✨" : 'Create profile'}
          </button>

          {profiles.length > 0 && (
            <button className="cancel-create" onClick={() => setCreating(false)}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
