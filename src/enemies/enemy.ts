import r from "raylib";
import HealthBar from './healthBar';
import { Textures, TexturesTypes } from "../utils/textures";
import { GameClock } from "../utils/game-clock";
import { boxWidth } from "../map/gameMap";

export default class Enemy {
  pos: r.Vector2 = { x: 0, y: 0 };
  healthBar: HealthBar;
  size = boxWidth * 0.8;
  texture: r.Texture;
  health = 30;
  currentPathIndex: number = 0;
  reachedBase = false;
  frameWidth: number = 0;
  frameHeight: number = 0;
  frameRec: r.Rectangle = { x: 0, y: 0, height: 0, width: 0 };

  constructor(public index: number) {
    this.healthBar = new HealthBar(this.health);
    this.texture = Textures.asset(TexturesTypes.slime);

    this.frameWidth = this.texture.width / 6;
    this.frameHeight = this.texture.height / 6;
    this.frameRec = { x: 0, y: 0, width: this.frameWidth, height: this.frameHeight };
  }

  takeDamage(power: number) {
    this.health -= power;
  }

  kill() {
    this.health = 0;
  }

  draw(position: r.Vector2) {
    if (this.health <= 0) return;
    this.pos.x = position.x + 5;
    this.pos.y = position.y + 5;
    this.healthBar.draw(position, this.health);
    this.drawEnemyTexture();
  }

  currentFrame = 0;
  frameCounter = 0;

  drawEnemyTexture() {
    //r.DrawRectangle(this.pos.x, this.pos.y, 10, 10, r.RED);
    //return;

    this.frameCounter += r.GetFrameTime() * 10;
    if (this.frameCounter >= 1) {
      this.currentFrame++;
      this.frameCounter = 0;
      if (this.currentFrame > 5) {
        this.currentFrame = 0;
      }
    }

    // frameRec.x = currentFrame * frameWidth;
    const dest = {
      x: this.pos.x,
      y: this.pos.y,
      width: this.size,
      height: this.size,
    };
    const src = {
      x: this.currentFrame * this.frameWidth,
      y: 0,
      width: this.frameWidth,
      height: this.frameHeight,
    };
    //this.frameRec.x = (GameClock.getSeconds() % 6) * this.frameWidth;
    //r.DrawTextureRec(this.texture, this.frameRec, this.pos, r.WHITE);
    r.DrawTexturePro(this.texture, src, dest, { x: 0, y: 0 }, 0, r.WHITE);
  }
}
