import r from 'raylib';
import { screenHeight, screenWidth } from '../utils/consts';
import { TopPanel } from '../panels/topPanel';
import { Textures, TexturesTypes } from '../utils/textures';


export class Player {
  health: number = 10;
  position: r.Vector2 = { x: screenWidth / 2, y: screenHeight / 2 };
  texture: r.Texture;
  frameWidth: number = 0;
  frameHeight: number = 0;
  frameRec: r.Rectangle = { x: 0, y: 0, height: 0, width: 0 }

  state: 'nonAttack' | 'attack' = 'nonAttack';

  constructor() {
    this.texture = Textures.asset(TexturesTypes.player);


    this.frameWidth = this.texture.width / 5;
    this.frameHeight = this.texture.height / 8;
    this.frameRec = { x: 0, y: 0, width: this.frameWidth, height: this.frameHeight };
  }

  currentFrame = 0;
  frameCounter = 0;
  direction: 'up' | 'down' | 'left' | 'right' | 'still' = 'still';
  offset = 0;

  drawEnemyTexture() {

    this.frameCounter += r.GetFrameTime() * 10;
    if (this.frameCounter >= 1) {
      this.currentFrame++;
      this.frameCounter = 0;
      if (this.currentFrame > 4) {
        this.currentFrame = 0;
        this.state = 'nonAttack';
      }
    }

    if (this.direction === 'down') this.offset = 0;
    if (this.direction === 'up') this.offset = 1;
    if (this.direction === 'right') this.offset = 2;
    if (this.direction === 'left') this.offset = 3;

    let still = 1;
    if (this.direction === 'still' && this.state === 'nonAttack') still = 0;

    const dest = {
      x: this.position.x,
      y: this.position.y,
      width: 20,
      height: 20,
    };
    const att = this.state === 'attack' ? 4 : 0;
    const src = {
      x: still * this.currentFrame * this.frameWidth,
      y: (this.offset + att) * this.frameHeight,
      width: this.frameWidth,
      height: this.frameHeight,
    };

    r.DrawTexturePro(this.texture, src, dest, { x: 0, y: 0 }, 0, r.WHITE);
  }

  update(pos: r.Vector2) {
    this.position.x += pos.x;
    if (this.position.y + pos.y >= 80) {
      this.position.y += pos.y;
    }

    if (pos.x === 0 && pos.y < 0) this.direction = 'up';
    if (pos.x === 0 && pos.y > 0) this.direction = 'down';
    if (pos.y === 0 && pos.x > 0) this.direction = 'right';
    if (pos.y === 0 && pos.x < 0) this.direction = 'left';
    if (pos.y === 0 && pos.x === 0) this.direction = 'still';
  }

  attack() {
    this.state = 'attack';
    this.currentFrame = 0;
  }
}
