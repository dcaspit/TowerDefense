import r from 'raylib';
import { screenHeight, screenWidth } from '../utils/consts';


export class Player {
  health: number = 10;
  position: r.Vector2 = { x: screenWidth / 2, y: screenHeight / 2 };

  draw() {
    r.DrawRectangle(this.position.x, this.position.y, 20, 20, r.RED);
  }

  update(pos: r.Vector2) {
    this.position.x += pos.x;
    this.position.y += pos.y;
  }
}
