import r from "raylib";
import Enemy from "../enemies/enemy";
import { warn } from "console";
import Base from "../bases/base";
import { Wave } from "./wave";
import { GameClock } from "../utils/game-clock";
import { Money } from "../utils/money";

export const waves = [
  {
    totalEnemies: 6,
    enemiesPerWave: 1,
    waveTime: 10
  },

  {
    totalEnemies: 6,
    enemiesPerWave: 2,
    waveTime: 10
  },

  {
    totalEnemies: 8,
    enemiesPerWave: 4,
    waveTime: 10
  }
];

export default class WaveManager {
  enemyPath: r.Vector2[];
  wave: Wave;
  waveCount: number = 0;
  base: Base;

  constructor(enemyPath: r.Vector2[], base: Base, private onWaveComplete: () => void, private onGameOver: () => void) {
    this.enemyPath = enemyPath;
    this.base = base;
    this.wave = new Wave(waves[0]);
  }

  onWaveCompleted() {
    console.log('wave count: ', this.waveCount, ' waves.length: ', waves.length);
    if (this.waveCount + 1 === waves.length) {
      this.onGameOver();
    } else {
      this.waveCount++;
    }
    this.onWaveComplete();
  }

  startWave() {
    this.wave = new Wave(waves[this.waveCount]);
  }

  waveNumber(): number {
    return this.waveCount;
  }

  update() {
    if (!GameClock.sixtyFramesPassed()) return;

    this.wave.enemies.forEach((enemy) => {
      if (enemy.currentPathIndex < this.enemyPath.length - 1) {
        enemy.currentPathIndex++;
      }
      // TODO: Change to base's position
      if (enemy.currentPathIndex == this.enemyPath.length - 1) {
        enemy.reachedBase = true;
        this.base.takeDamage();
      }
      // onDeath
      if (enemy.health <= 0) {
        Money.increase(10);
      }
    });

    this.removeDeadEnemies();
    const completed = this.wave.completed();
    if (completed) {
      this.onWaveCompleted();
    } else {
      this.wave.updateWave();
    }
  }

  removeDeadEnemies() {
    this.wave.enemies = this.wave.enemies.filter(enemy => enemy.health > 0 && !enemy.reachedBase);
  }

  drawWave() {
    // Only draw if we have a valid position
    this.wave.enemies.forEach((enemy) => {
      if (enemy.currentPathIndex < this.enemyPath.length - 1) {
        const currentPos = this.getInterpolatedPosition(enemy.currentPathIndex);
        enemy.draw(currentPos);
      }
    });
  }

  enemies(): Enemy[] {
    return this.wave.enemies;
  }

  //Linear interpolation: Uses the formula start + (end - start) * t where t goes from 0 to 1
  //Smooth movement: Instead of jumping between waypoints, the enemy smoothly moves along the path
  //How it Works:
  //When frameCounter = 0, t = 0 → enemy is at current waypoint
  //When frameCounter = 30, t = 0.5 → enemy is halfway between waypoints
  //When frameCounter = 60, t = 1 → enemy reaches next waypoint
  private getInterpolatedPosition(currentPathIndex: number): r.Vector2 {
    // If we're at the last waypoint, just return it
    if (currentPathIndex >= this.enemyPath.length - 1) {
      return this.enemyPath[currentPathIndex];
    }

    const currentWaypoint = this.enemyPath[currentPathIndex];
    const nextWaypoint = this.enemyPath[currentPathIndex + 1];

    // Calculate interpolation factor (0 to 1)
    const t = GameClock.translitionFactor();

    // Interpolate between current and next waypoint
    const interpolatedPos: r.Vector2 = {
      x: currentWaypoint.x + (nextWaypoint.x - currentWaypoint.x) * t,
      y: currentWaypoint.y + (nextWaypoint.y - currentWaypoint.y) * t,
    };

    return interpolatedPos;
  }
}
