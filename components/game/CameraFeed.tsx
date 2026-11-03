'use client';

import { useGameStore } from '../../store/gameStore';

interface CameraFeedProps {
  cameraId: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CameraFeed({ cameraId, isSelected, onSelect }: CameraFeedProps) {
  const activeAnomalies = useGameStore((state) => state.activeAnomalies);
  const activeAnomaly = activeAnomalies.find((a) => a.cameraId === cameraId);
  const anomalyId = activeAnomaly?.id;

  const renderScene = () => {
    switch (cameraId) {
      case 'CAM_01': { // MAIN ENTRANCE
        const isDoorOpen = anomalyId === 'CAM01_DOOR_OPEN';
        const isChairMissing = anomalyId === 'CAM01_CHAIR_MISSING';
        const isShadowDesk = anomalyId === 'CAM01_SHADOW_DESK';
        const isFigureEntrance = anomalyId === 'CAM01_FIGURE_ENTRANCE';
        const isClockStopped = anomalyId === 'CAM01_CLOCK_STOPPED';

        return (
          <div className="relative w-full h-full bg-[#050805] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Ceiling Light & Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-cctv-green/10 blur-xl pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-700"></div>

            {/* Wall Clock */}
            <div
              className={`absolute top-6 right-6 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-[10px] ${
                isClockStopped
                  ? 'border-red-500 text-red-500 font-bold bg-red-950/20'
                  : 'border-cctv-green/40 text-cctv-green/70'
              }`}
            >
              {isClockStopped ? '00:00' : '12:00'}
            </div>

            {/* Figure Near Entrance Anomaly */}
            {isFigureEntrance && (
              <div className="absolute bottom-16 z-10 left-1/2 -translate-x-1/2 w-10 h-24 bg-gray-300/80 rounded-t-full blur-[1px] flex flex-col items-center justify-start pt-2 border-t border-white">
                <div className="w-4 h-4 rounded-full bg-black/60"></div>
              </div>
            )}

            {/* Scene Elements */}
            <div className="flex-1 flex flex-col justify-end items-center pb-2">
              {/* Reception Desk & Chair */}
              <div className="w-3/4 h-16 bg-[#0a120a] border-t border-cctv-green/30 relative flex justify-center items-center">
                {!isChairMissing && (
                  <div className="absolute -top-6 w-8 h-8 bg-gray-800 border border-gray-600 rounded-t"></div>
                )}
                {isShadowDesk && (
                  <div className="absolute -top-10 z-0 w-12 h-12 bg-black rounded-full blur-sm opacity-90 border-t border-red-900/50"></div>
                )}
                <span className="text-[10px] text-cctv-green/50 tracking-widest uppercase z-10">
                  RECEPTION DESK
                </span>
              </div>

              {/* Entrance Door */}
              <div
                className={`absolute bottom-16 w-20 h-28 border-2 transition-all flex items-center justify-center ${
                  isDoorOpen
                    ? 'border-red-600 bg-black/90 translate-x-4 border-solid'
                    : 'border-dashed border-gray-700/50'
                }`}
              >
                <span className={`text-[9px] ${isDoorOpen ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                  {isDoorOpen ? 'OPEN' : 'EXIT'}
                </span>
              </div>
            </div>
          </div>
        );
      }

      case 'CAM_02': { // APARTMENT CORRIDOR
        const isDoorOpen = anomalyId === 'CAM02_APARTMENT_DOOR_OPEN';
        const isFigureHallway = anomalyId === 'CAM02_FIGURE_HALLWAY';
        const isExtinguisherMissing = anomalyId === 'CAM02_EXTINGUISHER_MISSING';
        const isShadowWall = anomalyId === 'CAM02_SHADOW_WALL';
        const isLightsFlickering = anomalyId === 'CAM02_LIGHTS_FLICKERING';

        return (
          <div
            className={`relative w-full h-full bg-[#030603] flex flex-col justify-between p-4 overflow-hidden border border-gray-800 ${
              isLightsFlickering ? 'animate-pulse bg-black' : ''
            }`}
          >
            {/* Perspective hallway using CSS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-full border-x border-gray-800 flex flex-col justify-between py-4">
                <div className="w-full h-2 bg-cctv-green/20"></div>
                <div className="w-full h-2 bg-cctv-green/20"></div>
              </div>
            </div>

            {/* Figure at end of corridor */}
            {isFigureHallway && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-6 h-20 bg-black border border-red-900/40 rounded-t-lg blur-[1px]"></div>
              </div>
            )}

            {/* Moving Shadow on Wall */}
            {isShadowWall && (
              <div className="absolute right-10 top-12 w-16 h-28 bg-black/90 blur-md rounded-full -rotate-12 animate-bounce"></div>
            )}

            {/* Apartment Doors on sides */}
            <div
              className={`absolute left-2 top-10 w-8 h-20 border transition-all ${
                isDoorOpen ? 'bg-black border-red-600 translate-x-2' : 'border-gray-800 bg-[#080c08]'
              }`}
            ></div>
            <div className="absolute right-2 top-10 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>
            <div className="absolute left-2 top-36 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>
            <div className="absolute right-2 top-36 w-8 h-20 border border-gray-800 bg-[#080c08]"></div>

            {/* Fire Extinguisher */}
            {!isExtinguisherMissing && (
              <div className="absolute bottom-6 left-6 w-3 h-8 bg-warning rounded-sm"></div>
            )}

            <div className="z-10 text-center">
              <span className="text-[9px] text-gray-500 tracking-widest">HALLWAY WEST</span>
            </div>
          </div>
        );
      }

      case 'CAM_03': { // BASEMENT
        const isBoxesMoved = anomalyId === 'CAM03_BOXES_MOVED';
        const isFigure = anomalyId === 'CAM03_MYSTERIOUS_FIGURE';
        const isPipesLeaking = anomalyId === 'CAM03_PIPES_LEAKING';
        const isLightDisappears = anomalyId === 'CAM03_LIGHT_DISAPPEARS';
        const isSilhouetteBoxes = anomalyId === 'CAM03_SILHOUETTE_BOXES';

        return (
          <div
            className={`relative w-full h-full flex flex-col justify-between p-4 overflow-hidden border border-gray-800 transition-colors ${
              isLightDisappears ? 'bg-black' : 'bg-[#020402]'
            }`}
          >
            {/* Industrial Pipes */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gray-800 flex justify-around">
              <div className="w-2 h-full bg-gray-700 relative">
                {isPipesLeaking && (
                  <div className="absolute top-3 left-0 w-full h-16 bg-red-950/60 animate-pulse border-x border-red-600/40"></div>
                )}
              </div>
              <div className="w-2 h-full bg-gray-700"></div>
            </div>

            {/* Concrete wall texture placeholder */}
            {!isLightDisappears && (
              <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            )}

            {/* Mysterious Figure in Corner */}
            {isFigure && (
              <div className="absolute left-6 bottom-8 w-10 h-16 bg-black border border-gray-900 rounded-t-full blur-[1px]"></div>
            )}

            {/* Silhouette behind boxes */}
            {isSilhouetteBoxes && (
              <div className="absolute bottom-16 right-10 w-8 h-8 rounded-full bg-gray-300/60 blur-[1px] border border-white"></div>
            )}

            {/* Storage Boxes */}
            <div
              className={`absolute bottom-4 right-8 flex flex-col gap-1 transition-all ${
                isBoxesMoved ? 'translate-x-6 rotate-6 border-red-500' : ''
              }`}
            >
              <div className="w-12 h-8 bg-[#0c140c] border border-gray-800"></div>
              <div className="w-16 h-10 bg-[#0c140c] border border-gray-800"></div>
            </div>

            <div className="z-10 text-left">
              <span className="text-[9px] text-cctv-green/40">SECTOR B - STORAGE</span>
            </div>
          </div>
        );
      }

      case 'CAM_04': { // PARKING AREA
        const isVehicleMissing = anomalyId === 'CAM04_VEHICLE_DISAPPEARS';
        const isVehicleMoved = anomalyId === 'CAM04_VEHICLE_MOVED';
        const isFigureCars = anomalyId === 'CAM04_FIGURE_CARS';
        const isGateOpen = anomalyId === 'CAM04_GATE_OPEN';
        const isShadowPillar = anomalyId === 'CAM04_SHADOW_PILLAR';

        return (
          <div className="relative w-full h-full bg-[#040504] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Overhead Light Beam */}
            <div className="absolute top-0 right-1/4 w-24 h-32 bg-cctv-green/5 blur-2xl pointer-events-none"></div>

            {/* Security Gate */}
            {isGateOpen && (
              <div className="absolute top-4 left-0 right-0 h-1 bg-red-600 animate-pulse border-y border-red-400"></div>
            )}

            {/* Concrete Pillars */}
            <div className="absolute left-4 top-0 bottom-0 w-4 bg-[#0a0f0a] border-r border-gray-800 relative">
              {isShadowPillar && (
                <div className="absolute inset-y-0 w-full bg-black/90 blur-sm"></div>
              )}
            </div>
            <div className="absolute right-4 top-0 bottom-0 w-4 bg-[#0a0f0a] border-l border-gray-800"></div>

            {/* Figure between cars */}
            {isFigureCars && (
              <div className="absolute bottom-12 left-1/3 w-6 h-14 bg-black rounded-t blur-[1px] border-t border-gray-700"></div>
            )}

            {/* Parked Vehicle Silhouette */}
            {!isVehicleMissing && (
              <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-14 bg-[#080d08] rounded-t-lg border-t border-gray-700 flex items-center justify-center transition-all ${
                  isVehicleMoved ? 'rotate-45 translate-y-2 border-red-500' : ''
                }`}
              >
                <div className="w-8 h-2 bg-cctv-green/20 rounded-full"></div>
              </div>
            )}

            <div className="z-10 text-center">
              <span className="text-[9px] text-gray-500 tracking-widest">GARAGE LEVEL - 02</span>
            </div>
          </div>
        );
      }

      default:
        return <div className="text-gray-600 flex items-center justify-center h-full">NO SIGNAL</div>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer aspect-video bg-black overflow-hidden border ${
        isSelected
          ? 'border-cctv-green shadow-[0_0_15px_rgba(61,237,151,0.2)]'
          : 'border-gray-800 hover:border-gray-600'
      } transition-all`}
    >
      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

      {/* CRT Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] pointer-events-none z-20"></div>

      {/* Anomaly Subtle Interference / Glow */}
      {activeAnomaly && (
        <div className="absolute inset-0 bg-red-950/10 pointer-events-none z-10 animate-pulse border-2 border-red-900/30"></div>
      )}

      {/* Scene Render */}
      {renderScene()}

      {/* Feed Overlay Info */}
      <div className="absolute top-2 left-2 z-30 flex items-center gap-2 font-mono text-[10px] text-cctv-green">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
        <span>REC</span>
        <span className="text-gray-400 font-bold">{cameraId}</span>
      </div>

      <div className="absolute bottom-2 right-2 z-35 font-mono text-[9px] text-cctv-green/80 bg-black/60 px-1 py-0.5 flex items-center gap-1">
        {activeAnomaly && <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping"></span>}
        <span>LIVE FEED</span>
      </div>
    </div>
  );
}
