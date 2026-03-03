import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { GameModel } from "./src/game_model.js";

const rl = readline.createInterface({ input, output });

async function main() {
  const p1 = await rl.question("Player 1 name: ");
  const p2 = await rl.question("Player 2 name: ");

  const game = new GameModel(p1, p2);
  await game.startGame(rl);
}

main();
