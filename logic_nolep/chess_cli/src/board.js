import { Pawn, Rook, Bishop, Queen, King, Knight } from "../src/pieces.js";

export class Board {
  constructor() {
    this.grid = [];

    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push(null);
      }
      this.grid.push(row);
    }
  }
  addPiecesToBoard() {
    this.grid[0][0] = new Rook("black", 0, 0, "♜");
    this.grid[0][1] = new Knight("black", 0, 1, "♞");
    this.grid[0][2] = new Bishop("black", 0, 2, "♝");
    this.grid[0][3] = new Queen("black", 0, 3, "♛");
    this.grid[0][4] = new King("black", 0, 4, "♚");
    this.grid[0][5] = new Bishop("black", 0, 5, "♝");
    this.grid[0][6] = new Knight("black", 0, 6, "♞");
    this.grid[0][7] = new Rook("black", 0, 7, "♜");

    for (let i = 0; i < 8; i++) {
      this.grid[1][i] = new Pawn("black", 1, i, "♟");
    }

    for (let i = 0; i < 8; i++) {
      this.grid[6][i] = new Pawn("white", 6, i, "♙");
    }

    this.grid[7][0] = new Rook("white", 7, 0, "♖");
    this.grid[7][1] = new Knight("white", 7, 1, "♘");
    this.grid[7][2] = new Bishop("white", 7, 2, "♗");
    this.grid[7][3] = new Queen("white", 7, 3, "♕");
    this.grid[7][4] = new King("white", 7, 4, "♔");
    this.grid[7][5] = new Bishop("white", 7, 5, "♗");
    this.grid[7][6] = new Knight("white", 7, 6, "♘");
    this.grid[7][7] = new Rook("white", 7, 7, "♖");
  }

  getPiece(row, col) {
    return this.grid[row][col];
  }
  updateBoard(fromRow, fromCol, toRow, toCol) {
    let piece = this.grid[fromRow][fromCol];

    if (!piece) console.error("there is no piece in this position!");
    this.grid[toRow][toCol] = piece;
    this.grid[fromRow][fromCol] = null;
    piece.row = toRow;
    piece.col = toCol;
    console.log(`\n${piece.symbol} moved to ${String.fromCodePoint(97 + toCol)}${8 - toRow}`);

    if (piece.firstMove !== undefined) {
      piece.firstMove = false;
    }
  }
}
