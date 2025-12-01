import Enemy from "../enemies/enemy";
import { GameClock } from "../utils/game-clock";

export class Wave {
  enemies: Enemy[] = [];
  private waveState: 'spawning' | 'waiting' = 'spawning';
  private enemiesSpawned: number = 0;
  private lastSpawnTime: number = -1;
  private waveStartTime: number = GameClock.getTime();
  enemyCount = 0;

  constructor(public wave: { totalEnemies: number, enemiesPerWave: number, waveTime: number }) { }

  completed(): boolean {
    if (this.enemyCount >= this.wave.totalEnemies) {
      if (this.enemies.length === 0) {
        return true;
      }
    }
    return false;
  }

  currentSecond = -1;

  updateWave() {
    this.currentSecond = GameClock.getTime();
    if (this.waveState === 'spawning') {
      this.spawn();
    } else if (this.waveState === 'waiting') {
      this.wait();
    }
  }

  wait() {
    const timeSinceWaveStart = this.currentSecond - this.waveStartTime;

    if (timeSinceWaveStart >= this.wave.waveTime) {
      // Reset for next wave
      if (this.enemyCount < this.wave.totalEnemies) {
        this.waveState = 'spawning';
        this.enemiesSpawned = 0;
        this.waveStartTime = GameClock.getTime();
      }
    }
  }

  spawn() {
    if (this.lastSpawnTime === this.currentSecond) {
      return;
    }

    if (this.enemiesSpawned >= this.wave.enemiesPerWave) {
      this.waveState = 'waiting';
      return;
    }

    this.enemyCount++;
    this.enemies.push(new Enemy(this.enemyCount));
    this.enemiesSpawned++;
    this.lastSpawnTime = this.currentSecond;
  }
}

