import { useGameStore, Anomaly } from '../store/gameStore';
import { ANOMALY_DEFINITIONS, AnomalyDefinition } from './anomalyDefinitions';

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
    switch (difficulty) {
      case 'EASY': return Math.random() * 10000 + 15000; // 15-25s
      case 'NORMAL': return Math.random() * 8000 + 12000;  // 12-20s
      case 'HARD': return Math.random() * 7000 + 9000;   // 9-16s
      case 'NIGHTMARE': return Math.random() * 6000 + 7000; // 7-13s
    }
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

    const maxActive = difficulty === 'NIGHTMARE' ? 2 : 1;
    if (state.activeAnomalies.length >= maxActive) return;

    // Filter definitions matching difficulty
    const validDefs = ANOMALY_DEFINITIONS.filter(def => {
      // Don't spawn on camera if it already has an active anomaly
      const cameraHasAnomaly = state.activeAnomalies.some(a => a.cameraId === def.cameraId);
      if (cameraHasAnomaly) return false;

      // Check difficulty criteria
      if (def.minimumDifficulty === 'NIGHTMARE' && difficulty !== 'NIGHTMARE') return false;
      if (def.minimumDifficulty === 'HARD' && difficulty === 'EASY') return false;
      return true;
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
    const newAnomaly: Anomaly = {
      id: selectedDef.id,
      runtimeId,
      cameraId: selectedDef.cameraId,
      category: selectedDef.category,
      name: selectedDef.name,
      description: selectedDef.description,
      severity: selectedDef.severity,
      spawnWeight: selectedDef.spawnWeight,
      duration: selectedDef.duration,
    };

    useGameStore.getState().addAnomaly(newAnomaly);

    // Schedule expiration
    const expTimer = setTimeout(() => {
      const currentState = useGameStore.getState();
      if (currentState.activeAnomalies.some(a => a.runtimeId === runtimeId)) {
        currentState.expireAnomaly(runtimeId);
      }
      this.expirationTimers.delete(runtimeId);
    }, selectedDef.duration);

    this.expirationTimers.set(runtimeId, expTimer);
  }
}

export const anomalyEngine = new AnomalyEngine();
