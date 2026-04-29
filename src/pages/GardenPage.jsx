import React, { useState, useEffect } from 'react';
import { Flower2, Sprout, TreePine } from 'lucide-react';
import { getGarden, addFlower, spendPetals } from '../utils/storage';
import './GardenPage.css';

const FLOWERS = [
  { id: 'daisy', name: 'Daisy', cost: 10, emoji: '🌼', desc: 'Simple and cheerful' },
  { id: 'tulip', name: 'Tulip', cost: 15, emoji: '🌷', desc: 'Elegant and strong' },
  { id: 'sunflower', name: 'Sunflower', cost: 20, emoji: '🌻', desc: 'Always facing the light' },
  { id: 'rose', name: 'Rose', cost: 25, emoji: '🌹', desc: 'Beautiful and resilient' },
  { id: 'cherry', name: 'Cherry Blossom', cost: 30, emoji: '🌸', desc: 'Gentle and fleeting' },
  { id: 'cactus', name: 'Cactus', cost: 15, emoji: '🌵', desc: 'Tough and independent' },
  { id: 'herb', name: 'Herb Garden', cost: 20, emoji: '🌿', desc: 'Useful and grounding' },
  { id: 'tree', name: 'Little Tree', cost: 35, emoji: '🌳', desc: 'Growing stronger every day' },
  { id: 'mushroom', name: 'Mushroom', cost: 10, emoji: '🍄', desc: 'Unique and magical' },
  { id: 'clover', name: 'Lucky Clover', cost: 12, emoji: '🍀', desc: 'A little bit of luck' },
  { id: 'butterfly', name: 'Butterfly', cost: 25, emoji: '🦋', desc: 'Transformation is beautiful' },
  { id: 'rainbow', name: 'Rainbow', cost: 40, emoji: '🌈', desc: 'After every storm' },
];

function GardenPage() {
  const [garden, setGarden] = useState(getGarden());
  const [justPlanted, setJustPlanted] = useState(null);

  const handlePlant = (flower) => {
    const updated = spendPetals(flower.cost);
    if (!updated) return;
    const withFlower = addFlower({ type: flower.id, emoji: flower.emoji, name: flower.name });
    setGarden(withFlower);
    setJustPlanted(flower.emoji);
    setTimeout(() => setJustPlanted(null), 2000);
  };

  return (
    <div className="garden-page">
      <header className="page-header">
        <h1>My Garden 🌸</h1>
        <p className="page-subtitle">Grow flowers with your progress</p>
      </header>

      <div className="petal-balance">
        <span className="petal-emoji">🌸</span>
        <div>
          <span className="petal-count">{garden.petals} petals</span>
          <span className="petal-total">{garden.totalPetals} earned total</span>
        </div>
      </div>

      <div className="earn-info">
        <h3 className="section-title">How to earn petals</h3>
        <div className="earn-grid">
          <span>💜 Mood check-in → 1 petal</span>
          <span>✅ Routine step → 1 petal</span>
          <span>⚡ Energy log → 1 petal</span>
          <span>⭐ Win jar entry → 2 petals</span>
          <span>🍅 Focus session → 3 petals</span>
        </div>
      </div>

      {justPlanted && (
        <div className="just-planted slide-up">
          <span style={{ fontSize: 48, animation: 'grow 0.5s ease' }}>{justPlanted}</span>
          <p>Planted! Your garden is growing 🌱</p>
        </div>
      )}

      {garden.flowers.length > 0 && (
        <div className="garden-display">
          <h3 className="section-title">Your garden ({garden.flowers.length} plants)</h3>
          <div className="garden-grid">
            {garden.flowers.map((f, i) => (
              <div
                key={f.id}
                className="garden-plant"
                style={{ animationDelay: `${i * 0.1}s` }}
                title={`${f.name} — planted ${new Date(f.plantedAt).toLocaleDateString()}`}
              >
                <span className="plant-emoji">{f.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {garden.flowers.length === 0 && (
        <div className="empty-garden">
          <Sprout size={32} color="var(--sage-dark)" />
          <p>Your garden is waiting! Earn petals by using the app, then plant flowers here.</p>
        </div>
      )}

      <div className="flower-shop">
        <h3 className="section-title">Plant something</h3>
        <div className="shop-grid">
          {FLOWERS.map(flower => {
            const canAfford = garden.petals >= flower.cost;
            return (
              <button
                key={flower.id}
                className={`shop-item ${canAfford ? '' : 'locked'}`}
                onClick={() => canAfford && handlePlant(flower)}
                disabled={!canAfford}
              >
                <span className="shop-emoji">{flower.emoji}</span>
                <span className="shop-name">{flower.name}</span>
                <span className="shop-cost">🌸 {flower.cost}</span>
                <span className="shop-desc">{flower.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GardenPage;
