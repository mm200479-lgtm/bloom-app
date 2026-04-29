import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './SoundMachinePage.css';

// Using Web Audio API to generate sounds — no external files needed
const SOUNDS = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', color: 'var(--sky)' },
  { id: 'ocean', label: 'Ocean Waves', emoji: '🌊', color: 'var(--sage)' },
  { id: 'white', label: 'White Noise', emoji: '📻', color: 'var(--cream)' },
  { id: 'brown', label: 'Brown Noise', emoji: '🟤', color: 'var(--blush)' },
  { id: 'pink', label: 'Pink Noise', emoji: '🩷', color: 'var(--lavender)' },
  { id: 'wind', label: 'Wind', emoji: '🍃', color: 'var(--sage)' },
  { id: 'fire', label: 'Crackling Fire', emoji: '🔥', color: 'var(--blush)' },
  { id: 'birds', label: 'Birds', emoji: '🐦', color: 'var(--sage)' },
];

function createNoiseGenerator(audioCtx, type) {
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'brown') {
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * white) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else if (type === 'rain' || type === 'ocean' || type === 'wind' || type === 'fire' || type === 'birds') {
    // Modulated noise for nature sounds
    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioCtx.sampleRate;
      let sample = Math.random() * 2 - 1;

      if (type === 'rain') {
        const mod = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.3));
        sample *= mod * 0.4;
        if (Math.random() < 0.001) sample *= 3;
      } else if (type === 'ocean') {
        const wave = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.15));
        const surge = 0.5 + 0.5 * Math.sin(t * 0.08);
        sample *= wave * surge * 0.5;
      } else if (type === 'wind') {
        const gust = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * 0.1 + Math.sin(t * 0.03) * 2));
        sample *= gust * 0.35;
      } else if (type === 'fire') {
        const crackle = Math.random() < 0.003 ? 2 : 0.3;
        sample *= crackle * 0.4;
      } else if (type === 'birds') {
        const chirp = Math.sin(t * 2000 + Math.sin(t * 8) * 500) * (Math.random() < 0.01 ? 0.3 : 0);
        sample = sample * 0.05 + chirp;
      }

      data[i] = sample;
    }
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function SoundMachinePage() {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleSound = (soundId) => {
    if (playing === soundId) {
      stopSound();
      return;
    }

    stopSound();

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const source = createNoiseGenerator(ctx, soundId);
    source.connect(gain);
    source.start();
    sourceRef.current = source;

    setPlaying(soundId);
  };

  const stopSound = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {}
      sourceRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setPlaying(null);
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (gainRef.current) {
      gainRef.current.gain.value = val;
    }
  };

  return (
    <div className="sound-page">
      <header className="page-header">
        <h1>Sound Machine</h1>
        <p className="page-subtitle">Background sounds to calm or focus 🎵</p>
      </header>

      <div className="sound-grid fade-in">
        {SOUNDS.map(sound => (
          <button
            key={sound.id}
            className={`sound-card ${playing === sound.id ? 'active' : ''}`}
            style={{ background: playing === sound.id ? sound.color : 'var(--bg-secondary)' }}
            onClick={() => toggleSound(sound.id)}
            aria-label={`${playing === sound.id ? 'Stop' : 'Play'} ${sound.label}`}
          >
            <span className="sound-emoji">{sound.emoji}</span>
            <span className="sound-label">{sound.label}</span>
            {playing === sound.id && (
              <span className="sound-playing">Playing...</span>
            )}
          </button>
        ))}
      </div>

      <div className="volume-control">
        <VolumeX size={16} color="var(--text-light)" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => changeVolume(parseFloat(e.target.value))}
          className="volume-slider"
          aria-label="Volume"
        />
        <Volume2 size={16} color="var(--text-light)" />
      </div>

      {playing && (
        <button className="stop-all-btn" onClick={stopSound}>
          <Pause size={16} /> Stop
        </button>
      )}

      <p className="sound-tip">
        💡 Brown noise is great for ADHD focus. Ocean waves help with sleep. Try different ones!
      </p>
    </div>
  );
}

export default SoundMachinePage;
