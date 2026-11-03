'use client';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameOverlay() {
  const { gameStatus, score, detectedAnomalies, missedAnomalies, falseReports, startGame } = useGameStore();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md w-full border-2 p-8 text-center font-mono ${isVictory ? 'border-cctv-green' : 'border-warning'}`}
      >
        <h2 className={`text-4xl font-bold mb-2 ${isVictory ? 'text-cctv-green' : 'text-warning'}`}>
          {isVictory ? 'SHIFT COMPLETED' : 'TERMINATED'}
        </h2>
        <p className="text-gray-400 mb-8 uppercase text-sm">
          {isVictory ? 'You survived the night at Blackwood.' : 'Multiple anomalies were missed. The building is compromised.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left border-y border-gray-800 py-6">
          <div>
            <p className="text-gray-500 text-[10px]">FINAL SCORE</p>
            <p className="text-2xl text-white font-bold">{score}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px]">GRADE</p>
            <p className={`text-2xl font-bold ${isVictory ? 'text-cctv-green' : 'text-warning'}`}>
              {isVictory ? getGrade(score) : 'F'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px]">DETECTED</p>
            <p className="text-xl text-white">{detectedAnomalies}</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px]">MISSED</p>
            <p className="text-xl text-white">{missedAnomalies}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => startGame()}
            className={`py-3 font-bold uppercase transition-colors ${
              isVictory
                ? 'bg-cctv-green text-black hover:bg-white'
                : 'bg-warning text-white hover:bg-red-700'
            }`}
          >
            New Shift
          </button>
          <a
            href="/"
            className="py-3 border border-gray-700 text-gray-400 font-bold uppercase hover:bg-gray-900 transition-colors"
          >
            Main Menu
          </a>
        </div>
      </motion.div>
    </div>
  );
}
