import React, { useState } from 'react';
import { Moon, Sun, Palette, Download, Heart } from 'lucide-react';
import { getSettings, saveSettings, exportAllData } from '../utils/storage';
import './SettingsPage.css';

const COLOR_SCHEMES = [
  { id: 'lavender', label: 'Lavender', colors: ['#e8d5f5', '#c9a8e8'] },
  { id: 'ocean', label: 'Ocean', colors: ['#d0e4f5', '#6ba3d6'] },
  { id: 'sunset', label: 'Sunset', colors: ['#f5ddd0', '#e8a080'] },
  { id: 'forest', label: 'Forest', colors: ['#d0e8d0', '#6aaa6a'] },
  { id: 'berry', label: 'Berry', colors: ['#e8d0e8', '#b868b8'] },
];

function SettingsPage({ onSettingsChange }) {
  const [settings, setSettings] = useState(getSettings());
  const [exported, setExported] = useState(false);

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
    a.download = `bloom-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Make Bloom yours ⚙️</p>
      </header>

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
          <h3>Export Data</h3>
        </div>
        <p className="setting-desc">
          Download all your data as a JSON file. Share it with your therapist or keep it as a backup.
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
          Bloom is a gentle mental health companion built with love. All your data stays on your device — nothing is ever sent anywhere.
        </p>
        <p className="setting-desc" style={{ marginTop: 8 }}>
          💜 You are enough, exactly as you are.
        </p>
        <p className="version">Version 2.0.0</p>
      </div>
    </div>
  );
}

export default SettingsPage;
