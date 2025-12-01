import r from 'raylib';
import { screenWidth } from '../utils/consts';
import { Money } from '../utils/money';
import { Wave } from '../wave/wave';

export class TopPanel {
  bgWidth = screenWidth - 150;
  bgHeight = 80; // topMargin
  position: r.Vector2 = { x: 0, y: 0 };
  goldPosition: r.Vector2 = { x: 20, y: 20 };
  wavePosition: r.Vector2 = { x: this.bgWidth - 50, y: 20 };
  enemiesCountPosition: r.Vector2 = { x: this.wavePosition.x - 85, y: 20 }
  goldTexture: r.Texture2D;

  constructor(private totalWaves: number) {
    this.goldTexture = r.LoadTexture('assets/gold.png');
  }

  draw(waveNumber: number, wave: Wave) {
    this.drawBG();
    this.drawMoney();
    this.drawWaveCount(waveNumber);
    this.drawEnemiesCount(wave);
  }

  drawEnemiesCount(wave: Wave) {
    r.DrawText(`${wave.enemyCount}/${wave.wave.totalEnemies}`, this.enemiesCountPosition.x, this.enemiesCountPosition.y, 15, r.BLACK);
    r.DrawText('Enemies: ', this.enemiesCountPosition.x - 60, this.enemiesCountPosition.y, 15, r.BLACK);
  }

  drawWaveCount(wave: number) {
    r.DrawText(`${wave + 1}/${this.totalWaves}`, this.wavePosition.x, this.wavePosition.y, 15, r.BLACK);
    r.DrawText('Wave: ', this.wavePosition.x - 45, this.wavePosition.y, 15, r.BLACK);
  }

  drawMoney() {
    r.DrawText(
      `${Money.get()}`,
      this.goldPosition.x,
      this.goldPosition.y,
      15,
      r.YELLOW
    )

    const dest = {
      x: this.goldPosition.x + 25,
      y: this.goldPosition.y - 8,
      width: 30,
      height: 30,
    };
    const src = {
      x: 0,
      y: 0,
      width: this.goldTexture.width,
      height: this.goldTexture.height,
    };
    r.DrawTexturePro(
      this.goldTexture,
      src,
      dest,
      { x: 0, y: 0 },
      0,
      r.WHITE,
    );
  }

  drawBG() {
    r.DrawRectangle(
      this.position.x,
      this.position.y,
      this.bgWidth,
      this.bgHeight,
      { r: r.BROWN.r, g: r.BROWN.g, b: r.BROWN.b, a: r.BROWN.a - 10 }
    )
  }

}
