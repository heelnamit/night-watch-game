import { useGameStore, Anomaly } from '../store/gameStore';
import { ANOMALY_DEFINITIONS } from './anomalyDefinitions';

export class AnomalyEngine {
  private timer: NodeJS.Timeout | null = null;
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {}

  public start() {
    this.scheduleNextSpawn();
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.expirationTimers.forEach(timer => clearTimeout(timer));
    this.expirationTimers.clear();
  }

  private getDifficulty(progress: number): 'EASY' | 'NORMAL' | 'HARD' | 'NIGHTMARE' {
    if (progress < 0.25) return 'EASY';
    if (progress < 0.50) return 'NORMAL';
    if (progress < 0.75) return 'HARD';
    return 'NIGHTMARE';
  }

  private getSpawnInterval(difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'NIGHTMARE'): number {
    const intervals = {
      EASY: [9000, 14000],
      NORMAL: [6500, 10000],
      HARD: [4500, 7000],
      NIGHTMARE: [2500, 4000],
    } satisfies Record<typeof difficulty, [number, number]>;
    const [minimum, maximum] = intervals[difficulty];
    return Math.random() * (maximum - minimum) + minimum;
  }

  private getAnomalyDuration(duration: number, difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'NIGHTMARE'): number {
    const durationSettings = {
      EASY: { multiplier: 0.9, minimum: 12000 },
      NORMAL: { multiplier: 0.8, minimum: 10000 },
      HARD: { multiplier: 0.7, minimum: 8000 },
      NIGHTMARE: { multiplier: 0.55, minimum: 7000 },
    } satisfies Record<typeof difficulty, { multiplier: number; minimum: number }>;
    const { multiplier, minimum } = durationSettings[difficulty];
    return Math.max(minimum, duration * multiplier);
  }

  private scheduleNextSpawn() {
    const state = useGameStore.getState();
    if (state.gameStatus !== 'PLAYING') return;

    const progress = 1 - (state.remainingTime / 360);
    const difficulty = this.getDifficulty(progress);
    const interval = this.getSpawnInterval(difficulty);

    this.timer = setTimeout(() => {
      this.spawnAnomaly(difficulty);
      this.scheduleNextSpawn();
    }, interval);
  }

  private spawnAnomaly(difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'NIGHTMARE') {
    const state = useGameStore.getState();
    if (state.gameStatus !== 'PLAYING') return;

    const maxActive = difficulty === 'NIGHTMARE' ? 3 : difficulty === 'HARD' ? 2 : 1;
    if (state.activeAnomalies.length >= maxActive) return;

    // Filter definitions matching difficulty
    const validDefs = ANOMALY_DEFINITIONS.filter(def => {
      // Don't spawn on camera if it already has an active anomaly
      const cameraHasAnomaly = state.activeAnomalies.some(a => a.cameraId === def.cameraId);
      if (cameraHasAnomaly) return false;

      const difficultyRank = { EASY: 0, NORMAL: 1, HARD: 2, NIGHTMARE: 3 };
      return difficultyRank[def.minimumDifficulty] <= difficultyRank[difficulty];
    });

    if (validDefs.length === 0) return;

    // Pick random definition based on spawnWeight
    const totalWeight = validDefs.reduce((sum, d) => sum + d.spawnWeight, 0);
    let randomWeight = Math.random() * totalWeight;
    let selectedDef = validDefs[0];

    for (const def of validDefs) {
      if (randomWeight < def.spawnWeight) {
        selectedDef = def;
        break;
      }
      randomWeight -= def.spawnWeight;
    }

    const runtimeId = `ANOM_${Math.random().toString(36).substring(2, 9)}`;
    const duration = this.getAnomalyDuration(selectedDef.duration, difficulty);
    const newAnomaly: Anomaly = {
      id: selectedDef.id,
      runtimeId,
      cameraId: selectedDef.cameraId,
      category: selectedDef.category,
      name: selectedDef.name,
      description: selectedDef.description,
      severity: selectedDef.severity,
      spawnWeight: selectedDef.spawnWeight,
      duration,
    };

    useGameStore.getState().addAnomaly(newAnomaly);

    // Schedule expiration
    const expTimer = setTimeout(() => {
      const currentState = useGameStore.getState();
      if (currentState.activeAnomalies.some(a => a.runtimeId === runtimeId)) {
        currentState.expireAnomaly(runtimeId);
      }
      this.expirationTimers.delete(runtimeId);
    }, duration);

    this.expirationTimers.set(runtimeId, expTimer);
  }
}

export const anomalyEngine = new AnomalyEngine();
