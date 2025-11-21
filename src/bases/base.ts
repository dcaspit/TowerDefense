import r from 'raylib';
import { boxWidth, boxHeight } from '../map/gameMap';
import HealthBar from '../enemies/healthBar';
import { Textures, TexturesTypes } from '../utils/textures';

export default class Base {
  baseTexture: r.Texture;
  healthBar: HealthBar;
  health = 100;
  frameWidth: number;
  frameHeight: number;
  frameRec: r.Rectangle;

  constructor(private onBaseDeath: () => void) {
    this.baseTexture = Textures.asset(TexturesTypes.base);

    this.frameWidth = 32;
    this.frameHeight = 32;
    this.frameRec = { x: 0, y: 0, width: this.frameWidth, height: this.frameHeight };

    this.healthBar = new HealthBar(this.health);
  }

  draw(position: r.Vector2) {

    // frameRec.x = currentFrame * frameWidth;
    const dest = {
      x: position.x,
      y: position.y,
      width: 50,
      height: 50,
    };
    const src = {
      x: 0,
      y: 0,
      width: this.frameWidth,
      height: this.frameHeight,
    };
    //this.frameRec.x = (GameClock.getSeconds() % 6) * this.frameWidth;
    //r.DrawTextureRec(this.texture, this.frameRec, this.pos, r.WHITE);
    r.DrawTexturePro(this.baseTexture, src, dest, { x: 0, y: 0 }, 0, r.WHITE);
    this.healthBar.draw(position, this.health);
  }

  takeDamage() {
    this.health -= 5;
    if (this.health === 0) {
      this.onBaseDeath();
      this.health = 100;
    }
  }
}
