import r, { MOUSE_BUTTON_LEFT } from "raylib";
import { screenHeight, screenWidth } from "../utils/consts";
import { Ground, main_map } from "./maps";
import Base from '../bases/base';
import { Money } from "../utils/money";
import { TOWER_COST } from "../towers/tower";
import { Textures, TexturesTypes } from "../utils/textures";

export const boxWidth = (screenWidth - 150) / main_map[0].length;
export const boxHeight = (screenHeight - 80) / main_map.length;
export const topMargin = 80;

export default class GameMap {
  enemyPath: r.Vector2[];
  enemyPathIntialized: boolean = false;
  towersLocations: { col: number, row: number }[] = [];
  base: Base;

  grass: r.Texture;
  grassWidth: number;
  grassHeight: number;

  tree: r.Texture;
  treeWidth: number;
  treeHeight: number;

  constructor(private mouseClick: (pos: r.Vector2) => void,
    private onBaseDeath: () => void) {
    this.enemyPath = [];
    this.base = new Base(this.onBaseDeath);
    this.parseEnemyPath();

    this.grass = Textures.asset(TexturesTypes.grass);
    this.grassWidth = this.grass.width / 5;
    this.grassHeight = this.grass.height;

    this.tree = Textures.asset(TexturesTypes.tree);
    this.treeWidth = this.tree.width / 4;
    this.treeHeight = this.tree.height;
  }

  drawMap(pauseState: boolean) {
    for (let row = 0; row < main_map.length; row++) {
      for (let col = 0; col < main_map[row].length; col++) {
        let color: r.Color = r.GRAY;
        if (main_map[row][col] === Ground.Grass) {
          this.drawGround(col, row, this.grassWidth * 2);
          color = r.GREEN; // TODO: Change this color to state in order to support placing towers below
        } else if (main_map[row][col] === Ground.Road) {
          this.drawGround(col, row, this.grassWidth * 3);
        } else if (main_map[row][col] === Ground.Water) {
          this.drawGround(col, row, 0);
        } else if (main_map[row][col] === 4) {
          this.drawGround(col, row, this.grassWidth * 2);
          this.drawTree(col, row, this.treeWidth);
        }

        // TODO: add remove tower logic
        // TODO: remove logic from draw
        if (color === r.GREEN && pauseState && Money.enough(TOWER_COST) && !this.towersLocations.find((loc) => loc.col === col && loc.row === row)) {
          // Check if mouse is hovering over this rectangle
          if (this.isMouseInRec(col, row)) {
            // Draw a semi-transparent white overlay for highlight
            r.DrawRectangle(
              col * boxWidth,
              topMargin + row * boxHeight,
              boxWidth,
              boxHeight,
              { r: 255, g: 255, b: 255, a: 64 }, // Semi-transparent white
            );

            if (r.IsMouseButtonPressed(MOUSE_BUTTON_LEFT)) {
              this.mouseClick({ x: col * boxWidth, y: topMargin + row * boxHeight });
              this.towersLocations.push({ col: col, row: row });
              Money.decrease(TOWER_COST);
            }
          }
        }
      }
    }

    // Draw base sprite at the end of the enemy path
    if (this.enemyPath.length > 0) {
      const endPosition = this.enemyPath[this.enemyPath.length - 1];
      this.base.draw(endPosition);
    }
  }

  drawGround(col: number, row: number, x: number) {
    const pos = { x: col * boxWidth, y: topMargin + row * boxHeight }
    const dest = {
      x: pos.x,
      y: pos.y,
      width: boxWidth,
      height: boxHeight,
    };
    const src = {
      x: x,
      y: this.grassHeight,
      width: this.grassWidth,
      height: this.grassHeight,
    };
    r.DrawTexturePro(this.grass, src, dest, { x: 0, y: 0 }, 0, r.WHITE);
  }

  drawTree(col: number, row: number, x: number) {
    const pos = { x: col * boxWidth, y: topMargin + row * boxHeight }
    const dest = {
      x: pos.x,
      y: pos.y,
      width: boxWidth,
      height: boxHeight,
    };
    const src = {
      x: x,
      y: this.treeHeight,
      width: this.treeWidth,
      height: this.treeHeight,
    };
    r.DrawTexturePro(this.tree, src, dest, { x: 0, y: 0 }, 0, r.WHITE);
  }

  isMouseInRec(col: number, row: number): boolean {
    let mouseX = r.GetMouseX();
    let mouseY = r.GetMouseY();
    let startBoxX = col * boxWidth;
    let endBoxX = startBoxX + boxWidth;
    let startBoxY = topMargin + row * boxHeight;
    let endBoxY = startBoxY + boxHeight;
    return (
      mouseX >= startBoxX &&
      mouseX <= endBoxX &&
      mouseY >= startBoxY &&
      mouseY <= endBoxY
    );
  }

  parseEnemyPath(): void {
    // Find entrance (leftmost 2 in any row)
    let startRow: number = -1;
    let startCol: number = -1;

    for (let row = 0; row < main_map.length; row++) {
      if (main_map[row][0] === 2) {
        startRow = row;
        startCol = 0;
        break;
      }
      if (startRow !== -1) break;
    }

    if (startRow === -1) return; // No path found

    // Track visited cells to avoid going backwards
    const visited: boolean[][] = [];
    for (let i = 0; i < main_map.length; i++) {
      visited[i] = new Array(main_map[i].length).fill(false);
    }

    let currentRow = startRow;
    let currentCol = startCol;

    // Add starting position
    let startPos: r.Vector2 = {
      x: currentCol * boxWidth,
      y: topMargin + currentRow * boxHeight,
    };
    this.enemyPath.push(startPos);
    visited[currentRow][currentCol] = true;

    // Direction vectors: right, down, left, up
    const directions = [
      { row: 0, col: 1 }, // right
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: -1, col: 0 }, // up
    ];

    while (true) {
      let foundNext = false;

      // Check all 4 directions for next path cell
      for (const dir of directions) {
        const nextRow = currentRow + dir.row;
        const nextCol = currentCol + dir.col;

        // Check bounds
        if (
          nextRow >= 0 &&
          nextRow < main_map.length &&
          nextCol >= 0 &&
          nextCol < main_map[0].length
        ) {
          // Check if it's a path cell (2) and not visited
          if (main_map[nextRow][nextCol] === 2 && !visited[nextRow][nextCol]) {
            // Move to this cell
            currentRow = nextRow;
            currentCol = nextCol;
            visited[currentRow][currentCol] = true;

            // Add position to path
            let pos: r.Vector2 = {
              x: currentCol * boxWidth,
              y: topMargin + currentRow * boxHeight,
            };
            this.enemyPath.push(pos);

            foundNext = true;
            break;
          }
        }
      }

      // If no next path cell found, we've reached the end
      if (!foundNext) {
        break;
      }
    }

    console.log(`Enemy path parsed with ${this.enemyPath.length} waypoints`);
  }
}
