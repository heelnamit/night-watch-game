'use client';

import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HighScoresModal({ isOpen, onClose }: ModalProps) {
  const { highScores, loadHighScores } = useGameStore();

  useEffect(() => {
    if (isOpen) loadHighScores();
  }, [isOpen, loadHighScores]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-accent p-8 rounded-none border border-cctv-green max-w-lg w-full">
        <h2 className="text-2xl mb-4 text-cctv-green uppercase">High Scores</h2>
        <div className="text-gray-400 text-sm mb-6">
          {highScores.length === 0 ? (
            <p className="text-center italic">No records found. Your shift has yet to begin.</p>
          ) : (
            <ol className="space-y-3">
              {highScores.map((record, index) => (
                <li key={`${record.date}-${index}`} className="flex items-center justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="font-bold text-white">{record.score}</span>
                  <span className={record.result === 'VICTORY' ? 'text-cctv-green' : 'text-warning'}>
                    {record.result === 'VICTORY' ? 'COMPLETED' : 'TERMINATED'}
                  </span>
                  <time dateTime={record.date}>{new Date(record.date).toLocaleDateString()}</time>
                </li>
              ))}
            </ol>
          )}
        </div>
        <button onClick={onClose} className="w-full py-2 bg-warning text-white uppercase font-bold hover:bg-red-900 transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
