import r from "raylib";
import { main_map } from "../map/maps";
import { screenHeight, screenWidth } from "../utils/consts";

export class RightPanel {
  position: r.Vector2 = { x: screenWidth - 150, y: 0 }; // Position for 1920x1080 (1920 - 150)
  gameBtn: r.Vector2 = { x: screenWidth - 150 + 20, y: 80 }; // Adjusted for new resolution

  constructor(private onClick: () => void) { }

  draw(paused: boolean) {
    r.DrawRectangle(this.position.x, this.position.y, 170, screenHeight, r.DARKBROWN); // Full height for 1080px screen
    this.drawGameBtn(paused);
    this.handleGameBtnClick();
  }

  drawGameBtn(paused: boolean) {
    const isHovered = this.isMouseInGameBtn();

    // Draw button background with hover effect
    if (isHovered) {
      // Draw a highlighted background when hovered
      r.DrawRectangle(this.gameBtn.x, this.gameBtn.y, 80, 40, {
        r: 255,
        g: 0,
        b: 0,
        a: 64,
      });
    }

    r.DrawRectangleLines(this.gameBtn.x, this.gameBtn.y, 80, 40, r.RED);

    // Change text color on hover for additional feedback
    const textColor = isHovered ? r.WHITE : r.RED;
    r.DrawText(
      paused ? "Start" : "Pause",
      this.gameBtn.x + 25,
      this.gameBtn.y + 15,
      12,
      textColor,
    );
  }

  private isMouseInGameBtn(): boolean {
    const mouseX = r.GetMouseX();
    const mouseY = r.GetMouseY();
    return (
      mouseX >= this.gameBtn.x &&
      mouseX <= this.gameBtn.x + 80 &&
      mouseY >= this.gameBtn.y &&
      mouseY <= this.gameBtn.y + 40
    );
  }

  private handleGameBtnClick() {
    if (
      this.isMouseInGameBtn() &&
      r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT)
    ) {
      this.onClick();
    }
  }
}
