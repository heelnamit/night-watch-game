'use client';
import { Camera } from '../../types/game';

interface CameraNavProps {
  cameras: Camera[];
  selectedCameraId: string;
  onSelectCamera: (id: string) => void;
}

export default function CameraNavigation({ cameras, selectedCameraId, onSelectCamera }: CameraNavProps) {
  const selectedCam = cameras.find(c => c.id === selectedCameraId) || cameras[0];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border-t border-gray-800 bg-accent/30 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">ACTIVE FEED:</span>
        <span className="text-cctv-green font-bold">{selectedCam.id} — {selectedCam.name.toUpperCase()}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => onSelectCamera(cam.id)}
            className={`px-3 py-1.5 border transition-colors ${
              selectedCameraId === cam.id
                ? 'border-cctv-green bg-cctv-green/10 text-cctv-green font-bold'
                : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
            }`}
          >
            {cam.id}
          </button>
        ))}
      </div>
    </div>
  );
}
