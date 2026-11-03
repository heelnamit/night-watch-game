export interface Camera {
  id: string;
  name: string;
  location: string;
  active: boolean;
}

export interface GameStatus {
  shiftProgress: number;
  anomaliesDetected: number;
  anomaliesMissed: number;
  lives: number;
  score: number;
}
