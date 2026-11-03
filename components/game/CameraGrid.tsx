'use client';
import { Camera } from '../../types/game';
import CameraFeed from './CameraFeed';

interface CameraGridProps {
  cameras: Camera[];
  selectedCameraId: string;
  onSelectCamera: (id: string) => void;
}

export default function CameraGrid({ cameras, selectedCameraId, onSelectCamera }: CameraGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
      {cameras.map((cam) => (
        <CameraFeed
          key={cam.id}
          cameraId={cam.id}
          isSelected={selectedCameraId === cam.id}
          onSelect={() => onSelectCamera(cam.id)}
        />
      ))}
    </div>
  );
}
