import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './StackBlocksPage.css';

const COLORS = [
  '#f8b4c8', '#a0d4f0', '#b8e6b8', '#f0d4a0',
  '#d0b0f0', '#f0a0a0', '#a0e0d0', '#e0c0f0',
];

const BLOCK_WIDTH_MIN = 40;
const BLOCK_WIDTH_MAX = 80;
const BLOCK_HEIGHT = 28;

function StackBlocksPage({ onBack }) {
  const [blocks, setBlocks] = useState([]);
  const [fallingBlock, setFallingBlock] = useState(null);
  const [score, setScore] = useState(0);
  const [areaWidth, setAreaWidth] = useState(300);
  const areaRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) {
      setAreaWidth(areaRef.current.offsetWidth);
    }
  }, []);

  const spawnBlock = useCallback(() => {
    const width = BLOCK_WIDTH_MIN + Math.random() * (BLOCK_WIDTH_MAX - BLOCK_WIDTH_MIN);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const x = Math.random() * (areaWidth - width);
    return {
      id: Date.now(),
      x,
      y: 0,
      width,
      height: BLOCK_HEIGHT,
      color,
      falling: true,
      speed: 1.5 + Math.random() * 1,
      wobble: 0,
      wobbleDir: (Math.random() - 0.5) * 0.3,
    };
  }, [areaWidth]);

  useEffect(() => {
    if (!fallingBlock) {
      if (areaWidth > 0) {
        setFallingBlock(spawnBlock());
      }
      return;
    }

    const areaHeight = 400;
    const stackTop = blocks.length > 0
      ? Math.min(...blocks.map(b => b.y))
      : areaHeight;

    animRef.current = setInterval(() => {
      setFallingBlock(prev => {
        if (!prev) return null;
        const newY = prev.y + prev.speed;
        const landY = stackTop - BLOCK_HEIGHT;

        if (newY >= landY) {
          const landed = {
            ...prev,
            y: landY,
            falling: false,
            wobble: (Math.random() - 0.5) * 4,
          };
          setBlocks(b => [...b, landed]);
          setScore(s => s + 1);
          return null;
        }
        return { ...prev, y: newY };
      });
    }, 20);

    return () => clearInterval(animRef.current);
  }, [fallingBlock, blocks, spawnBlock, areaWidth]);

  const dropBlock = () => {
    if (!fallingBlock) return;
    const areaHeight = 400;
    const stackTop = blocks.length > 0
      ? Math.min(...blocks.map(b => b.y))
      : areaHeight;
    const landY = stackTop - BLOCK_HEIGHT;

    const landed = {
      ...fallingBlock,
      y: landY,
      falling: false,
      wobble: (Math.random() - 0.5) * 4,
    };
    setBlocks(b => [...b, landed]);
    setScore(s => s + 1);
    setFallingBlock(null);
  };

  const reset = () => {
    setBlocks([]);
    setFallingBlock(null);
    setScore(0);
  };

  return (
    <div className="stackblocks-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Stack Blocks 🧱</h1>
        <p className="page-subtitle">Tap to drop blocks — stack them as high as you like</p>
      </header>

      <div className="sb-score">
        🧱 {score} blocks stacked
      </div>

      <div className="sb-area" ref={areaRef} onClick={dropBlock}>
        {blocks.map(block => (
          <div
            key={block.id}
            className="sb-block"
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              backgroundColor: block.color,
              transform: `rotate(${block.wobble}deg)`,
            }}
          />
        ))}
        {fallingBlock && (
          <div
            className="sb-block falling"
            style={{
              left: fallingBlock.x,
              top: fallingBlock.y,
              width: fallingBlock.width,
              height: fallingBlock.height,
              backgroundColor: fallingBlock.color,
            }}
          />
        )}
      </div>

      <button className="clear-btn" onClick={reset}>
        <RotateCcw size={14} /> Start Over
      </button>
    </div>
  );
}

export default StackBlocksPage;
