import r from 'raylib';
import { boxWidth } from '../map/gameMap';

export default class HealthBar {
  position: r.Vector2 = { x: 0, y: 0 };
  width = boxWidth * 0.9;

  constructor(private maxHealth: number) { }

  draw(newPos: r.Vector2, currHealth: number) {
    this.position.x = newPos.x + 2.5;
    this.position.y = newPos.y - 10;

    const healthPercent = currHealth / this.maxHealth; // 20 == maxHealth
    const bgRec: r.Rectangle = {
      x: this.position.x,
      y: this.position.y,
      width: this.width * healthPercent,
      height: 8
    };
    r.DrawRectangleRounded(bgRec, 0.5, 8, r.RED);
    const linesRec: r.Rectangle = {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: 7
    };
    r.DrawRectangleRoundedLines(linesRec, 0.5, 8, 1, r.BLACK);
  }

}
