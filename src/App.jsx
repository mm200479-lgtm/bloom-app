import React, { useState, useEffect } from 'react';
import { Home, SmilePlus, ListTodo, Wind, MoreHorizontal } from 'lucide-react';
import { getSettings, getActiveProfile, setActiveProfile } from './utils/storage';
import { isFirebaseConfigured, onAuthChange, completeMagicLinkSignIn } from './utils/firebase';
import { setSyncUserId, pullFromCloud } from './utils/sync';
import ProfilePage from './pages/ProfilePage';
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
  const [profile, setProfile] = useState(getActiveProfile());
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState({ theme: 'light', colorScheme: 'lavender' });
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Firebase auth listener
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    // Check if returning from a magic link click
    completeMagicLinkSignIn().then(user => {
      if (user) setFirebaseUser(user);
    }).catch(() => {});

    const unsub = onAuthChange((user) => {
      setFirebaseUser(user);
      if (user) {
        setSyncUserId(user.uid);
        setSyncing(true);
        pullFromCloud().then(() => {
          setSyncing(false);
          setProfile(getActiveProfile());
        });
      } else {
        setSyncUserId(null);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (profile) {
      setSettings(getSettings());
    }
  }, [profile]);

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

  const handleSwitchProfile = () => {
    setProfile(null);
    setActiveTab('home');
  };

  const handleProfileSelected = (p) => {
    setProfile(p);
    setSettings(getSettings());
    // Sync this profile's data if signed in
    if (firebaseUser) {
      setSyncing(true);
      pullFromCloud().then(() => setSyncing(false));
    }
  };

  // Show profile picker if no active profile
  if (!profile) {
    return <ProfilePage onProfileSelected={handleProfileSelected} firebaseUser={firebaseUser} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={handleNavigate} profile={profile} syncing={syncing} firebaseUser={firebaseUser} />;
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
      case 'settings': return <SettingsPage onSettingsChange={handleSettingsChange} onSwitchProfile={handleSwitchProfile} profile={profile} firebaseUser={firebaseUser} />;
      case 'more': return <MorePage onNavigate={handleNavigate} profile={profile} />;
      default: return <HomePage onNavigate={handleNavigate} profile={profile} />;
    }
  };

  return (
    <>
      <main className="app-content">
        {syncing && (
          <div className="sync-banner">☁️ Syncing your data...</div>
        )}
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
