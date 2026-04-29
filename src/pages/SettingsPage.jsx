import React, { useState } from 'react';
import { Moon, Sun, Palette, Download, Heart, LogOut, User, Edit3, Cloud, CloudOff } from 'lucide-react';
import { getSettings, saveSettings, exportAllData, getActiveProfile, updateProfile, getActiveProfileId } from '../utils/storage';
import { isFirebaseConfigured, signInWithGoogle, firebaseSignOut } from '../utils/firebase';
import { forceSync, pullFromCloud } from '../utils/sync';
import './SettingsPage.css';

const COLOR_SCHEMES = [
  { id: 'lavender', label: 'Lavender', colors: ['#e8d5f5', '#c9a8e8'] },
  { id: 'ocean', label: 'Ocean', colors: ['#d0e4f5', '#6ba3d6'] },
  { id: 'sunset', label: 'Sunset', colors: ['#f5ddd0', '#e8a080'] },
  { id: 'forest', label: 'Forest', colors: ['#d0e8d0', '#6aaa6a'] },
  { id: 'berry', label: 'Berry', colors: ['#e8d0e8', '#b868b8'] },
];

const AVATARS = ['🌸', '🌊', '🦋', '🌙', '⭐', '🌈', '🔥', '🍀', '🎵', '💜', '🌻', '🐱', '🐶', '🦊', '🐰', '🎨'];

function SettingsPage({ onSettingsChange, onSwitchProfile, profile }) {
  const [settings, setSettings] = useState(getSettings());
  const [exported, setExported] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const [editingAvatar, setEditingAvatar] = useState(false);

  const update = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
    onSettingsChange(updated);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloom-${profile?.name || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleNameSave = () => {
    if (!newName.trim()) return;
    updateProfile(getActiveProfileId(), { name: newName.trim() });
    setEditingName(false);
    // Force a re-render by reloading
    window.location.reload();
  };

  const handleAvatarChange = (avatar) => {
    updateProfile(getActiveProfileId(), { avatar });
    setEditingAvatar(false);
    window.location.reload();
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Make Bloom yours ⚙️</p>
      </header>

      {/* Profile */}
      <div className="setting-section card">
        <div className="setting-header">
          <User size={18} />
          <h3>Profile</h3>
        </div>
        <div className="profile-info">
          <div className="profile-avatar-display">
            <span className="current-avatar">{profile?.avatar}</span>
            <button className="edit-avatar-btn" onClick={() => setEditingAvatar(!editingAvatar)}>
              <Edit3 size={12} />
            </button>
          </div>
          {editingAvatar && (
            <div className="avatar-edit-grid slide-up">
              {AVATARS.map(a => (
                <button
                  key={a}
                  className={`avatar-option ${profile?.avatar === a ? 'active' : ''}`}
                  onClick={() => handleAvatarChange(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
          <div className="profile-name-section">
            {editingName ? (
              <div className="name-edit-row">
                <input
                  className="input-field"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  maxLength={20}
                  autoFocus
                />
                <button className="name-save-btn" onClick={handleNameSave}>Save</button>
              </div>
            ) : (
              <div className="name-display">
                <span className="current-name">{profile?.name}</span>
                <button className="edit-name-btn" onClick={() => setEditingName(true)}>
                  <Edit3 size={12} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <button className="switch-profile-btn" onClick={onSwitchProfile}>
          <LogOut size={14} /> Switch person
        </button>
      </div>

      {/* Cloud Sync */}
      <div className="setting-section card">
        <div className="setting-header">
          {firebaseUser ? <Cloud size={18} color="var(--sage-dark)" /> : <CloudOff size={18} />}
          <h3>Cloud Sync</h3>
        </div>
        {!isFirebaseConfigured() ? (
          <div className="sync-status">
            <p className="setting-desc">
              Cloud sync is not configured yet. Data is stored locally on this device only.
            </p>
            <p className="setting-desc" style={{ marginTop: 6, fontSize: 11 }}>
              To enable sync across devices, set up Firebase and add your config to the environment variables. See the README for instructions.
            </p>
          </div>
        ) : firebaseUser ? (
          <div className="sync-status">
            <div className="sync-connected">
              <span className="sync-dot connected" />
              <span>Signed in as {firebaseUser.email}</span>
            </div>
            <p className="setting-desc">Your data syncs automatically across all devices where you sign in.</p>
            <div className="sync-actions">
              <button className="sync-now-btn" onClick={async () => {
                await forceSync();
                await pullFromCloud();
                alert('Synced! ✅');
              }}>
                <Cloud size={14} /> Sync now
              </button>
              <button className="sign-out-btn" onClick={async () => {
                await firebaseSignOut();
                window.location.reload();
              }}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="sync-status">
            <p className="setting-desc">
              Sign in to sync your data across your phone, iPad, and other devices.
            </p>
            <button className="google-sign-in-btn" onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (err) {
                console.error('Sign in failed:', err);
              }
            }}>
              Sign in with Google
            </button>
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="setting-section card">
        <div className="setting-header">
          {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          <h3>Theme</h3>
        </div>
        <div className="theme-toggle">
          <button
            className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
            onClick={() => update('theme', 'light')}
          >
            <Sun size={16} /> Light
          </button>
          <button
            className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
            onClick={() => update('theme', 'dark')}
          >
            <Moon size={16} /> Dark
          </button>
        </div>
      </div>

      {/* Color scheme */}
      <div className="setting-section card">
        <div className="setting-header">
          <Palette size={18} />
          <h3>Color Scheme</h3>
        </div>
        <div className="color-grid">
          {COLOR_SCHEMES.map(scheme => (
            <button
              key={scheme.id}
              className={`color-option ${settings.colorScheme === scheme.id ? 'active' : ''}`}
              onClick={() => update('colorScheme', scheme.id)}
              aria-label={scheme.label}
            >
              <div className="color-preview">
                <span style={{ background: scheme.colors[0] }} />
                <span style={{ background: scheme.colors[1] }} />
              </div>
              <span className="color-label">{scheme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="setting-section card">
        <div className="setting-header">
          <Download size={18} />
          <h3>Export {profile?.name}'s Data</h3>
        </div>
        <p className="setting-desc">
          Download all data as a JSON file. Share it with a therapist or keep as a backup.
        </p>
        <button className="export-btn" onClick={handleExport}>
          <Download size={16} /> {exported ? 'Downloaded! ✅' : 'Export all data'}
        </button>
      </div>

      {/* About */}
      <div className="setting-section card">
        <div className="setting-header">
          <Heart size={18} color="var(--blush-dark)" />
          <h3>About Bloom</h3>
        </div>
        <p className="setting-desc">
          Bloom is a gentle mental health companion built with love. All data stays on this device — nothing is ever sent anywhere. Each person's data is completely separate and private.
        </p>
        <p className="setting-desc" style={{ marginTop: 8 }}>
          💜 You are enough, exactly as you are.
        </p>
        <p className="version">Version 2.1.0</p>
      </div>
    </div>
  );
}

export default SettingsPage;
