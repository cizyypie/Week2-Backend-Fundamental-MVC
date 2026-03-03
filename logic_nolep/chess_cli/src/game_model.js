import { Board } from "./board.js";
import { Player } from "./player.js";
import { parseInput } from "../utils/parseInput.js";

export class GameModel {
  constructor(player1Name, player2Name) {
    this.board = new Board();
    this.player1 = new Player(player1Name, true);
    this.player2 = new Player(player2Name, false);
    this.currentTurn = "white";
    this.gameOver = false;
  }

  async startGame(rl) {
    this.board.addPiecesToBoard();

    while (!this.gameOver) {
      this.displayBoard();
      console.log(`\n--- ${this.currentTurn.toUpperCase()}'s Turn ---`);
      console.log(`*Type "quit" to exit`);
      const input = await rl.question("Enter move (e.g: e2 e4): ");

      const move = parseInput(input);
      if (input === "quit") {
        console.log("Thanks for playing!");
        rl.close();
        break;
      }
      if (!move) {
        console.log("Invalid format! Use: e2 e4");
        continue;
      }

      const piece = this.board.getPiece(move.fromRow, move.fromCol);
      if (!piece) {
        console.log("that square is empty!");
        continue;
      } else if (piece.color !== this.currentTurn) {
        console.log("That is not your piece!");
        continue;
      }

      if (!piece.isMoveValid(move.toRow, move.toCol, this.board.grid)) {
        console.log("Invalid move for this piece!");
        continue;
      }

      this.board.updateBoard(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol,
      );
      if (this.isCheckMate()) {
        const winner =
          this.currentTurn === "white" ? this.player1.name : this.player2.name;
        console.log(`\nCHECKMATE! ${winner} wins!`);
        this.gameOver = true;
        rl.close();
        break;
      }
      this.switchTurn();
    }
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
  }

  isCheckMate() {
    let kingFound = false;
    const targetKingSymbol = this.currentTurn === "white" ? "♚" : "♔";

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let piece = this.board.grid[i][j];
        if (piece !== null && piece.symbol === targetKingSymbol) {
          kingFound = true;
        }
      }
    }
    return !kingFound;
  }
  displayBoard() {
    console.log(`   a b c d e f g h   ----------------`);
    for (let i = 0; i < this.board.grid.length; i++) {
      let rowString = `${8 - i} |`;
      for (let j = 0; j < this.board.grid[i].length; j++) {
        let cell = this.board.grid[i][j];
        if (cell != null) {
          rowString += cell.symbol + " ";
        } else rowString += ". ";
      }
      console.log(rowString + "|");
    }
  }
}
