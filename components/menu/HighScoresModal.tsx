'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HighScoresModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-accent p-8 rounded-none border border-cctv-green max-w-lg w-full">
        <h2 className="text-2xl mb-4 text-cctv-green uppercase">High Scores</h2>
        <div className="text-gray-400 text-sm mb-6">
          <p className="text-center italic">No records found. Your shift has yet to begin.</p>
        </div>
        <button onClick={onClose} className="w-full py-2 bg-warning text-white uppercase font-bold hover:bg-red-900 transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
