# 🌸 Bloom

**A gentle mental health companion app** — built with love for teens managing ADHD, anxiety, depression, and PTSD.

## Features

- **💜 Mood Check-ins** — Simple emoji-based tracking with notes and history
- **✨ ADHD-Friendly Task Manager** — Break things into tiny steps with celebration animations
- **📝 Journal** — Free writing, guided prompts, gratitude lists, and worry dumps
- **🌊 Calm Corner** — Box breathing, 5-4-3-2-1 grounding, body scan, butterfly hug, safe place visualization
- **🛡️ Safety Plan** — Crisis contacts, coping strategies, safe spaces, and reasons to keep going
- **🔥 Streaks** — Gentle encouragement for consistent check-ins

## Design Philosophy

- Soft, calming colors (not overstimulating)
- Low cognitive load navigation
- Encouraging, non-judgmental tone
- All data stays on device (localStorage only)
- Works on mobile browsers

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Cloud Sync (Optional — for multiple devices)

To sync data across iPhone, iPad, and other devices:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Sign-in method → **Google**
3. Enable **Cloud Firestore** → Create database → Start in **test mode**
4. Go to Project Settings → Your apps → Add a **Web app**
5. Copy the config values and create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

6. For GitHub Pages deployment, add these as **Repository Secrets** in GitHub Settings → Secrets → Actions, then update the workflow to pass them as build args.

Without Firebase configured, the app works perfectly in offline/local mode — all data stays on the device.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy anywhere.

## Privacy

All data is stored locally in your browser. Nothing is sent to any server. Your thoughts and feelings are yours alone. 💜

## Tech Stack

- React 19
- Vite
- Lucide React (icons)
- CSS (no heavy frameworks — keeps it fast and light)
