'use client';

export default function GameStatus() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-gray-800 bg-accent/30 text-xs font-mono">
      <div className="p-2 border border-gray-800">
        <p className="text-gray-500">SHIFT PROGRESS</p>
        <p className="text-white text-sm font-bold">0%</p>
      </div>
      <div className="p-2 border border-gray-800">
        <p className="text-gray-500">ANOMALIES DETECTED</p>
        <p className="text-cctv-green text-sm font-bold">0</p>
      </div>
      <div className="p-2 border border-gray-800">
        <p className="text-gray-500">ANOMALIES MISSED</p>
        <p className="text-warning text-sm font-bold">0</p>
      </div>
      <div className="p-2 border border-gray-800">
        <p className="text-gray-500">LIVES</p>
        <p className="text-white text-sm font-bold">3 / 3</p>
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
        <button
          disabled
          title="Anomaly detection will be enabled in the next checkpoint."
          className="w-full py-2 bg-gray-800 text-gray-500 font-bold uppercase cursor-not-allowed border border-gray-700"
        >
          Report Anomaly
        </button>
      </div>
    </div>
  );
}
