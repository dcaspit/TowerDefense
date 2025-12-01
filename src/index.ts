import r from 'raylib';
import { Textures } from './utils/textures';
import { screenWidth, screenHeight } from './utils/consts';
import { Game } from './game/game';
import { MainMenu } from './menu/mainMenu';
import { on } from 'events';
import { Money } from './utils/money';

function main() {
  r.InitWindow(screenWidth, screenHeight, "Tower Defense");
  //  r.ToggleFullscreen();
  r.SetTargetFPS(60);

  Textures.load();
  Money.get();

  let state: 'menu' | 'play' = 'menu';

  const onGameOver = () => {
    state = 'menu';
  }

  let game: Game = new Game(onGameOver);
  let menu: MainMenu = new MainMenu(() => {
    state = 'play';
    game = new Game(onGameOver);
  });


  while (!r.WindowShouldClose()) {
    r.BeginDrawing();
    r.ClearBackground(r.RAYWHITE);

    if (state === 'menu') {
      menu.draw();
    } else {
      // Update Phase
      game.update();

      // Draw Phase
      game.draw();
    }

    r.EndDrawing();
  }

  r.CloseWindow();
}

main();
