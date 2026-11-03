'use client';
import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { anomalyEngine } from '../../game/anomalyEngine';
import GameHeader from './GameHeader';
import GameStatus from './GameStatus';
import CameraGrid from './CameraGrid';
import CameraNavigation from './CameraNavigation';
import GameOverlay from './GameOverlay';
import { cameras } from '../../data/cameraData';

export default function GameDashboard() {
  const {
    gameStatus,
    startGame,
    tick,
    selectedCameraId,
    setSelectedCameraId,
    lives,
    remainingTime,
    endGame
  } = useGameStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game on mount
  useEffect(() => {
    startGame();
    return () => {
      anomalyEngine.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startGame]);

  // Handle game loop and engine
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      anomalyEngine.start();
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      anomalyEngine.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, tick]);

  // Check for game over conditions
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      if (lives <= 0) {
        endGame('GAME_OVER');
      } else if (remainingTime <= 0) {
        endGame('VICTORY');
      }
    }
  }, [lives, remainingTime, gameStatus, endGame]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground select-none relative overflow-hidden">
      {/* Global Glitch Effect for missed anomalies could go here */}

      <GameHeader />
      <GameStatus />

      <main className="flex-1 flex flex-col p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="text-xs font-mono text-gray-500 mb-[-8px] flex justify-between">
          <span>SURVEILLANCE ARRAY // 4 CHANNELS ACTIVE</span>
          <span className="text-cctv-green/50 animate-pulse">SYSTEM STATUS: NOMINAL</span>
        </div>
        <CameraGrid
          cameras={cameras}
          selectedCameraId={selectedCameraId}
          onSelectCamera={setSelectedCameraId}
        />
      </main>

      <CameraNavigation
        cameras={cameras}
        selectedCameraId={selectedCameraId}
        onSelectCamera={setSelectedCameraId}
      />

      <GameOverlay />

      {/* CRT Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}
