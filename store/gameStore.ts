import { create } from 'zustand';

export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';

export type AnomalyCategory = 'OBJECT' | 'ENTITY' | 'CAMERA' | 'ENVIRONMENT' | 'SPECIAL';

export interface Anomaly {
  id: string;
  runtimeId: string;
  cameraId: string;
  category: AnomalyCategory;
  name: string;
  description: string;
  severity: number;
  spawnWeight: number;
  duration: number;
}

export interface GameState {
  gameStatus: GameStatus;
  remainingTime: number;
  score: number;
  lives: number;
  activeAnomalies: Anomaly[];
  detectedAnomalies: number;
  missedAnomalies: number;
  falseReports: number;
  selectedCameraId: string;
  activityLog: { id: string; message: string; type: 'success' | 'warning' | 'info' }[];

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (status: 'GAME_OVER' | 'VICTORY') => void;
  reportAnomaly: (cameraId: string) => void;
  addAnomaly: (anomaly: Anomaly) => void;
  resolveAnomaly: (runtimeId: string) => void;
  expireAnomaly: (runtimeId: string) => void;
  setSelectedCameraId: (id: string) => void;
  tick: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameStatus: 'MENU',
  remainingTime: 360,
  score: 0,
  lives: 3,
  activeAnomalies: [],
  detectedAnomalies: 0,
  missedAnomalies: 0,
  falseReports: 0,
  selectedCameraId: 'CAM_01',
  activityLog: [],

  startGame: () => set({
    gameStatus: 'PLAYING',
    remainingTime: 360,
    score: 0,
    lives: 3,
    activeAnomalies: [],
    detectedAnomalies: 0,
    missedAnomalies: 0,
    falseReports: 0,
    activityLog: [{ id: Math.random().toString(), message: 'Shift started.', type: 'info' }]
  }),

  pauseGame: () => set({ gameStatus: 'PAUSED' }),
  resumeGame: () => set({ gameStatus: 'PLAYING' }),

  endGame: (status) => set({ gameStatus: status }),

  reportAnomaly: (cameraId) => {
    const { activeAnomalies, score, detectedAnomalies, falseReports, activityLog } = get();
    const anomaly = activeAnomalies.find(a => a.cameraId === cameraId);

    if (anomaly) {
      set({
        activeAnomalies: activeAnomalies.filter(a => a.runtimeId !== anomaly.runtimeId),
        score: Math.max(0, score + 100),
        detectedAnomalies: detectedAnomalies + 1,
        activityLog: [...activityLog, { id: Math.random().toString(), message: `Correctly reported anomaly on ${cameraId}.`, type: 'success' }]
      });
    } else {
      set({
        score: Math.max(0, score - 50),
        falseReports: falseReports + 1,
        activityLog: [...activityLog, { id: Math.random().toString(), message: `False report on ${cameraId}.`, type: 'warning' }]
      });
    }
  },

  addAnomaly: (anomaly) => set(state => ({ activeAnomalies: [...state.activeAnomalies, anomaly] })),

  resolveAnomaly: (runtimeId) => set(state => ({
    activeAnomalies: state.activeAnomalies.filter(a => a.runtimeId !== runtimeId)
  })),

  expireAnomaly: (runtimeId) => set(state => {
    const anomaly = state.activeAnomalies.find(a => a.runtimeId === runtimeId);
    if (!anomaly) return state;
    return {
      activeAnomalies: state.activeAnomalies.filter(a => a.runtimeId !== runtimeId),
      missedAnomalies: state.missedAnomalies + 1,
      lives: Math.max(0, state.lives - 1),
      activityLog: [...state.activityLog, { id: Math.random().toString(), message: `Missed anomaly on ${anomaly.cameraId}.`, type: 'warning' }]
    };
  }),

  setSelectedCameraId: (id) => set({ selectedCameraId: id }),

  tick: () => set(state => {
    if (state.gameStatus !== 'PLAYING') return state;
    if (state.remainingTime <= 0) return { gameStatus: 'VICTORY' };
    if (state.lives <= 0) return { gameStatus: 'GAME_OVER' };
    return { remainingTime: state.remainingTime - 1 };
  })
}));
