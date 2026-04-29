import React, { useState, useEffect } from 'react';
import { Home, SmilePlus, ListTodo, BookHeart, Shield, Wind, Sparkles, Settings, MoreHorizontal } from 'lucide-react';
import { getSettings } from './utils/storage';
import HomePage from './pages/HomePage';
import MoodPage from './pages/MoodPage';
import TasksPage from './pages/TasksPage';
import JournalPage from './pages/JournalPage';
import SafetyPage from './pages/SafetyPage';
import GroundingPage from './pages/GroundingPage';
import RoutinePage from './pages/RoutinePage';
import PomodoroPage from './pages/PomodoroPage';
import CopingCardsPage from './pages/CopingCardsPage';
import EmotionWheelPage from './pages/EmotionWheelPage';
import SoundMachinePage from './pages/SoundMachinePage';
import TriggerPage from './pages/TriggerPage';
import ActivityPage from './pages/ActivityPage';
import PhotoJournalPage from './pages/PhotoJournalPage';
import EnergyPage from './pages/EnergyPage';
import WinJarPage from './pages/WinJarPage';
import GardenPage from './pages/GardenPage';
import SettingsPage from './pages/SettingsPage';
import MorePage from './pages/MorePage';
import './App.css';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mood', label: 'Mood', icon: SmilePlus },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'grounding', label: 'Calm', icon: Wind },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    if (settings.colorScheme) {
      root.setAttribute('data-color', settings.colorScheme);
    }
  }, [settings]);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'mood': return <MoodPage />;
      case 'tasks': return <TasksPage />;
      case 'journal': return <JournalPage />;
      case 'grounding': return <GroundingPage />;
      case 'safety': return <SafetyPage />;
      case 'routines': return <RoutinePage />;
      case 'pomodoro': return <PomodoroPage />;
      case 'coping': return <CopingCardsPage />;
      case 'emotions': return <EmotionWheelPage />;
      case 'sounds': return <SoundMachinePage />;
      case 'triggers': return <TriggerPage />;
      case 'activity': return <ActivityPage />;
      case 'photos': return <PhotoJournalPage />;
      case 'energy': return <EnergyPage />;
      case 'wins': return <WinJarPage />;
      case 'garden': return <GardenPage />;
      case 'settings': return <SettingsPage onSettingsChange={handleSettingsChange} />;
      case 'more': return <MorePage onNavigate={handleNavigate} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <main className="app-content">
        {renderPage()}
      </main>
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigate(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default App;
