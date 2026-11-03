'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-accent p-8 rounded-none border border-cctv-green max-w-lg w-full">
        <h2 className="text-2xl mb-4 text-cctv-green uppercase">How to Play</h2>
        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
          You are the night security guard for the Blackwood Apartments. Your job is to
          observe the four camera feeds during your shift. If you notice any anomalies—
          anything out of place or disturbing—report it immediately using the
          'REPORT ANOMALY' button.
        </p>
        <button onClick={onClose} className="w-full py-2 bg-warning text-white uppercase font-bold hover:bg-red-900 transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
