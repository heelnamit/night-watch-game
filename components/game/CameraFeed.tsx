'use client';

interface CameraFeedProps {
  cameraId: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CameraFeed({ cameraId, isSelected, onSelect }: CameraFeedProps) {
  const renderScene = () => {
    switch (cameraId) {
      case 'CAM_01': // MAIN ENTRANCE
        return (
          <div className="relative w-full h-full bg-[#050805] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Ceiling Light & Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-cctv-green/10 blur-xl pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-700"></div>

            {/* Wall Clock */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-cctv-green/40 flex items-center justify-center font-mono text-[10px] text-cctv-green/70">
              12:00
            </div>

            {/* Scene Elements */}
            <div className="flex-1 flex flex-col justify-end items-center pb-2">
              {/* Reception Desk */}
              <div className="w-3/4 h-16 bg-[#0a120a] border-t border-cctv-green/30 relative flex justify-center items-center">
                <span className="text-[10px] text-cctv-green/50 tracking-widest uppercase">RECEPTION DESK</span>
              </div>
              {/* Entrance Door */}
              <div className="absolute bottom-16 w-20 h-28 border-2 border-dashed border-gray-700/50 flex items-center justify-center">
                <span className="text-[9px] text-gray-600">EXIT</span>
              </div>
            </div>
          </div>
        );

      case 'CAM_02': // APARTMENT CORRIDOR
        return (
          <div className="relative w-full h-full bg-[#030603] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Perspective hallway using CSS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-full border-x border-gray-800 flex flex-col justify-between py-4">
                <div className="w-full h-2 bg-cctv-green/20"></div>
                <div className="w-full h-2 bg-cctv-green/20"></div>
              </div>
            </div>

            {/* Apartment Doors on sides */}
            <div className="absolute left-2 top-10 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>
            <div className="absolute right-2 top-10 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>
            <div className="absolute left-2 top-36 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>
            <div className="absolute right-2 top-36 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>

            {/* Fire Extinguisher */}
            <div className="absolute bottom-6 left-6 w-3 h-8 bg-warning rounded-sm"></div>

            <div className="z-10 text-center">
              <span className="text-[9px] text-gray-500 tracking-widest">HALLWAY WEST</span>
            </div>
          </div>
        );

      case 'CAM_03': // BASEMENT
        return (
          <div className="relative w-full h-full bg-[#020402] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Industrial Pipes */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gray-800 flex justify-around">
              <div className="w-2 h-full bg-gray-700"></div>
              <div className="w-2 h-full bg-gray-700"></div>
            </div>

            {/* Concrete wall texture placeholder */}
            <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            {/* Storage Boxes */}
            <div className="absolute bottom-4 right-8 flex flex-col gap-1">
              <div className="w-12 h-8 bg-[#0c140c] border border-gray-800"></div>
              <div className="w-16 h-10 bg-[#0c140c] border border-gray-800"></div>
            </div>

            <div className="z-10 text-left">
              <span className="text-[9px] text-cctv-green/40">SECTOR B - STORAGE</span>
            </div>
          </div>
        );

      case 'CAM_04': // PARKING AREA
        return (
          <div className="relative w-full h-full bg-[#040504] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Overhead Light Beam */}
            <div className="absolute top-0 right-1/4 w-24 h-32 bg-cctv-green/5 blur-2xl pointer-events-none"></div>

            {/* Concrete Pillars */}
            <div className="absolute left-4 top-0 bottom-0 w-4 bg-[#0a0f0a] border-r border-gray-800"></div>
            <div className="absolute right-4 top-0 bottom-0 w-4 bg-[#0a0f0a] border-l border-gray-800"></div>

            {/* Parked Vehicle Silhouette */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-14 bg-[#080d08] rounded-t-lg border-t border-gray-700 flex items-center justify-center">
              <div className="w-8 h-2 bg-cctv-green/20 rounded-full"></div>
            </div>

            <div className="z-10 text-center">
              <span className="text-[9px] text-gray-500 tracking-widest">GARAGE LEVEL - 02</span>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-600 flex items-center justify-center h-full">NO SIGNAL</div>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer aspect-video bg-black overflow-hidden border ${
        isSelected ? 'border-cctv-green shadow-[0_0_15px_rgba(61,237,151,0.2)]' : 'border-gray-800 hover:border-gray-600'
      } transition-all`}
    >
      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

      {/* CRT Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] pointer-events-none z-20"></div>

      {/* Scene Render */}
      {renderScene()}

      {/* Feed Overlay Info */}
      <div className="absolute top-2 left-2 z-30 flex items-center gap-2 font-mono text-[10px] text-cctv-green">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
        <span>REC</span>
        <span className="text-gray-400 font-bold">{cameraId}</span>
      </div>

      <div className="absolute bottom-2 right-2 z-35 font-mono text-[9px] text-cctv-green/80 bg-black/60 px-1 py-0.5">
        LIVE FEED
      </div>
    </div>
  );
}
