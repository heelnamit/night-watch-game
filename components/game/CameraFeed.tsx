'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface CameraFeedProps {
  cameraId: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CameraFeed({ cameraId, isSelected, onSelect }: CameraFeedProps) {
  const [interferenceBurst, setInterferenceBurst] = useState(false);
  const activeAnomalies = useGameStore((state) => state.activeAnomalies);
  const remainingTime = useGameStore((state) => state.remainingTime);
  const activeAnomaly = activeAnomalies.find((a) => a.cameraId === cameraId);
  const anomalyId = activeAnomaly?.id;

  // Tension level for visuals (0 to 1)
  const tension = Math.min(1, Math.max(0, (360 - remainingTime) / 360));
  const isHighTension = tension > 0.6;

  useEffect(() => {
    if (!isHighTension) return;

    const interval = window.setInterval(() => {
      if (Math.random() < 0.01) {
        setInterferenceBurst(true);
        window.setTimeout(() => setInterferenceBurst(false), 120);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isHighTension]);

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
            {/* Environment Shadows */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>

            {/* Ceiling Light & Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-cctv-green/5 blur-3xl pointer-events-none"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-gray-900 border border-gray-700"></div>

            {/* Wall Clock */}
            <div
              className={`absolute top-6 right-6 w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono text-[9px] transition-all ${
                isClockStopped
                  ? 'border-red-600 text-red-600 font-bold bg-red-950/30'
                  : 'border-cctv-green/20 text-cctv-green/40'
              }`}
            >
              <div className={`w-0.5 h-4 bg-current origin-bottom ${isClockStopped ? '' : 'animate-[spin_60s_linear_infinite]'}`}></div>
              <span className="mt-1">{isClockStopped ? '--:--' : '12:00'}</span>
            </div>

            {/* Figure Near Entrance Anomaly */}
            {isFigureEntrance && (
              <div className="absolute bottom-20 z-10 left-1/2 -translate-x-1/2 w-12 h-32 bg-black/80 rounded-t-full blur-[1px] flex flex-col items-center transition-all duration-1000">
                <div className="w-5 h-5 rounded-full bg-black/90 mt-2"></div>
                <div className="w-8 h-20 bg-black/95 rounded-t-full mt-1"></div>
              </div>
            )}

            {/* Scene Elements */}
            <div className="flex-1 flex flex-col justify-end items-center pb-2">
              {/* Reception Desk & Chair */}
              <div className="w-4/5 h-20 bg-[#080f08] border-t-2 border-cctv-green/20 relative flex justify-center items-center shadow-2xl">
                {!isChairMissing && (
                  <div className="absolute -top-8 w-10 h-10 bg-gray-900 border border-gray-700 rounded-t shadow-inner">
                    <div className="w-full h-2 bg-gray-800 mt-2"></div>
                  </div>
                )}
                {isShadowDesk && (
                  <div className="absolute -top-12 z-0 w-16 h-16 bg-black rounded-full blur-xl opacity-90 border-t border-red-950/40"></div>
                )}
                <span className="text-[10px] text-cctv-green/30 tracking-[0.2em] font-bold uppercase z-10">
                  RECEPTION
                </span>
              </div>

              {/* Entrance Door */}
              <div
                className={`absolute bottom-20 w-24 h-36 border-2 transition-all duration-500 flex items-center justify-center ${
                  isDoorOpen
                    ? 'border-red-900 bg-black/95 translate-x-8 shadow-[10px_0_20px_rgba(0,0,0,0.8)]'
                    : 'border-gray-800/40 border-dashed bg-black/10'
                }`}
              >
                <div className="w-full h-full border-x border-gray-900/50 flex flex-col gap-8 p-4">
                  <div className="w-full h-px bg-gray-800/30"></div>
                  <div className="w-full h-px bg-gray-800/30"></div>
                </div>
                <span className={`absolute text-[10px] tracking-widest font-bold ${isDoorOpen ? 'text-red-700' : 'text-gray-700'}`}>
                  {isDoorOpen ? 'DOOR OPEN' : 'EXIT'}
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
            className={`relative w-full h-full bg-[#020502] flex flex-col justify-between p-4 overflow-hidden border border-gray-800 ${
              isLightsFlickering ? 'animate-[pulse_0.1s_infinite]' : ''
            }`}
          >
            {/* Perspective hallway */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-full border-x-2 border-gray-900 flex flex-col justify-between py-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-cctv-green/5 border-y border-gray-950/50"></div>
                ))}
              </div>
            </div>

            {/* Depth Darkness */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-60"></div>

            {/* Figure at end of corridor */}
            {isFigureHallway && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-8 h-28 bg-black border border-red-950/20 rounded-t-full blur-[2px] mt-4 opacity-90"></div>
              </div>
            )}

            {/* Moving Shadow on Wall */}
            {isShadowWall && (
              <div className="absolute right-12 top-16 w-20 h-40 bg-black/95 blur-2xl rounded-full -rotate-45 animate-[bounce_4s_infinite] opacity-80"></div>
            )}

            {/* Apartment Doors on sides */}
            <div
              className={`absolute left-0 top-12 w-10 h-32 border-y border-r transition-all duration-700 ${
                isDoorOpen ? 'bg-black border-red-900 translate-x-4 shadow-2xl' : 'border-gray-900 bg-[#050805]'
              }`}
            >
              <div className="w-full h-full flex flex-col items-end pr-1 pt-12 gap-1">
                 <div className="w-1 h-4 bg-gray-800"></div>
              </div>
            </div>

            <div className="absolute right-0 top-12 w-10 h-32 border-y border-l border-gray-900 bg-[#050805]"></div>
            <div className="absolute left-0 top-56 w-10 h-32 border-y border-r border-gray-900 bg-[#050805]"></div>
            <div className="absolute right-0 top-56 w-10 h-32 border-y border-l border-gray-900 bg-[#050805]"></div>

            {/* Fire Extinguisher */}
            {!isExtinguisherMissing && (
              <div className="absolute bottom-10 left-12 w-4 h-10 bg-red-900 rounded-sm border border-black shadow-lg">
                <div className="w-2 h-1 bg-gray-400 absolute top-0 left-1/2 -translate-x-1/2"></div>
                <div className="w-full h-2 bg-white/10 absolute top-2"></div>
              </div>
            )}

            <div className="z-10 text-center">
              <span className="text-[10px] text-gray-600 tracking-[0.3em] font-bold">W-HALLWAY_04</span>
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
            className={`relative w-full h-full flex flex-col justify-between p-4 overflow-hidden border border-gray-800 transition-all duration-1000 ${
              isLightDisappears ? 'bg-black' : 'bg-[#010301]'
            }`}
          >
            {/* Rough Concrete Texture */}
            {!isLightDisappears && (
              <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>
            )}

            {/* Industrial Pipes */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gray-900 flex justify-around border-b border-gray-800">
              <div className="w-3 h-full bg-gray-800 relative">
                {isPipesLeaking && (
                  <div className="absolute top-4 left-0 w-full h-32 bg-gradient-to-b from-red-950/80 to-transparent animate-[pulse_1s_infinite] border-x border-red-900/20"></div>
                )}
              </div>
              <div className="w-3 h-full bg-gray-800"></div>
              <div className="w-3 h-full bg-gray-800"></div>
            </div>

            {/* Mysterious Figure in Corner */}
            {isFigure && (
              <div className="absolute left-8 bottom-12 w-14 h-24 bg-black border border-gray-950 rounded-t-full blur-[2px] opacity-95"></div>
            )}

            {/* Silhouette behind boxes */}
            {isSilhouetteBoxes && (
              <div className="absolute bottom-24 right-14 w-10 h-10 rounded-full bg-gray-400/40 blur-[3px] border border-white/20"></div>
            )}

            {/* Storage Boxes */}
            <div
              className={`absolute bottom-6 right-12 flex flex-col gap-1.5 transition-all duration-1000 ${
                isBoxesMoved ? 'translate-x-12 rotate-12 -translate-y-2' : ''
              }`}
            >
              <div className="w-16 h-12 bg-[#0a110a] border border-gray-900 shadow-inner"></div>
              <div className="w-20 h-14 bg-[#0a110a] border border-gray-900 shadow-inner"></div>
              <div className="w-24 h-16 bg-[#0a110a] border border-gray-900 shadow-inner"></div>
            </div>

            <div className="z-10 text-left">
              <span className="text-[10px] text-cctv-green/20 font-bold tracking-widest">B1-STORAGE_NORTH</span>
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
          <div className="relative w-full h-full bg-[#020302] flex flex-col justify-between p-4 overflow-hidden border border-gray-800">
            {/* Darkness & Distance Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,transparent_0%,black_80%)] opacity-70"></div>

            {/* Overhead Light Beam */}
            <div className="absolute top-0 right-1/4 w-48 h-64 bg-cctv-green/5 blur-[80px] pointer-events-none"></div>

            {/* Security Gate */}
            <div className="absolute top-6 left-0 right-0 h-2 bg-gray-900 border-y border-gray-800 flex items-center">
              {isGateOpen && (
                <div className="w-full h-full bg-red-950/40 animate-[pulse_0.5s_infinite]"></div>
              )}
            </div>

            {/* Concrete Pillars */}
            <div className="absolute left-8 top-0 bottom-0 w-6 bg-[#080c08] border-x border-gray-900 relative">
              {isShadowPillar && (
                <div className="absolute inset-y-0 w-12 left-full bg-black/90 blur-xl animate-[pulse_3s_infinite]"></div>
              )}
            </div>
            <div className="absolute right-8 top-0 bottom-0 w-6 bg-[#080c08] border-x border-gray-900"></div>

            {/* Figure between cars */}
            {isFigureCars && (
              <div className="absolute bottom-20 left-[40%] w-8 h-20 bg-black rounded-t-full blur-[2px] opacity-90 border-t border-gray-900"></div>
            )}

            {/* Parked Vehicle Silhouette */}
            {!isVehicleMissing && (
              <div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-20 bg-black border-t-2 border-gray-900 rounded-t-2xl shadow-2xl transition-all duration-1000 ${
                  isVehicleMoved ? 'rotate-[30deg] translate-x-20 -translate-y-4 scale-95 border-red-900' : 'border-cctv-green/5'
                }`}
              >
                <div className="flex justify-between w-full px-4 mt-2">
                   <div className="w-10 h-1 bg-gray-900/50 rounded-full"></div>
                   <div className="w-10 h-1 bg-gray-900/50 rounded-full"></div>
                </div>
                <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-black to-transparent"></div>
              </div>
            )}

            <div className="z-10 text-center">
              <span className="text-[10px] text-gray-700 tracking-[0.4em] font-bold uppercase">L2-GARAGE_SEC_B</span>
            </div>
          </div>
        );
      }

      default:
        return <div className="text-gray-600 flex items-center justify-center h-full">NO SIGNAL</div>;
    }
  };

  // Additional signal interference based on tension and anomaly
  const interference = (activeAnomaly ? 0.08 : 0.02) + (tension * 0.05);

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer aspect-video bg-black overflow-hidden border-2 transition-all duration-300 ${
        isSelected
          ? 'border-cctv-green shadow-[0_0_20px_rgba(61,237,151,0.25)]'
          : 'border-gray-900 hover:border-gray-700'
      }`}
    >
      {/* Dynamic Signal Interference Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: interference
        }}
      ></div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_6px] pointer-events-none z-40 opacity-40"></div>

      {/* CRT Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none z-30"></div>

      {/* Anomaly Subtle Interference / Glow */}
      {activeAnomaly && (
        <div className="absolute inset-0 bg-red-950/5 pointer-events-none z-10 border-2 border-red-900/20"></div>
      )}

      {/* Scene Render */}
      <div className={`w-full h-full transition-transform duration-500 ${isSelected ? 'scale-[1.02]' : 'scale-100'}`}>
        {renderScene()}
      </div>

      {/* Feed Overlay Info */}
      <div className="absolute top-3 left-3 z-[60] flex items-center gap-3 font-mono text-[10px] text-cctv-green drop-shadow-lg">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        <span className="font-bold tracking-widest">REC</span>
        <span className="text-gray-400 font-bold px-1.5 py-0.5 bg-black/40 border border-cctv-green/20">{cameraId}</span>
      </div>

      <div className="absolute bottom-3 right-3 z-[60] font-mono text-[10px] text-cctv-green/60 bg-black/70 px-2 py-1 flex items-center gap-2 border border-white/5">
        <span className="tracking-widest font-bold">LIVE_STREAM_v4.2</span>
      </div>

      {/* Interference Burst Overlay (triggered randomly during tension) */}
      {isHighTension && interferenceBurst && (
        <div className="absolute inset-0 bg-white/5 z-[70] animate-pulse"></div>
      )}
    </div>
  );
}
