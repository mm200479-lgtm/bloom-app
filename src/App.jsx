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
// New pages
import DailyCheckinPage from './pages/DailyCheckinPage';
import EmergencyPage from './pages/EmergencyPage';
import TherapistReportPage from './pages/TherapistReportPage';
import CustomAffirmationsPage from './pages/CustomAffirmationsPage';
import ComfortMediaPage from './pages/ComfortMediaPage';
import SafePeoplePage from './pages/SafePeoplePage';
import ValuesPage from './pages/ValuesPage';
import StrengthsPage from './pages/StrengthsPage';
import IdentityPage from './pages/IdentityPage';
import BoundariesPage from './pages/BoundariesPage';
import TimeCapsulePage from './pages/TimeCapsulePage';
import BadDayPage from './pages/BadDayPage';
import FidgetPage from './pages/FidgetPage';
import ColorTherapyPage from './pages/ColorTherapyPage';
import TestAnxietyPage from './pages/TestAnxietyPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import StickerBoardPage from './pages/StickerBoardPage';
import ParentGuidePage from './pages/ParentGuidePage';
import HolidaySurvivalPage from './pages/HolidaySurvivalPage';
import ComplimentPage from './pages/ComplimentPage';
// Game pages
import GamesHubPage from './pages/games/GamesHubPage';
import ColorBookPage from './pages/games/ColorBookPage';
import DotsBoxesPage from './pages/games/DotsBoxesPage';
import BreathBubblePage from './pages/games/BreathBubblePage';
import WordSearchPage from './pages/games/WordSearchPage';
import TapStarsPage from './pages/games/TapStarsPage';
import MemoryMatchPage from './pages/games/MemoryMatchPage';
import ZenGardenPage from './pages/games/ZenGardenPage';
import BubblePopPage from './pages/games/BubblePopPage';
import ColorFloodPage from './pages/games/ColorFloodPage';
import JigsawPage from './pages/games/JigsawPage';
import DoodlePadPage from './pages/games/DoodlePadPage';
import FirefliesPage from './pages/games/FirefliesPage';
import GratitudeBingoPage from './pages/games/GratitudeBingoPage';
import EmojiStoryPage from './pages/games/EmojiStoryPage';
import PixelArtPage from './pages/games/PixelArtPage';
import RainWindowPage from './pages/games/RainWindowPage';
import StackBlocksPage from './pages/games/StackBlocksPage';
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
  const [navHistory, setNavHistory] = useState([]);
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

  const nav = (tab) => {
    // Push current page to history before navigating (unless going to same page)
    if (tab !== activeTab) {
      setNavHistory(prev => [...prev, activeTab]);
    }
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const back = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(h => h.slice(0, -1));
      setActiveTab(prev);
    } else {
      setActiveTab('home');
    }
    window.scrollTo(0, 0);
  };

  const handleProfileSelected = (p) => {
    setProfile(p); setSettings(getSettings());
    if (firebaseUser) { setSyncing(true); pullFromCloud().then(() => setSyncing(false)); }
  };

  if (!profile) return <ProfilePage onProfileSelected={handleProfileSelected} firebaseUser={firebaseUser} />;

  const PAGE_MAP = {
    // Special pages
    home: <HomePage onNavigate={nav} profile={profile} syncing={syncing} firebaseUser={firebaseUser} />,
    settings: <SettingsPage onSettingsChange={setSettings} onSwitchProfile={() => { setProfile(null); setActiveTab('home'); }} profile={profile} firebaseUser={firebaseUser} />,
    more: <MorePage onNavigate={nav} profile={profile} />,
    // Existing pages
    mood: <MoodPage onBack={back} />,
    tasks: <TasksPage onBack={back} />,
    journal: <JournalPage onBack={back} />,
    grounding: <GroundingPage onBack={back} />,
    safety: <SafetyPage onBack={back} />,
    routines: <RoutinePage onBack={back} />,
    pomodoro: <PomodoroPage onBack={back} />,
    coping: <CopingCardsPage onBack={back} />,
    emotions: <EmotionWheelPage onBack={back} />,
    sounds: <SoundMachinePage onBack={back} />,
    triggers: <TriggerPage onBack={back} />,
    activity: <ActivityPage onBack={back} />,
    photos: <PhotoJournalPage onBack={back} />,
    energy: <EnergyPage onBack={back} />,
    wins: <WinJarPage onBack={back} />,
    garden: <GardenPage onBack={back} />,
    sleep: <SleepPage onBack={back} />,
    meds: <MedsPage onBack={back} />,
    homework: <HomeworkPage onBack={back} />,
    goals: <GoalsPage onBack={back} />,
    letters: <LettersPage onBack={back} />,
    period: <PeriodPage onBack={back} />,
    dbt: <DBTPage onBack={back} />,
    learn: <LearnPage onBack={back} />,
    selfcare: <SelfCarePage onBack={back} />,
    social: <SocialBatteryPage onBack={back} />,
    scripts: <ScriptsPage onBack={back} />,
    thought: <ThoughtPage onBack={back} />,
    nightmares: <NightmarePage onBack={back} />,
    braindump: <BrainDumpPage onBack={back} />,
    appointments: <AppointmentsPage onBack={back} />,
    quotes: <QuotesPage onBack={back} />,
    bucketlist: <BucketListPage onBack={back} />,
    distraction: <DistractionPage onBack={back} />,
    bodymap: <BodyMapPage onBack={back} />,
    debrief: <DebriefPage onBack={back} />,
    angry: <AngryPage onBack={back} />,
    worrytime: <WorryTimePage onBack={back} />,
    urgesurf: <UrgeSurfPage onBack={back} />,
    dreams: <DreamPage onBack={back} />,
    rewardmenu: <RewardMenuPage onBack={back} />,
    playlists: <PlaylistPage onBack={back} />,
    sensory: <SensoryPage onBack={back} />,
    achievements: <AchievementsPage onBack={back} />,
    insights: <InsightsPage onBack={back} />,
    // New pages
    dailycheckin: <DailyCheckinPage onBack={back} />,
    emergency: <EmergencyPage onBack={back} />,
    report: <TherapistReportPage onBack={back} />,
    affirmations: <CustomAffirmationsPage onBack={back} />,
    comfortmedia: <ComfortMediaPage onBack={back} />,
    safepeople: <SafePeoplePage onBack={back} />,
    values: <ValuesPage onBack={back} />,
    strengths: <StrengthsPage onBack={back} />,
    identity: <IdentityPage onBack={back} />,
    boundaries: <BoundariesPage onBack={back} />,
    timecapsule: <TimeCapsulePage onBack={back} />,
    badday: <BadDayPage onBack={back} />,
    fidget: <FidgetPage onBack={back} />,
    colortherapy: <ColorTherapyPage onBack={back} />,
    testanxiety: <TestAnxietyPage onBack={back} />,
    studyplanner: <StudyPlannerPage onBack={back} />,
    stickerboard: <StickerBoardPage onBack={back} />,
    parentguide: <ParentGuidePage onBack={back} />,
    holidaysurvival: <HolidaySurvivalPage onBack={back} />,
    compliment: <ComplimentPage onBack={back} />,
    // Game pages
    games: <GamesHubPage onNavigate={nav} onBack={back} />,
    colorbook: <ColorBookPage onBack={back} />,
    dotsboxes: <DotsBoxesPage onBack={back} />,
    breathbubble: <BreathBubblePage onBack={back} />,
    wordsearch: <WordSearchPage onBack={back} />,
    tapstars: <TapStarsPage onBack={back} />,
    memorymatch: <MemoryMatchPage onBack={back} />,
    zengarden: <ZenGardenPage onBack={back} />,
    bubblepop: <BubblePopPage onBack={back} />,
    colorflood: <ColorFloodPage onBack={back} />,
    jigsaw: <JigsawPage onBack={back} />,
    doodlepad: <DoodlePadPage onBack={back} />,
    fireflies: <FirefliesPage onBack={back} />,
    gratitudebingo: <GratitudeBingoPage onBack={back} />,
    emojistory: <EmojiStoryPage onBack={back} />,
    pixelart: <PixelArtPage onBack={back} />,
    rainwindow: <RainWindowPage onBack={back} />,
    stackblocks: <StackBlocksPage onBack={back} />,
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
              onClick={() => { setNavHistory([]); setActiveTab(tab.id); window.scrollTo(0, 0); }} aria-label={tab.label}
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
