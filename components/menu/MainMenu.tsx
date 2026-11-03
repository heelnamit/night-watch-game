'use client';
import { useState } from 'react';
import Link from 'next/link';
import HowToPlayModal from './HowToPlayModal';
import HighScoresModal from './HighScoresModal';

export default function MainMenu() {
  const [showHowTo, setShowHowTo] = useState(false);
  const [showScores, setShowScores] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background border-[10px] border-accent/20">
      <h1 className="text-6xl font-bold mb-4 text-white tracking-widest uppercase">NIGHT WATCH</h1>
      <p className="text-xl mb-2 text-gray-400">"THE BUILDING NEVER SLEEPS"</p>
      <p className="max-w-md text-sm text-gray-500 mb-8 leading-relaxed">
        Your shift begins at midnight. Monitor the cameras. Report anything unusual.
        Whatever you do, don't look away.
      </p>

      <div className="flex flex-col gap-4 w-64">
        <Link href="/game" className="py-3 px-6 bg-cctv-green text-black font-bold uppercase hover:bg-white transition-colors">
          Start Shift
        </Link>
        <button onClick={() => setShowHowTo(true)} className="py-3 px-6 border border-gray-600 text-gray-300 uppercase hover:bg-gray-800 transition-colors">
          How to Play
        </button>
        <button onClick={() => setShowScores(true)} className="py-3 px-6 border border-gray-600 text-gray-300 uppercase hover:bg-gray-800 transition-colors">
          High Scores
        </button>
      </div>

      <div className="mt-12 text-xs text-gray-600 font-mono tracking-tighter">
        <p>LOCATION: BLACKWOOD APARTMENTS</p>
        <p>SYSTEM STATUS: ONLINE</p>
        <p>SHIFT: 12:00 AM – 06:00 AM</p>
      </div>

      <HowToPlayModal isOpen={showHowTo} onClose={() => setShowHowTo(false)} />
      <HighScoresModal isOpen={showScores} onClose={() => setShowScores(false)} />
    </div>
  );
}
