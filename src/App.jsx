import React, { useState, useEffect } from 'react';
import { Home, SmilePlus, ListTodo, Wind, MoreHorizontal } from 'lucide-react';
import { getSettings, getActiveProfile } from './utils/storage';
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
import SleepPage from './pages/SleepPage';
import MedsPage from './pages/MedsPage';
import HomeworkPage from './pages/HomeworkPage';
import GoalsPage from './pages/GoalsPage';
import LettersPage from './pages/LettersPage';
import PeriodPage from './pages/PeriodPage';
import DBTPage from './pages/DBTPage';
import LearnPage from './pages/LearnPage';
import SelfCarePage from './pages/SelfCarePage';
import SocialBatteryPage from './pages/SocialBatteryPage';
import ScriptsPage from './pages/ScriptsPage';
import ThoughtPage from './pages/ThoughtPage';
import NightmarePage from './pages/NightmarePage';
import BrainDumpPage from './pages/BrainDumpPage';
import AppointmentsPage from './pages/AppointmentsPage';
import QuotesPage from './pages/QuotesPage';
import BucketListPage from './pages/BucketListPage';
import DistractionPage from './pages/DistractionPage';
import BodyMapPage from './pages/BodyMapPage';
import DebriefPage from './pages/DebriefPage';
import AngryPage from './pages/AngryPage';
import WorryTimePage from './pages/WorryTimePage';
import UrgeSurfPage from './pages/UrgeSurfPage';
import DreamPage from './pages/DreamPage';
import RewardMenuPage from './pages/RewardMenuPage';
import PlaylistPage from './pages/PlaylistPage';
import SensoryPage from './pages/SensoryPage';
import AchievementsPage from './pages/AchievementsPage';
import InsightsPage from './pages/InsightsPage';
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

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    completeMagicLinkSignIn().then(user => { if (user) setFirebaseUser(user); }).catch(() => {});
    const unsub = onAuthChange((user) => {
      setFirebaseUser(user);
      if (user) {
        setSyncUserId(user.uid);
        setSyncing(true);
        pullFromCloud().then(() => { setSyncing(false); setProfile(getActiveProfile()); });
      } else { setSyncUserId(null); }
    });
    return unsub;
  }, []);

  useEffect(() => { if (profile) setSettings(getSettings()); }, [profile]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', settings.theme === 'dark');
    if (settings.colorScheme) root.setAttribute('data-color', settings.colorScheme);
  }, [settings]);

  const nav = (tab) => { setActiveTab(tab); window.scrollTo(0, 0); };

  const handleProfileSelected = (p) => {
    setProfile(p); setSettings(getSettings());
    if (firebaseUser) { setSyncing(true); pullFromCloud().then(() => setSyncing(false)); }
  };

  if (!profile) return <ProfilePage onProfileSelected={handleProfileSelected} firebaseUser={firebaseUser} />;

  const PAGE_MAP = {
    home: <HomePage onNavigate={nav} profile={profile} syncing={syncing} firebaseUser={firebaseUser} />,
    mood: <MoodPage />, tasks: <TasksPage />, journal: <JournalPage />,
    grounding: <GroundingPage />, safety: <SafetyPage />, routines: <RoutinePage />,
    pomodoro: <PomodoroPage />, coping: <CopingCardsPage />, emotions: <EmotionWheelPage />,
    sounds: <SoundMachinePage />, triggers: <TriggerPage />, activity: <ActivityPage />,
    photos: <PhotoJournalPage />, energy: <EnergyPage />, wins: <WinJarPage />,
    garden: <GardenPage />,
    settings: <SettingsPage onSettingsChange={setSettings} onSwitchProfile={() => { setProfile(null); setActiveTab('home'); }} profile={profile} firebaseUser={firebaseUser} />,
    more: <MorePage onNavigate={nav} profile={profile} />,
    sleep: <SleepPage />, meds: <MedsPage />, homework: <HomeworkPage />,
    goals: <GoalsPage />, letters: <LettersPage />, period: <PeriodPage />,
    dbt: <DBTPage />, learn: <LearnPage />, selfcare: <SelfCarePage />,
    social: <SocialBatteryPage />, scripts: <ScriptsPage />, thought: <ThoughtPage />,
    nightmares: <NightmarePage />, braindump: <BrainDumpPage />,
    appointments: <AppointmentsPage />, quotes: <QuotesPage />,
    bucketlist: <BucketListPage />, distraction: <DistractionPage />,
    bodymap: <BodyMapPage />, debrief: <DebriefPage />, angry: <AngryPage />,
    worrytime: <WorryTimePage />, urgesurf: <UrgeSurfPage />, dreams: <DreamPage />,
    rewardmenu: <RewardMenuPage />, playlists: <PlaylistPage />,
    sensory: <SensoryPage />, achievements: <AchievementsPage />, insights: <InsightsPage />,
  };

  return (
    <>
      <main className="app-content">
        {syncing && <div className="sync-banner">☁️ Syncing your data...</div>}
        {PAGE_MAP[activeTab] || <HomePage onNavigate={nav} profile={profile} />}
      </main>
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => nav(tab.id)} aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}>
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
