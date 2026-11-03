import { useGameStore } from '../../store/gameStore';

export default function GameTimer() {
  const remainingTime = useGameStore(state => state.remainingTime);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 60);
    const mins = seconds % 60;
    const displayHour = (12 + hours) % 12 || 12;
    const ampm = hours < 6 ? 'AM' : 'PM';
    return `${displayHour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  return <span className="font-mono text-sm text-gray-300">{formatTime(360 - remainingTime)}</span>;
}
