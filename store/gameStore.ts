import { create } from 'zustand';
import { soundEngine } from '../components/game/AudioController';

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

export interface HighScoreRecord {
  score: number;
  result: 'GAME_OVER' | 'VICTORY';
  date: string;
}

export interface GameState {
  gameStatus: GameStatus;
  remainingTime: number;
  score: number;
  highScores: HighScoreRecord[];
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
  loadHighScores: () => void;
  reportAnomaly: (cameraId: string) => void;
  addAnomaly: (anomaly: Anomaly) => void;
  resolveAnomaly: (runtimeId: string) => void;
  expireAnomaly: (runtimeId: string) => void;
  setSelectedCameraId: (id: string) => void;
  tick: () => void;
}

const HIGH_SCORES_STORAGE_KEY = 'night-watch-high-scores';
const MAX_HIGH_SCORES = 10;

const readHighScores = (): HighScoreRecord[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedScores: unknown = JSON.parse(
      window.localStorage.getItem(HIGH_SCORES_STORAGE_KEY) ?? '[]'
    );
    if (!Array.isArray(storedScores)) {
      throw new Error('Stored high scores must be an array.');
    }

    return storedScores.filter(
      (record): record is HighScoreRecord =>
        typeof record === 'object' &&
        record !== null &&
        typeof record.score === 'number' &&
        (record.result === 'GAME_OVER' || record.result === 'VICTORY') &&
        typeof record.date === 'string'
    );
  } catch (error) {
    console.error('Unable to read saved high scores.', error);
    return [];
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  gameStatus: 'MENU',
  remainingTime: 360,
  score: 0,
  highScores: [],
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

  loadHighScores: () => set({ highScores: readHighScores() }),

  endGame: (status) => {
    if (get().gameStatus !== 'PLAYING') return;

    const newRecord: HighScoreRecord = {
      score: get().score,
      result: status,
      date: new Date().toISOString()
    };
    const highScores = [...readHighScores(), newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_HIGH_SCORES);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(highScores));
      } catch (error) {
        console.error('Unable to save high scores.', error);
      }
    }

    set({ gameStatus: status, highScores });
  },

  reportAnomaly: (cameraId) => {
    const { activeAnomalies, score, detectedAnomalies, falseReports, activityLog } = get();
    const anomaly = activeAnomalies.find(a => a.cameraId === cameraId);

    if (anomaly) {
      soundEngine.playSuccess();
      set({
        activeAnomalies: activeAnomalies.filter(a => a.runtimeId !== anomaly.runtimeId),
        score: Math.max(0, score + 100),
        detectedAnomalies: detectedAnomalies + 1,
        activityLog: [...activityLog, { id: Math.random().toString(), message: `Correctly reported anomaly on ${cameraId}.`, type: 'success' }]
      });
    } else {
      soundEngine.playError();
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
    soundEngine.playError();
    return {
      activeAnomalies: state.activeAnomalies.filter(a => a.runtimeId !== runtimeId),
      missedAnomalies: state.missedAnomalies + 1,
      lives: Math.max(0, state.lives - 1),
      activityLog: [...state.activityLog, { id: Math.random().toString(), message: `Missed anomaly on ${anomaly.cameraId}.`, type: 'warning' }]
    };
  }),

  setSelectedCameraId: (id) => {
    soundEngine.playClick();
    set({ selectedCameraId: id });
  },

  tick: () => {
    const state = get();
    if (state.gameStatus !== 'PLAYING') return;
    if (state.remainingTime <= 0) {
      get().endGame('VICTORY');
      return;
    }
    if (state.lives <= 0) {
      get().endGame('GAME_OVER');
      return;
    }
    set({ remainingTime: state.remainingTime - 1 });
  }
}));
