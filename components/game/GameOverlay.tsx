'use client';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from './AudioController';
import Link from 'next/link';

export default function GameOverlay() {
  const { gameStatus, score, startGame } = useGameStore();

  if (gameStatus === 'PLAYING' || gameStatus === 'PAUSED' || gameStatus === 'MENU') return null;

  const isVictory = gameStatus === 'VICTORY';

  const getGrade = (score: number) => {
    if (score >= 500) return 'S';
    if (score >= 400) return 'A';
    if (score >= 300) return 'B';
    if (score >= 200) return 'C';
    return 'D';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full border-2 p-8 text-center font-mono ${isVictory ? 'border-cctv-green bg-[#010501]' : 'border-red-900 bg-[#050101]'}`}
        >
          <div className="mb-6">
            <h2 className={`text-5xl font-black mb-2 tracking-widest ${isVictory ? 'text-cctv-green' : 'text-red-600'}`}>
              {isVictory ? 'SHIFT COMPLETED' : 'TERMINATED'}
            </h2>
            <p className="text-gray-500 uppercase text-xs tracking-tighter">
              {isVictory
                ? 'You survived the night at Blackwood.'
                : 'Multiple anomalies were missed. The building is compromised.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left border-y border-gray-800 py-6">
            <div>
              <p className="text-gray-600 text-[10px] tracking-widest uppercase">Score</p>
              <p className="text-3xl text-white font-bold">{score}</p>
            </div>
            <div>
              <p className="text-gray-600 text-[10px] tracking-widest uppercase">Performance</p>
              <p className={`text-3xl font-bold ${isVictory ? 'text-cctv-green' : 'text-red-600'}`}>
                {isVictory ? getGrade(score) : 'F'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                startGame();
              }}
              className={`py-4 font-bold uppercase tracking-widest transition-all ${
                isVictory
                  ? 'bg-cctv-green text-black hover:bg-white'
                  : 'bg-red-900 text-white hover:bg-red-700'
              }`}
            >
              Start New Shift
            </button>
            <Link
              href="/"
              onClick={() => soundEngine.playClick()}
              className="py-3 border border-gray-800 text-gray-500 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              Return To Menu
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
