'use client';
import { useState } from 'react';
import { cameras } from '../../data/cameraData';
import GameHeader from './GameHeader';
import GameStatus from './GameStatus';
import CameraGrid from './CameraGrid';
import CameraNavigation from './CameraNavigation';

export default function GameDashboard() {
  const [selectedCameraId, setSelectedCameraId] = useState(cameras[0].id);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground select-none">
      <GameHeader />
      <GameStatus />

      <main className="flex-1 flex flex-col p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="text-xs font-mono text-gray-500 mb-[-8px]">
          SURVEILLANCE ARRAY // 4 CHANNELS ACTIVE
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
    </div>
  );
}
