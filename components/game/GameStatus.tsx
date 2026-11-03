'use client';
import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function GameStatus() {
  const {
    remainingTime,
    detectedAnomalies,
    missedAnomalies,
    lives,
    selectedCameraId,
    reportAnomaly,
    gameStatus,
    score,
    activityLog
  } = useGameStore();

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const progress = Math.min(100, Math.round(((360 - remainingTime) / 360) * 100));
  const tension = progress / 100;

  const handleReport = () => {
    if (gameStatus !== 'PLAYING') return;

    // Check if there's an anomaly before calling store to show visual feedback
    const activeAnomalies = useGameStore.getState().activeAnomalies;
    const hasAnomaly = activeAnomalies.some(a => a.cameraId === selectedCameraId);

    reportAnomaly(selectedCameraId);

    if (hasAnomaly) {
      setFeedback({ message: 'ANOMALY CONFIRMED & PURGED', type: 'success' });
    } else {
      setFeedback({ message: 'FALSE REPORT - NO ANOMALY DETECTED', type: 'error' });
    }

    setTimeout(() => {
      setFeedback(null);
    }, 2000);
  };

  const latestLog = activityLog[activityLog.length - 1];

  return (
    <div className="flex flex-col border-b border-gray-800 bg-accent/30 font-mono text-xs z-30">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 items-center">
        <div className="p-2 border border-gray-800 relative overflow-hidden bg-black/20">
          <p className="text-gray-500 relative z-10">SHIFT PROGRESS</p>
          <div className="flex items-center gap-2 relative z-10">
            <p className="text-white text-sm font-bold">{progress}%</p>
            <div className="flex-1 bg-gray-900 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-300 ${tension > 0.8 ? 'bg-red-600 animate-pulse' : 'bg-cctv-green'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          {/* Tension overlay for progress box */}
          <div className="absolute inset-0 bg-red-950/10 pointer-events-none" style={{ opacity: Math.max(0, tension - 0.5) }}></div>
        </div>

        <div className="p-2 border border-gray-800 bg-black/20">
          <p className="text-gray-500">SCORE</p>
          <p className="text-white text-sm font-bold tracking-widest">{score}</p>
        </div>

        <div className="p-2 border border-gray-800 bg-black/20">
          <p className="text-gray-500">DETECTED</p>
          <p className="text-cctv-green text-sm font-bold">{detectedAnomalies}</p>
        </div>

        <div className="p-2 border border-gray-800 bg-black/20">
          <p className="text-gray-500">MISSED</p>
          <p className="text-warning text-sm font-bold">{missedAnomalies}</p>
        </div>

        <div className={`p-2 border transition-colors bg-black/20 ${lives === 1 ? 'border-red-600 animate-pulse' : 'border-gray-800'}`}>
          <p className="text-gray-500">LIVES</p>
          <p className="text-white text-sm font-bold flex gap-1">
             {[...Array(3)].map((_, i) => (
                <span key={i} className={`transition-opacity ${i < lives ? 'opacity-100 text-red-500' : 'opacity-20 grayscale'}`}>
                   {i < lives ? '❤' : '❤'}
                </span>
             ))}
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
          <button
            onClick={handleReport}
            disabled={gameStatus !== 'PLAYING'}
            className={`w-full py-2.5 font-bold uppercase transition-all border ${
              gameStatus === 'PLAYING'
                ? 'bg-cctv-green/10 border-cctv-green text-cctv-green hover:bg-cctv-green hover:text-black cursor-pointer shadow-[0_0_15px_rgba(61,237,151,0.2)]'
                : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
            }`}
          >
            Report Anomaly
          </button>
        </div>
      </div>

      {/* Activity Log / Feedback Bar */}
      <div className="px-4 py-2 bg-black/60 border-t border-gray-800/50 flex justify-between items-center text-[11px] min-h-[32px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-gray-500 font-bold shrink-0 tracking-tighter bg-gray-900 px-1 border border-gray-800">SYSTEM_LOG</span>
          {feedback ? (
            <span className={`font-black tracking-widest animate-[pulse_0.5s_infinite] ${feedback.type === 'success' ? 'text-cctv-green' : 'text-red-500'}`}>
              &gt;&gt; {feedback.message}
            </span>
          ) : latestLog ? (
            <span className={`transition-colors duration-500 ${latestLog.type === 'success' ? 'text-cctv-green' : latestLog.type === 'warning' ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
              {latestLog.message}
            </span>
          ) : (
            <span className="text-gray-600 italic">Standby... Monitoring feed patterns...</span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
           <span className="text-gray-600 text-[10px] hidden md:inline">ENCRYPTED_LINE_77</span>
           <span className="text-cctv-green/70 font-bold border-l border-gray-800 pl-4">{selectedCameraId}</span>
        </div>
      </div>
    </div>
  );
}
