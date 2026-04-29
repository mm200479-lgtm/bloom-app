import React, { useState } from 'react';
import { Home, SmilePlus, ListTodo, BookHeart, Shield, Wind, Sparkles } from 'lucide-react';
import HomePage from './pages/HomePage';
import MoodPage from './pages/MoodPage';
import TasksPage from './pages/TasksPage';
import JournalPage from './pages/JournalPage';
import SafetyPage from './pages/SafetyPage';
import GroundingPage from './pages/GroundingPage';
import './App.css';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mood', label: 'Mood', icon: SmilePlus },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'journal', label: 'Journal', icon: BookHeart },
  { id: 'grounding', label: 'Calm', icon: Wind },
  { id: 'safety', label: 'Safety', icon: Shield },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} />;
      case 'mood': return <MoodPage />;
      case 'tasks': return <TasksPage />;
      case 'journal': return <JournalPage />;
      case 'grounding': return <GroundingPage />;
      case 'safety': return <SafetyPage />;
      default: return <HomePage onNavigate={setActiveTab} />;
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
              onClick={() => setActiveTab(tab.id)}
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
