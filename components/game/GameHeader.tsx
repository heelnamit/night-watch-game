'use client';
import Link from 'next/link';
import GameTimer from './GameTimer';
import AudioController, { soundEngine } from './AudioController';
import { useGameStore } from '../../store/gameStore';

export default function GameHeader() {
  const gameStatus = useGameStore(state => state.gameStatus);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-accent/50 flex-wrap gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-white">NIGHT WATCH</h1>
        <p className="text-xs text-gray-400">BLACKWOOD APARTMENTS</p>
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        <AudioController />
        <span className="flex items-center gap-1 text-xs text-cctv-green">
          <span className={`w-2 h-2 rounded-full ${gameStatus === 'PLAYING' ? 'bg-cctv-green animate-pulse' : 'bg-gray-500'}`}></span>
          {gameStatus === 'PLAYING' ? 'SYSTEM ONLINE' : 'SYSTEM PAUSED'}
        </span>
        <GameTimer />
      </div>
      <Link
        href="/"
        onClick={() => soundEngine.playClick()}
        className="px-4 py-2 bg-warning text-white font-bold text-xs uppercase hover:bg-red-900 transition-colors"
      >
        Exit Shift
      </Link>
    </header>
  );
}
