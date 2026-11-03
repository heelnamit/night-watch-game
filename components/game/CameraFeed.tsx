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
        const isWrongReflection = anomalyId === 'CAM01_WRONG_REFLECTION';

        return (
          <div className="relative h-full w-full overflow-hidden border border-gray-800 bg-[#080907]">
            {/* Lobby walls recede into an unlit entrance */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#11130f_0%,#090a08_57%,#030403_100%)]"></div>
            <div className="absolute inset-x-0 top-[17%] h-[52%] border-y border-[#707268]/15 bg-[linear-gradient(90deg,rgba(0,0,0,0.55),transparent_18%,rgba(90,91,76,0.05)_50%,transparent_82%,rgba(0,0,0,0.65))]"></div>
            <div className="absolute left-[8%] top-[15%] h-[58%] w-[2px] bg-[#585a4e]/25 shadow-[0_0_16px_2px_rgba(0,0,0,0.8)]"></div>
            <div className="absolute right-[8%] top-[15%] h-[58%] w-[2px] bg-[#585a4e]/25 shadow-[0_0_16px_2px_rgba(0,0,0,0.8)]"></div>

            {/* Sickly entrance light, extinguished when the clock anomaly begins */}
            <div className="absolute left-1/2 top-[7%] z-[1] h-1.5 w-16 -translate-x-1/2 border border-[#85856a]/50 bg-[#999779] shadow-[0_0_14px_5px_rgba(153,151,121,0.22)]"></div>
            <div className="absolute left-1/2 top-[8%] h-[52%] w-[55%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(148,145,111,0.1),transparent)] [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]"></div>

            {/* Entrance doors open onto a featureless black exterior */}
            <div className={`absolute left-1/2 top-[19%] h-[48%] w-[28%] -translate-x-1/2 border-x-[5px] border-t-4 border-[#30332d] bg-black shadow-[inset_0_0_35px_12px_rgba(0,0,0,0.95)] transition-all duration-700 ${isDoorOpen ? 'scale-x-110 border-red-950/80 shadow-[0_0_24px_4px_rgba(90,0,0,0.18)]' : ''}`}>
              <div className="absolute inset-y-0 left-1/2 border-l border-[#35372f]/60"></div>
              <div className="absolute bottom-[18%] left-[12%] h-1 w-1 rounded-full bg-[#9a966e]/80 shadow-[0_0_7px_2px_rgba(154,150,110,0.3)]"></div>
              {isDoorOpen && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(70,0,0,0.2),transparent_65%)]"></div>}
              {isWrongReflection && (
                <div className="absolute bottom-[8%] left-1/2 z-[2] flex h-[68%] w-8 -translate-x-1/2 flex-col items-center opacity-75">
                  <div className="h-4 w-4 rounded-full bg-[#77766a]/50 blur-[1px]"></div>
                  <div className="h-12 w-7 rounded-t-[45%] bg-[#77766a]/35 blur-[1px]"></div>
                </div>
              )}
            </div>
            <div className="absolute left-1/2 top-[19%] h-[49%] w-[34%] -translate-x-1/2 border-x border-[#5c5b4b]/20"></div>

            {/* Wall clock */}
            <div className={`absolute right-[12%] top-[18%] z-[2] flex h-10 w-10 flex-col items-center justify-center rounded-full border bg-[#090a08]/80 font-mono text-[8px] ${isClockStopped ? 'border-red-800 text-red-400 shadow-[0_0_12px_rgba(120,0,0,0.35)]' : 'border-[#747763]/40 text-[#aaa98a]/60'}`}>
              <div className={`h-3 w-px origin-bottom bg-current ${isClockStopped ? '' : 'animate-[spin_60s_linear_infinite]'}`}></div>
              <span className="mt-0.5">{isClockStopped ? '--:--' : '12:00'}</span>
            </div>

            {/* Reception desk and chair anchor the foreground */}
            <div className="absolute bottom-[10%] left-[11%] right-[11%] z-[3] h-[27%] border-t-2 border-[#57594c]/55 bg-[linear-gradient(180deg,#191a15,#090a08_35%,#030403)] shadow-[0_-8px_24px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-x-[8%] top-0 h-1 bg-[#77745a]/35"></div>
              <div className="absolute left-[12%] right-[12%] top-[34%] border-t border-[#77745a]/20"></div>
              {!isChairMissing && (
                <div className="absolute -top-8 left-1/2 h-8 w-9 -translate-x-1/2 border border-[#55574f] bg-[#151713] shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-x-0 top-1/2 border-t border-[#6e7065]/35"></div>
                  <div className="absolute -bottom-3 left-1/2 h-3 w-1 -translate-x-1/2 bg-[#292b25]"></div>
                </div>
              )}
              {isShadowDesk && (
                <div className="absolute -top-[68%] left-[38%] h-16 w-16 rounded-full bg-black shadow-[0_0_22px_10px_rgba(0,0,0,0.9)]">
                  <div className="absolute left-1/2 top-1/2 h-8 w-12 -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[#020202]"></div>
                </div>
              )}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.35em] text-[#aaa98a]/35">RECEPTION</span>
            </div>

            {/* A motionless visitor stands just inside the doorway */}
            {isFigureEntrance && (
              <div className="absolute bottom-[31%] left-1/2 z-[4] flex h-[42%] w-10 -translate-x-1/2 flex-col items-center">
                <div className="h-5 w-5 rounded-full bg-[#030303] shadow-[0_0_12px_3px_rgba(0,0,0,0.9)]">
                  <div className="mt-2 ml-1 h-0.5 w-1 bg-[#a99d87]/70 shadow-[5px_0_2px_rgba(169,157,135,0.5)]"></div>
                </div>
                <div className="mt-1 h-14 w-9 rounded-t-[45%] bg-gradient-to-b from-[#090a09] to-black shadow-[0_0_14px_rgba(0,0,0,0.9)]"></div>
                <div className="flex w-10 justify-between">
                  <div className="h-8 w-3 -rotate-6 bg-black"></div>
                  <div className="h-8 w-3 rotate-6 bg-black"></div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,transparent_8%,rgba(0,0,0,0.3)_52%,rgba(0,0,0,0.88)_100%),linear-gradient(0deg,rgba(0,0,0,0.65),transparent_58%)]"></div>
            <div className="absolute bottom-2 left-3 z-10 rounded-sm bg-black/60 px-1.5 py-1 text-[9px] font-bold tracking-[0.2em] text-cctv-green/55">GROUND // MAIN ENTRY</div>
          </div>
        );
      }

      case 'CAM_02': { // APARTMENT CORRIDOR
        const isDoorOpen = anomalyId === 'CAM02_APARTMENT_DOOR_OPEN';
        const isFigureHallway = anomalyId === 'CAM02_FIGURE_HALLWAY';
        const isExtinguisherMissing = anomalyId === 'CAM02_EXTINGUISHER_MISSING';
        const isShadowWall = anomalyId === 'CAM02_SHADOW_WALL';
        const isLightsFlickering = anomalyId === 'CAM02_LIGHTS_FLICKERING';
        const areFootprints = anomalyId === 'CAM02_FOOTPRINTS';

        return (
          <div className={`relative h-full w-full overflow-hidden border border-gray-800 bg-[#070809] ${isLightsFlickering ? 'animate-[pulse_0.18s_infinite]' : ''}`}>
            {/* Narrow corridor converges to a black vanishing point */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#10110f_0%,#080908_48%,#020303_100%)]"></div>
            <div className="absolute left-1/2 top-[16%] h-[77%] w-[70%] -translate-x-1/2 border-x border-[#5b5e53]/20 bg-[linear-gradient(90deg,rgba(0,0,0,0.7),transparent_22%,rgba(70,74,63,0.08)_50%,transparent_78%,rgba(0,0,0,0.75))] [clip-path:polygon(36%_0,64%_0,100%_100%,0_100%)]"></div>
            <div className="absolute left-1/2 top-[16%] h-[76%] w-[28%] -translate-x-1/2 bg-black shadow-[0_0_40px_18px_rgba(0,0,0,0.95)] [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)]"></div>
            <div className="absolute left-1/2 top-[16%] h-[76%] w-[2px] -translate-x-1/2 bg-[#77786a]/15"></div>

            {/* Bare wet footprints lead toward the dark end of the hall */}
            {areFootprints && (
              <div className="absolute bottom-[8%] left-1/2 z-[4] h-[35%] w-[28%] -translate-x-1/2">
                <span className="absolute bottom-0 left-[22%] h-3 w-2 rotate-[-18deg] rounded-[50%_50%_45%_45%] bg-[#87908c]/55 shadow-[0_0_7px_2px_rgba(130,145,140,0.18)]"></span>
                <span className="absolute bottom-[13%] right-[22%] h-3 w-2 rotate-[18deg] rounded-[50%_50%_45%_45%] bg-[#87908c]/50 shadow-[0_0_7px_2px_rgba(130,145,140,0.16)]"></span>
                <span className="absolute bottom-[29%] left-[29%] h-2.5 w-1.5 rotate-[-16deg] rounded-[50%] bg-[#87908c]/45"></span>
                <span className="absolute bottom-[42%] right-[29%] h-2.5 w-1.5 rotate-[16deg] rounded-[50%] bg-[#87908c]/40"></span>
                <span className="absolute bottom-[57%] left-[36%] h-2 w-1.5 rotate-[-12deg] rounded-[50%] bg-[#87908c]/35"></span>
                <span className="absolute bottom-[69%] right-[36%] h-2 w-1.5 rotate-[12deg] rounded-[50%] bg-[#87908c]/30"></span>
              </div>
            )}

            {/* Sickly ceiling lamps recede into the distance */}
            <div className={`absolute left-1/2 top-[12%] z-[2] h-1 w-14 -translate-x-1/2 bg-[#99977a]/70 shadow-[0_0_12px_4px_rgba(153,151,122,0.18)] ${isLightsFlickering ? 'opacity-20' : ''}`}></div>
            <div className={`absolute left-1/2 top-[29%] z-[2] h-1 w-8 -translate-x-1/2 bg-[#777864]/55 shadow-[0_0_9px_3px_rgba(119,120,100,0.14)] ${isLightsFlickering ? 'opacity-90' : ''}`}></div>
            <div className={`absolute left-1/2 top-[43%] z-[2] h-px w-4 -translate-x-1/2 bg-[#646554]/45 ${isLightsFlickering ? 'opacity-10' : ''}`}></div>

            {/* Apartment doors and numbered plaques */}
            <div className={`absolute left-[5%] top-[27%] z-[2] h-[41%] w-[17%] border border-[#55564d]/60 bg-[linear-gradient(90deg,#090a09,#171813_60%,#080908)] shadow-[8px_4px_14px_rgba(0,0,0,0.8)] transition-transform duration-700 ${isDoorOpen ? 'translate-x-3 rotate-2 border-red-950 bg-black shadow-[0_0_20px_rgba(90,0,0,0.22)]' : ''}`}>
              <div className="absolute right-[15%] top-1/2 h-1.5 w-1.5 rounded-full bg-[#8e8a70]/65"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 border border-[#56564a]/40 bg-black/70 px-1 text-[7px] text-gray-500/60">204</div>
            </div>
            <div className="absolute right-[5%] top-[27%] z-[2] h-[41%] w-[17%] border border-[#55564d]/60 bg-[linear-gradient(270deg,#090a09,#171813_60%,#080908)] shadow-[-8px_4px_14px_rgba(0,0,0,0.8)]">
              <div className="absolute left-[15%] top-1/2 h-1.5 w-1.5 rounded-full bg-[#8e8a70]/50"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 border border-[#56564a]/40 bg-black/70 px-1 text-[7px] text-gray-500/60">205</div>
            </div>
            <div className="absolute left-[1%] top-[68%] h-[27%] w-[12%] border border-[#42443c]/50 bg-[#0a0b0a]"></div>
            <div className="absolute right-[1%] top-[68%] h-[27%] w-[12%] border border-[#42443c]/50 bg-[#0a0b0a]"></div>

            {/* The hallway figure waits at the far end */}
            {isFigureHallway && (
              <div className="absolute left-1/2 top-[38%] z-[4] flex h-[38%] w-8 -translate-x-1/2 flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-black shadow-[0_0_8px_2px_rgba(0,0,0,0.9)]">
                  <div className="mt-1.5 ml-1 h-0.5 w-0.5 rounded-full bg-red-200/80 shadow-[4px_0_2px_rgba(255,220,220,0.6)]"></div>
                </div>
                <div className="h-10 w-6 rounded-t-full bg-[#030303]"></div>
                <div className="flex w-8 justify-between">
                  <div className="h-6 w-2 bg-black"></div>
                  <div className="h-6 w-2 bg-black"></div>
                </div>
              </div>
            )}

            {/* A wrong-way shadow crawls across the wall */}
            {isShadowWall && (
              <div className="absolute right-[22%] top-[25%] z-[3] h-[48%] w-[17%] -rotate-12 rounded-[50%] bg-black/90 blur-md shadow-[0_0_24px_10px_rgba(0,0,0,0.8)] animate-[bounce_4s_infinite]">
                <div className="absolute left-[35%] top-[18%] h-1 w-1 rounded-full bg-red-200/70 shadow-[7px_0_2px_rgba(255,210,210,0.6)]"></div>
              </div>
            )}

            {/* Fire extinguisher should remain beside the nearer door */}
            {!isExtinguisherMissing && (
              <div className="absolute bottom-[13%] left-[17%] z-[3] h-10 w-4 rounded-sm border border-[#532323] bg-[#501d1d] shadow-[0_0_8px_rgba(70,0,0,0.25)]">
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 border border-gray-500/50 bg-gray-700"></div>
                <div className="absolute left-0 right-0 top-2 h-1 bg-[#a8a397]/25"></div>
              </div>
            )}

            <div className="absolute inset-0 z-[6] pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,transparent_4%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.9)_100%),linear-gradient(0deg,rgba(0,0,0,0.58),transparent_55%)]"></div>
            <div className="absolute bottom-2 left-3 z-10 rounded-sm bg-black/60 px-1.5 py-1 text-[9px] font-bold tracking-[0.2em] text-cctv-green/55">LEVEL 2 // WEST HALL</div>
          </div>
        );
      }

      case 'CAM_03': { // BASEMENT
        const isBoxesMoved = anomalyId === 'CAM03_BOXES_MOVED';
        const isFigure = anomalyId === 'CAM03_MYSTERIOUS_FIGURE';
        const isPipesLeaking = anomalyId === 'CAM03_PIPES_LEAKING';
        const isLightDisappears = anomalyId === 'CAM03_LIGHT_DISAPPEARS';
        const isSilhouetteBoxes = anomalyId === 'CAM03_SILHOUETTE_BOXES';
        const isLockerOpen = anomalyId === 'CAM03_LOCKER_OPEN';

        return (
          <div
            className={`relative w-full h-full flex flex-col justify-between overflow-hidden border border-gray-800 transition-all duration-1000 ${
              isLightDisappears ? 'bg-[#010101]' : 'bg-[#090a08]'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,transparent_38%,rgba(0,0,0,0.8)_100%),radial-gradient(ellipse_at_50%_35%,rgba(104,111,82,0.12),transparent_58%)]"></div>
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:9px_9px]"></div>

            {/* Concrete wall panels and overhead utility lines */}
            <div className="absolute inset-x-0 top-9 h-1/2 border-y border-[#70746a]/15 bg-[linear-gradient(90deg,transparent_24%,rgba(150,150,130,0.07)_25%,transparent_26%,transparent_74%,rgba(150,150,130,0.07)_75%,transparent_76%)]"></div>
            <div className="absolute inset-x-0 top-0 h-8 border-b-4 border-[#1b1b19] bg-[#050605]">
              <div className="absolute inset-x-0 top-2 h-1 bg-[#292b25] shadow-[0_5px_0_#111310,0_10px_0_#20211c]"></div>
            </div>

            {/* Main ceiling light and its pool of light */}
            {!isLightDisappears && (
              <>
                <div className="absolute top-8 left-1/2 z-[1] h-2 w-20 -translate-x-1/2 border border-[#8d8a65]/50 bg-[#9a966b] shadow-[0_0_12px_4px_rgba(150,143,96,0.2)]"></div>
                <div className="absolute left-1/2 top-10 h-32 w-48 -translate-x-1/2 bg-[linear-gradient(180deg,rgba(155,146,91,0.1),transparent)] [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)]"></div>
              </>
            )}

            {/* Drain and support columns establish depth */}
            <div className="absolute inset-x-0 bottom-0 h-12 border-t border-[#66685c]/30 bg-[linear-gradient(180deg,#272a24,#10120f)]">
              <div className="absolute left-1/2 top-2 h-6 w-16 -translate-x-1/2 rounded-full border border-gray-700/70 bg-black/70"></div>
              <div className={`absolute inset-0 bg-[repeating-linear-gradient(105deg,transparent_0_35px,rgba(170,175,150,0.08)_36px_38px)] ${isPipesLeaking ? 'bg-blue-950/30' : ''}`}></div>
            </div>
            <div className="absolute bottom-12 left-[18%] top-12 w-3 border-x border-[#45473d]/40 bg-[#171815] shadow-[4px_0_12px_rgba(0,0,0,0.5)]"></div>
            <div className="absolute bottom-12 right-[18%] top-12 w-3 border-x border-[#45473d]/40 bg-[#171815] shadow-[-4px_0_12px_rgba(0,0,0,0.5)]"></div>

            {/* Utility pipes, including the pipe that leaks during the anomaly */}
            <div className="absolute left-[12%] top-8 bottom-12 w-3 border-x border-[#4c554f] bg-[#222722] shadow-[2px_0_5px_rgba(0,0,0,0.8)]">
              <div className="absolute left-[-3px] top-[35%] h-2 w-5 border-y border-[#57594f] bg-[#33352e]"></div>
              {isPipesLeaking && (
                <div className="absolute left-1/2 top-[35%] z-20 flex -translate-x-1/2 flex-col items-center">
                  <span className="h-10 w-1 bg-gradient-to-b from-blue-300/80 via-blue-500/60 to-transparent"></span>
                  <span className="h-2 w-2 rounded-full bg-blue-300/80 shadow-[0_0_8px_3px_rgba(96,165,250,0.35)] animate-bounce"></span>
                  <span className="mt-1 h-1 w-8 rounded-full bg-blue-300/30 blur-[1px]"></span>
                </div>
              )}
            </div>
            <div className="absolute left-[34%] right-[12%] top-8 h-3 border-y border-[#4b5149] bg-[#232722] shadow-[0_3px_5px_rgba(0,0,0,0.8)]">
              <div className="absolute right-[20%] top-[-4px] h-5 w-2 bg-[#383b34]"></div>
            </div>
            <div className="absolute right-[12%] top-8 h-16 w-3 border-x border-[#4b5149] bg-[#232722]"></div>

            {/* Rusted maintenance locker, unnaturally open during the anomaly */}
            <div className="absolute bottom-12 left-[40%] top-[48%] z-[2] w-[13%] border border-[#45473f] bg-[linear-gradient(90deg,#181a17,#30322d_50%,#111310)] shadow-[4px_4px_10px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-y-0 left-[8%] border-l border-[#77796d]/25"></div>
              <div className="absolute right-[13%] top-1/2 h-1 w-1 rounded-full bg-[#85816a]/50"></div>
              {isLockerOpen && (
                <div className="absolute -right-[40%] top-0 h-full w-[62%] origin-left -skew-y-6 border border-[#53554b] bg-[#11120f] shadow-[8px_0_14px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-1 border border-black/60"></div>
                  <div className="absolute right-1 top-1/2 h-1 w-1 rounded-full bg-[#8d8061]/60"></div>
                </div>
              )}
            </div>

            {/* Shelving, crates, and stored equipment */}
            <div className="absolute bottom-12 left-[7%] top-[42%] w-[30%]">
              <div className="absolute inset-y-0 left-1/2 w-1 bg-[#55594f]"></div>
              <div className="absolute inset-x-0 top-1/3 h-1 bg-[#66695d] shadow-[0_3px_5px_rgba(0,0,0,0.7)]"></div>
              <div className="absolute inset-x-0 top-2/3 h-1 bg-[#66695d] shadow-[0_3px_5px_rgba(0,0,0,0.7)]"></div>
              <div className="absolute left-1 top-2 h-[28%] w-[42%] border border-[#756849] bg-[#464332]">
                <span className="absolute inset-x-0 top-1/2 border-t border-[#9c8b62]/40"></span>
              </div>
              <div className="absolute right-1 top-2 h-[28%] w-[42%] border border-[#756849] bg-[#38382e]"></div>
              <div className="absolute bottom-[5%] left-1 h-[27%] w-[42%] border border-[#756849] bg-[#3e3b2e]"></div>
            </div>

            {/* Mysterious figure standing in the dark aisle */}
            {isFigure && (
              <div className="absolute bottom-12 left-[43%] z-[3] flex h-[48%] w-10 flex-col items-center">
                <div className="h-5 w-5 rounded-full border border-[#171915] bg-[#090a08] shadow-[0_0_12px_2px_rgba(0,0,0,0.9)]"></div>
                <div className="mt-1 h-14 w-9 rounded-t-[45%] bg-gradient-to-b from-[#090a08] to-black shadow-[0_0_12px_rgba(0,0,0,0.9)]"></div>
                <div className="flex w-10 justify-between">
                  <div className="h-8 w-3 -rotate-6 bg-black"></div>
                  <div className="h-8 w-3 rotate-6 bg-black"></div>
                </div>
              </div>
            )}

            {/* Storage boxes visibly displaced from their shelf */}
            <div className={`absolute bottom-12 right-[9%] z-[4] flex h-[48%] w-[32%] items-end justify-center transition-transform duration-700 ${isBoxesMoved ? 'translate-x-5 -translate-y-3 rotate-6' : ''}`}>
              <div className="absolute bottom-0 left-0 h-[55%] w-[46%] border border-[#786d4d] bg-[#4b4635] shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]">
                <div className="absolute left-1/2 top-0 h-full border-l border-[#a09368]/40"></div>
                <div className="absolute left-0 top-1/3 w-full border-t border-[#a09368]/40"></div>
              </div>
              <div className="absolute bottom-0 right-0 h-[68%] w-[48%] border border-[#786d4d] bg-[#3d3a2e] shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-x-0 top-1/2 border-t border-[#a09368]/40"></div>
                <div className="absolute left-1/2 top-0 h-full border-l border-[#a09368]/40"></div>
              </div>
              <div className={`absolute bottom-[58%] left-[14%] h-[35%] w-[46%] border border-[#897b56] bg-[#58513b] transition-transform duration-700 ${isBoxesMoved ? '-translate-x-4 -translate-y-5 -rotate-12' : ''}`}>
                <div className="absolute inset-x-0 top-1/2 border-t border-[#b0a078]/40"></div>
              </div>
            </div>

            {/* A full figure peering around the stacked boxes */}
            {isSilhouetteBoxes && (
              <div className="absolute bottom-[30%] right-[29%] z-[5] flex h-[38%] w-8 flex-col items-center">
                <div className="h-5 w-5 rounded-full border border-[#8d9380]/40 bg-[#10120f] shadow-[0_0_10px_2px_rgba(180,190,160,0.2)]">
                  <div className="mx-auto mt-2 h-1 w-2 bg-red-300/70 blur-[1px]"></div>
                </div>
                <div className="h-12 w-7 rounded-t-full bg-[#080908] shadow-[0_0_10px_rgba(0,0,0,0.9)]"></div>
              </div>
            )}

            <div className={`absolute inset-0 z-[6] pointer-events-none transition-opacity duration-1000 ${isLightDisappears ? 'bg-black/70 opacity-100' : 'opacity-0'}`}></div>
            <div className="absolute inset-0 z-[7] pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,transparent_8%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.82)_100%),linear-gradient(0deg,rgba(20,25,20,0.42),transparent_48%)]"></div>
            <div className="absolute bottom-12 left-0 right-0 z-[7] h-16 pointer-events-none bg-[linear-gradient(0deg,rgba(95,105,93,0.12),transparent)] blur-sm"></div>
            <div className="absolute bottom-14 left-3 z-10 rounded-sm bg-black/60 px-1.5 py-1 text-[9px] font-bold tracking-[0.2em] text-cctv-green/55">B1 // STORAGE NORTH</div>
          </div>
        );
      }

      case 'CAM_04': { // PARKING AREA
        const isVehicleMissing = anomalyId === 'CAM04_VEHICLE_DISAPPEARS';
        const isVehicleMoved = anomalyId === 'CAM04_VEHICLE_MOVED';
        const isFigureCars = anomalyId === 'CAM04_FIGURE_CARS';
        const isGateOpen = anomalyId === 'CAM04_GATE_OPEN';
        const isShadowPillar = anomalyId === 'CAM04_SHADOW_PILLAR';
        const isDriverInCar = anomalyId === 'CAM04_GHOST_DRIVER';

        return (
          <div className="relative w-full h-full bg-[#080a0c] overflow-hidden border border-gray-800">
            {/* Garage depth, concrete floor, and painted parking bays */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#101416_0%,#080a0b_48%,#151615_49%,#080909_100%)]"></div>
            <div className="absolute inset-x-0 top-[39%] h-px bg-[#777b72]/15"></div>
            <div className="absolute inset-x-0 top-[42%] h-[58%] bg-[linear-gradient(90deg,transparent_14%,rgba(145,144,127,0.2)_14.3%,transparent_14.7%,transparent_49.7%,rgba(145,144,127,0.2)_50%,transparent_50.3%,transparent_84.7%,rgba(145,144,127,0.2)_85%,transparent_85.3%)] [clip-path:polygon(36%_0,64%_0,100%_100%,0_100%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_39%,rgba(104,126,133,0.11),transparent_48%),linear-gradient(90deg,rgba(0,0,0,0.55),transparent_22%,transparent_78%,rgba(0,0,0,0.65))]"></div>

            {/* Fluorescent fixtures and their pools of light */}
            <div className="absolute left-[22%] top-[8%] h-1 w-14 bg-[#8c978d] shadow-[0_0_11px_3px_rgba(123,151,146,0.18)]"></div>
            <div className="absolute right-[20%] top-[8%] h-1 w-14 bg-[#38403e] shadow-[0_0_7px_2px_rgba(123,151,146,0.08)]"></div>
            <div className="absolute left-[20%] top-[10%] h-[45%] w-20 bg-[linear-gradient(180deg,rgba(134,165,158,0.1),transparent)] [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)]"></div>

            {/* Concrete pillars and marked support numbers */}
            <div className={`absolute bottom-0 left-[8%] top-[14%] w-7 border-x border-[#414541] bg-[linear-gradient(90deg,#151817,#303432_45%,#111413)] shadow-[5px_0_14px_rgba(0,0,0,0.7)] ${isShadowPillar ? 'after:absolute after:inset-y-0 after:left-full after:w-16 after:bg-black/90 after:blur-md' : ''}`}>
              <span className="absolute top-[35%] w-full border-y border-[#b8b59c]/25 bg-[#a2a08a]/10 py-1 text-center text-[8px] text-gray-400/45">B2</span>
            </div>
            <div className="absolute bottom-0 right-[8%] top-[14%] w-7 border-x border-[#414541] bg-[linear-gradient(90deg,#151817,#303432_45%,#111413)] shadow-[-5px_0_14px_rgba(0,0,0,0.7)]">
              <span className="absolute top-[35%] w-full border-y border-[#b8b59c]/25 bg-[#a2a08a]/10 py-1 text-center text-[8px] text-gray-400/45">B3</span>
            </div>

            {/* Parking barrier: lowered across the lane, raised when open */}
            <div className="absolute left-[13%] top-[32%] z-[3] h-3 w-3 rounded-sm border border-gray-500 bg-gray-700">
              <div className={`absolute left-2 top-1/2 h-1.5 w-36 origin-left border border-gray-500 bg-[repeating-linear-gradient(110deg,#e5e2d5_0_10px,#b02c24_10px_20px)] shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-transform duration-700 ${isGateOpen ? '-rotate-[58deg]' : ''}`}></div>
              {isGateOpen && <span className="absolute left-5 top-6 whitespace-nowrap text-[8px] font-bold tracking-widest text-red-300">BARRIER RAISED</span>}
            </div>

            {/* Neighboring parked cars make an empty bay obvious */}
            <div className="absolute bottom-[13%] left-[15%] h-[22%] w-[22%] rounded-t-[35%] border border-[#454b48]/40 bg-[linear-gradient(160deg,#292e2d,#0c0e0e_65%)] shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
              <div className="absolute left-[18%] right-[18%] top-[15%] h-[36%] rounded-t-[45%] border border-gray-500/30 bg-[#17201f]"></div>
              <div className="absolute bottom-0 left-[12%] h-3 w-3 rounded-sm bg-black"></div>
              <div className="absolute bottom-0 right-[12%] h-3 w-3 rounded-sm bg-black"></div>
              <div className="absolute bottom-[18%] left-1 h-2 w-2 rounded-sm bg-amber-100/70"></div>
            </div>
            <div className="absolute bottom-[15%] right-[15%] h-[20%] w-[20%] rounded-t-[35%] border border-[#414946]/40 bg-[linear-gradient(160deg,#222827,#0b0d0d_65%)] shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
              <div className="absolute left-[18%] right-[18%] top-[15%] h-[36%] rounded-t-[45%] border border-gray-500/30 bg-[#17201f]"></div>
              <div className="absolute bottom-0 left-[12%] h-3 w-3 rounded-sm bg-black"></div>
              <div className="absolute bottom-0 right-[12%] h-3 w-3 rounded-sm bg-black"></div>
              <div className="absolute bottom-[18%] right-1 h-2 w-2 rounded-sm bg-red-300/60"></div>
            </div>

            {/* Center-bay sedan, visibly absent or out of its marked space */}
            {!isVehicleMissing && (
              <div
                className={`absolute bottom-[13%] z-[4] h-[28%] w-[34%] transition-transform duration-700 ${isVehicleMoved ? 'drop-shadow-[0_0_10px_rgba(220,70,50,0.55)]' : ''}`}
                style={{ left: '50%', transform: isVehicleMoved ? 'translateX(-24%) rotate(17deg)' : 'translateX(-50%)' }}
              >
                <div className={`absolute bottom-[13%] left-0 right-0 h-[55%] rounded-[30%_30%_15%_15%] border bg-[linear-gradient(180deg,#343b39_0%,#1c2221_38%,#090b0b_100%)] shadow-[0_10px_15px_rgba(0,0,0,0.85)] ${isVehicleMoved ? 'border-red-300/60' : 'border-[#535b57]/35'}`}>
                  <div className="absolute left-[20%] right-[20%] top-[-42%] h-[58%] rounded-t-[45%] border border-gray-400/40 bg-[linear-gradient(180deg,#3e4843,#151b19)]"></div>
                  <div className="absolute left-[25%] top-[-35%] h-[42%] w-[22%] border border-gray-400/20 bg-[#82908a]/10"></div>
                  <div className="absolute right-[25%] top-[-35%] h-[42%] w-[22%] border border-gray-400/20 bg-[#82908a]/10"></div>
                  {isDriverInCar && (
                    <div className="absolute left-[34%] top-[-43%] z-[2] h-[40%] w-[30%] rounded-t-full bg-[#030404] shadow-[0_0_10px_3px_rgba(0,0,0,0.8)]">
                      <div className="absolute left-[28%] top-[35%] h-0.5 w-1 bg-[#c4b8a0]/75 shadow-[5px_0_2px_rgba(196,184,160,0.5)]"></div>
                    </div>
                  )}
                  <div className="absolute bottom-[18%] left-1 h-2 w-3 rounded-sm bg-amber-100/80 shadow-[0_0_6px_rgba(255,230,150,0.4)]"></div>
                  <div className="absolute bottom-[18%] right-1 h-2 w-3 rounded-sm bg-red-300/80 shadow-[0_0_6px_rgba(255,100,100,0.4)]"></div>
                  <div className="absolute -bottom-2 left-[15%] h-4 w-6 rounded-md border border-gray-700 bg-black"></div>
                  <div className="absolute -bottom-2 right-[15%] h-4 w-6 rounded-md border border-gray-700 bg-black"></div>
                </div>
              </div>
            )}

            {/* Unnatural figure between the parked cars */}
            {isFigureCars && (
              <div className="absolute bottom-[27%] left-[39%] z-[5] flex h-[38%] w-8 flex-col items-center">
                <div className="h-5 w-5 rounded-full border border-gray-500/30 bg-[#090a09] shadow-[0_0_12px_2px_rgba(0,0,0,0.9)]"></div>
                <div className="h-12 w-7 rounded-t-[45%] bg-black"></div>
                <div className="flex w-8 justify-between">
                  <div className="h-7 w-2.5 -rotate-6 bg-black"></div>
                  <div className="h-7 w-2.5 rotate-6 bg-black"></div>
                </div>
              </div>
            )}

            {/* Water stain cast across the pillar and floor */}
            {isShadowPillar && (
              <div className="absolute bottom-[11%] left-[8%] top-[16%] z-[2] w-[28%] bg-[linear-gradient(115deg,transparent_25%,rgba(0,0,0,0.92)_48%,rgba(0,0,0,0.55)_62%,transparent_82%)]"></div>
            )}

            <div className="absolute inset-0 z-[7] pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,transparent_5%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.82)_100%),linear-gradient(0deg,rgba(20,26,29,0.48),transparent_52%)]"></div>
            <div className="absolute bottom-0 left-0 right-0 z-[7] h-[28%] pointer-events-none bg-[linear-gradient(0deg,rgba(117,132,130,0.13),transparent)] blur-md"></div>
            <div className="absolute inset-x-[10%] top-[39%] z-[7] h-px pointer-events-none bg-red-900/20 shadow-[0_0_18px_5px_rgba(127,29,29,0.08)]"></div>
            <div className="absolute bottom-2 left-3 z-10 rounded-sm bg-black/60 px-1.5 py-1 text-[9px] font-bold tracking-[0.2em] text-cctv-green/55">P2 // PARKING BAY B</div>
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
