import React, { useState, useEffect } from 'react';
import { Droplets, UtensilsCrossed, Activity, Plus, Minus, Check } from 'lucide-react';
import { getWaterLog, saveWaterLog, getMealLog, saveMealLog, getMovementLog, saveMovementLog, addPetals } from '../utils/storage';
import './SelfCarePage.css';

const MOVEMENT_TYPES = ['walk', 'dance', 'stretch', 'yoga', 'sport', 'other'];
const MEALS = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch', label: 'Lunch', emoji: '☀️' },
  { key: 'dinner', label: 'Dinner', emoji: '🌙' },
  { key: 'snack', label: 'Snack', emoji: '🍎' },
];

function SelfCarePage({ onBack }) {
  const today = new Date().toDateString();
  const [water, setWater] = useState({ date: null, cups: 0, goal: 8, history: [] });
  const [meals, setMeals] = useState({ date: null, meals: {}, history: [] });
  const [movement, setMovement] = useState({ date: null, moved: false, type: '', history: [] });
  const [petalsEarned, setPetalsEarned] = useState(false);

  useEffect(() => {
    let w = getWaterLog();
    if (w.date !== today) { w = { ...w, date: today, cups: 0 }; saveWaterLog(w); }
    setWater(w);

    let m = getMealLog();
    if (m.date !== today) { m = { ...m, date: today, meals: {} }; saveMealLog(m); }
    setMeals(m);

    let mv = getMovementLog();
    if (mv.date !== today) { mv = { ...mv, date: today, moved: false, type: '' }; saveMovementLog(mv); }
    setMovement(mv);
  }, []);

  const addCup = () => {
    const updated = { ...water, cups: Math.min(water.cups + 1, 20) };
    saveWaterLog(updated);
    setWater(updated);
    checkAllDone(updated, meals, movement);
  };

  const removeCup = () => {
    const updated = { ...water, cups: Math.max(water.cups - 1, 0) };
    saveWaterLog(updated);
    setWater(updated);
  };

  const toggleMeal = (key) => {
    const updated = { ...meals, meals: { ...meals.meals, [key]: !meals.meals[key] } };
    saveMealLog(updated);
    setMeals(updated);
    checkAllDone(water, updated, movement);
  };

  const toggleMovement = () => {
    const updated = { ...movement, moved: !movement.moved };
    if (!updated.moved) updated.type = '';
    saveMovementLog(updated);
    setMovement(updated);
    checkAllDone(water, meals, updated);
  };

  const setMovementType = (type) => {
    const updated = { ...movement, type, moved: true };
    saveMovementLog(updated);
    setMovement(updated);
    checkAllDone(water, meals, updated);
  };

  const checkAllDone = (w, m, mv) => {
    const waterDone = w.cups >= w.goal;
    const mealsDone = MEALS.every(ml => m.meals[ml.key]);
    const moveDone = mv.moved;
    if (waterDone && mealsDone && moveDone && !petalsEarned) {
      addPetals(5);
      setPetalsEarned(true);
    }
  };

  const waterPercent = Math.min((water.cups / water.goal) * 100, 100);
  const mealsChecked = MEALS.filter(m => meals.meals[m.key]).length;

  return (
    <div className="selfcare-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Self-Care Check 💛</h1>
        <p className="page-subtitle">Basic needs matter — did you take care of you today?</p>
      </header>

      {petalsEarned && (
        <div className="selfcare-bonus slide-up">🌟 All self-care done! +5 petals 🌸</div>
      )}

      {/* Water Section */}
      <div className="selfcare-section card fade-in">
        <div className="section-header-row">
          <Droplets size={18} color="#64b5f6" />
          <h3 className="section-title">Water</h3>
          <span className="section-count">{water.cups}/{water.goal} cups</span>
        </div>
        <div className="water-progress">
          <div className="water-bar">
            <div className="water-fill" style={{ width: `${waterPercent}%` }} />
          </div>
          {waterPercent >= 100 && <span className="water-done">💧 Goal reached!</span>}
        </div>
        <div className="water-controls">
          <button className="water-btn minus" onClick={removeCup} aria-label="Remove cup"><Minus size={16} /></button>
          <div className="water-cups">
            {Array.from({ length: water.goal }).map((_, i) => (
              <span key={i} className={`water-cup ${i < water.cups ? 'filled' : ''}`}>💧</span>
            ))}
          </div>
          <button className="water-btn plus" onClick={addCup} aria-label="Add cup"><Plus size={16} /></button>
        </div>
      </div>

      {/* Meals Section */}
      <div className="selfcare-section card fade-in">
        <div className="section-header-row">
          <UtensilsCrossed size={18} color="#ffb74d" />
          <h3 className="section-title">Did I eat?</h3>
          <span className="section-count">{mealsChecked}/{MEALS.length}</span>
        </div>
        <div className="meals-grid">
          {MEALS.map(m => (
            <button
              key={m.key}
              className={`meal-btn ${meals.meals[m.key] ? 'checked' : ''}`}
              onClick={() => toggleMeal(m.key)}
            >
              <span className="meal-emoji">{m.emoji}</span>
              <span className="meal-label">{m.label}</span>
              {meals.meals[m.key] && <Check size={14} className="meal-check" />}
            </button>
          ))}
        </div>
        <p className="meals-note">No judgment — just awareness. Even a small snack counts. 💛</p>
      </div>

      {/* Movement Section */}
      <div className="selfcare-section card fade-in">
        <div className="section-header-row">
          <Activity size={18} color="#81c784" />
          <h3 className="section-title">Did I move my body?</h3>
        </div>
        <button
          className={`movement-toggle ${movement.moved ? 'active' : ''}`}
          onClick={toggleMovement}
        >
          {movement.moved ? '✅ Yes!' : 'Tap if you moved today'}
        </button>
        {movement.moved && (
          <div className="movement-types slide-up">
            <span className="movement-label">What kind?</span>
            <div className="movement-options">
              {MOVEMENT_TYPES.map(t => (
                <button
                  key={t}
                  className={`movement-type-btn ${movement.type === t ? 'active' : ''}`}
                  onClick={() => setMovementType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="movement-note">Any movement counts — even a short walk or stretching in bed.</p>
      </div>
    </div>
  );
}

export default SelfCarePage;
