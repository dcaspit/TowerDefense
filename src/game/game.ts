
import r from "raylib";
import GameMap from "../map/gameMap";
import { screenHeight, screenWidth } from "../utils/consts";
import WaveManager, { waves } from "../wave/waveManager";
import { Tower } from "../towers/tower";
import { RightPanel } from "../panels/rightPanel";
import { TopPanel } from "../panels/topPanel";
import { GameClock } from "../utils/game-clock";
import { Projectile } from "../towers/projectile";
import { Textures } from "../utils/textures";
import { Money } from "../utils/money";
import { Player } from "../player/Player";

export class Game {
  private pause = true;
  private waveCompleted = false;
  private towers: Tower[] = [];
  private map: GameMap;
  private waveMgr: WaveManager;
  private projectiles: Projectile[] = [];
  private player: Player = new Player();

  private addTower = (pos: r.Vector2) => {
    this.towers.push(new Tower(pos.x, pos.y));
  };

  private onBaseDeath = () => {
    this.projectiles = [];
    this.pause = true;
  };

  private onWaveCompleted = () => {
    this.projectiles = [];
    this.waveCompleted = true;
    GameClock.count(5, () => {
      this.waveCompleted = false;
      this.pause = true;
    });
  };

  private onStart = () => {
    this.pause = !this.pause;
    if (this.pause) {
      this.projectiles = [];
    } else {
      this.waveMgr.startWave();
    }
  };

  private rightPanel = new RightPanel(this.onStart);
  private topPanel = new TopPanel(waves.length);

  constructor(onGameOver: () => void) {
    this.map = new GameMap(this.addTower, this.onBaseDeath);
    this.waveMgr = new WaveManager(this.map.enemyPath, this.map.base, this.onWaveCompleted, onGameOver);
  }

  update() {
    // Update Phase
    GameClock.startTick();
    if (this.waveRunning()) {
      this.updateWave();
    }
    let attack = false;
    if (r.IsKeyDown(r.KEY_W)) {
      attack = this.player.update({ x: 0, y: -2 });
    }
    else if (r.IsKeyDown(r.KEY_S)) {
      attack = this.player.update({ x: 0, y: 2 });
    }
    else if (r.IsKeyDown(r.KEY_A)) {
      attack = this.player.update({ x: -2, y: 0 });
    }
    else if (r.IsKeyDown(r.KEY_D)) {
      attack = this.player.update({ x: 2, y: 0 });
    }
    else if (r.IsKeyPressed(r.KEY_RIGHT_CONTROL)) {
      attack = this.player.update({ x: 0, y: 0 }, true);
    }
    else {
      attack = this.player.update({ x: 0, y: 0 });
    }

    if (attack) this.tryToAttackEnemy();
    GameClock.endTick();
  }

  tryToAttackEnemy() {
    const enemies = this.waveMgr.enemies();
    console.log(`player pos -> x: ${this.player.position.x}, y: ${this.player.position.y}`);
    enemies.forEach((enemy, index) => {
      console.log(`enemy pos -> x: ${enemy.pos.x}, y: ${enemy.pos.y}`);
      // Find closest enemy within range
      let closestDistance = 25; // Tower range
      const towerCenterX = this.player.position.x + 20 / 2;
      const towerCenterY = this.player.position.y + 20 / 2;

      const dx = enemy.pos.x + enemy.size / 2 - towerCenterX;
      const dy = enemy.pos.y + enemy.size / 2 - towerCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 25) {
        enemy.takeDamage(5);
      }
    });
  }

  private updateWave() {
    this.projectiles = this.projectiles.filter((p) => p.state !== 'reached');
    this.waveMgr.update();
    const enemies = this.waveMgr.enemies();
    if (enemies.length !== 0) {
      this.towers.forEach((tower) => {
        const projectile = tower.isEnemyWithinTowerRange(enemies);
        if (projectile !== null) {
          this.projectiles.push(projectile);
        }
      });
    }
    this.projectiles.forEach((p) => {
      p.updateProjectile();
    });
  }

  draw() {
    //Draw Phase
    this.map.drawMap(this.pause);
    if (this.waveRunning()) {
      this.drawWave();
    } else {
      this.drawPause();
    }

    this.rightPanel.draw(this.pause);
    this.topPanel.draw(this.waveMgr.waveNumber(), this.waveMgr.wave);
    this.player.drawEnemyTexture();
  }

  private drawWave() {
    this.waveMgr.drawWave();
    this.towers.forEach((tower) => {
      tower.draw();
    });
    this.projectiles.forEach((p) => {
      p.drawProjectile();
    });
  }

  private drawPause() {
    this.towers.forEach((tower) => {
      tower.draw();
    });
    if (this.waveCompleted) {
      r.DrawRectangle(screenWidth / 2 - 50, screenHeight / 2 - 25, 100, 50, r.RED);
      r.DrawText('Wave Completed', (screenWidth / 2 - 50) + 10, (screenHeight / 2 - 25) + 20, 15, r.BLACK);
    }
  }

  private waveRunning(): boolean {
    return !this.pause && !this.waveCompleted;
  }
}
