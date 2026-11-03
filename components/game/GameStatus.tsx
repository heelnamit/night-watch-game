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
    <div className="flex flex-col border-b border-gray-800 bg-accent/30 font-mono text-xs">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 items-center">
        <div className="p-2 border border-gray-800">
          <p className="text-gray-500">SHIFT PROGRESS</p>
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-bold">{progress}%</p>
            <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cctv-green h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-2 border border-gray-800">
          <p className="text-gray-500">SCORE</p>
          <p className="text-white text-sm font-bold">{score}</p>
        </div>

        <div className="p-2 border border-gray-800">
          <p className="text-gray-500">DETECTED</p>
          <p className="text-cctv-green text-sm font-bold">{detectedAnomalies}</p>
        </div>

        <div className="p-2 border border-gray-800">
          <p className="text-gray-500">MISSED</p>
          <p className="text-warning text-sm font-bold">{missedAnomalies}</p>
        </div>

        <div className="p-2 border border-gray-800">
          <p className="text-gray-500">LIVES</p>
          <p className="text-white text-sm font-bold">
            {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
          <button
            onClick={handleReport}
            disabled={gameStatus !== 'PLAYING'}
            className={`w-full py-2.5 font-bold uppercase transition-all border ${
              gameStatus === 'PLAYING'
                ? 'bg-cctv-green/10 border-cctv-green text-cctv-green hover:bg-cctv-green hover:text-black cursor-pointer shadow-[0_0_10px_rgba(61,237,151,0.2)]'
                : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
            }`}
          >
            Report Anomaly
          </button>
        </div>
      </div>

      {/* Activity Log / Feedback Bar */}
      <div className="px-4 py-1.5 bg-black/40 border-t border-gray-800/50 flex justify-between items-center text-[11px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-gray-500 font-bold shrink-0">LOG:</span>
          {feedback ? (
            <span className={`font-bold animate-pulse ${feedback.type === 'success' ? 'text-cctv-green' : 'text-warning'}`}>
              {feedback.message}
            </span>
          ) : latestLog ? (
            <span className={latestLog.type === 'success' ? 'text-cctv-green' : latestLog.type === 'warning' ? 'text-warning' : 'text-gray-400'}>
              {latestLog.message}
            </span>
          ) : (
            <span className="text-gray-600">Monitoring feeds...</span>
          )}
        </div>
        <span className="text-gray-600 shrink-0 text-[10px]">SELECTED: {selectedCameraId}</span>
      </div>
    </div>
  );
}
