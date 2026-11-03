# Night Watch

A browser-based anomaly detection game set in Blackwood Apartments. Monitor the security cameras, spot changes in the building, and report anomalies before they disappear.

## How to play

1. Select **Start Shift** from the main menu.
2. Monitor the four camera feeds: main entrance, apartment corridor, basement, and parking area.
3. Select a camera and choose **Report Anomaly** when you spot something unusual.
4. Finish the six-minute shift to win. Missing three anomalies ends the shift.

The game becomes more challenging as the shift progresses. Anomalies appear for a limited time, so inspect the camera feeds carefully.

### Scoring

- Correct report: **+100 points**
- Incorrect report: **−50 points** (score cannot drop below zero)
- Missed anomaly: lose one of your three lives

The High Scores menu keeps the top ten results in the current browser's local storage. Scores are not shared across browsers or devices.

## Run locally

### Requirements

- Node.js (LTS recommended)
- npm

### Install and start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production server (after `npm run build`) |
| `npm run lint` | Run ESLint |

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Zustand for game state
- Tailwind CSS for styling
- Framer Motion for animations

## Project structure

```text
app/                  Next.js routes and global styles
components/game/      Camera feeds, controls, status, and game screens
components/menu/      Main menu and informational modals
data/                 Camera configuration
game/                 Anomaly definitions and spawn engine
store/                Zustand game state and scoring
types/                Shared TypeScript types
```
