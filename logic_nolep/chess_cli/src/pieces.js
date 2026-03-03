export class Piece {
  constructor(color, row, col, symbol) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.symbol = symbol;
  }

  isMoveValid(toRow, toCol, grid) {}
  isSameColor(toRow, toCol, grid) {
    const destination = grid[toRow][toCol];
    if (destination === null || destination === undefined) {
      return false;
    }
    return destination.color === this.color;
  }
  isStraight(toRow, toCol, grid) {
    if (this.isSameColor(toRow, toCol, grid)) return false;
    if (this.row !== toRow && this.col !== toCol) return false;
    if (this.col === toCol) {
      let start = Math.min(this.row, toRow) + 1;
      let end = Math.max(this.row, toRow);
      for (let i = start; i < end; i++) {
        if (grid[i][this.col] !== null) return false;
      }
    }

    if (this.row === toRow) {
      let start = Math.min(this.col, toCol) + 1;
      let end = Math.max(this.col, toCol);
      for (let i = start; i < end; i++) {
        if (grid[this.row][i] !== null) return false;
      }
    }
    return true;
  }

  isDiagonal(toRow, toCol, grid) {
    if (this.isSameColor(toRow, toCol, grid)) return false;
    if (Math.abs(toRow - this.row) !== Math.abs(toCol - this.col)) return false;
    let rowStep = toRow > this.row ? 1 : -1;
    let colStep = toCol > this.col ? 1 : -1;
    let currentRow = this.row + rowStep;
    let currentCol = this.col + colStep;
    while (currentRow !== toRow && currentCol !== toCol) {
      if (grid[currentRow][currentCol] !== null) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  }
}

export class Pawn extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
    this.firstMove = true;
  }
  isMoveValid(toRow, toCol, grid) {
    if (this.isSameColor(toRow, toCol, grid)) return false;

    const direction = this.color === "white" ? -1 : 1;
    const destination = grid[toRow][toCol];
    
    if (this.firstMove === true && toRow === this.row + direction * 2 & toCol === this.col &&
      destination === null && grid[this.row + direction][this.col] === null
    ){
      this.firstMove = false;
      return true;
    } else if (
      toRow === this.row + direction &&
      toCol === this.col &&
      destination === null
    )
      return true;
    else if (
      toRow === this.row + direction &&
      (toCol === this.col + 1 || toCol === this.col - 1) &&
      destination !== null
    )
      return true;
    else return false;
  }
}

export class Rook extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
    this.moved = false;
  }
  isMoveValid(toRow, toCol, grid) {
    return this.isStraight(toRow, toCol, grid);
  }
}

export class Bishop extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
  }
  isMoveValid(toRow, toCol, grid) {
    return this.isDiagonal(toRow, toCol, grid);
  }
}

export class Queen extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
  }
  isMoveValid(toRow, toCol, grid) {
    return (
      this.isDiagonal(toRow, toCol, grid) || this.isStraight(toRow, toCol, grid)
    );
  }
}

export class Knight extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
  }
  isMoveValid(toRow, toCol, grid) {
    if (this.isSameColor(toRow, toCol, grid)) return false;
    const rowDistance = Math.abs(toRow - this.row);
    const colDistance = Math.abs(toCol - this.col);
    const isL_Shape =
      (rowDistance === 2 && colDistance === 1) ||
      (rowDistance === 1 && colDistance === 2);
    return isL_Shape;
  }
}

export class King extends Piece {
  constructor(color, row, col, symbol) {
    super(color, row, col, symbol);
    this.moved = false;
  }
  isMoveValid(toRow, toCol, grid) {
    if (this.isSameColor(toRow, toCol, grid)) return false;
    const rowDistance = Math.abs(toRow - this.row);
    const colDistance = Math.abs(toCol - this.col);
    const isOneSquare =
      rowDistance <= 1 &&
      colDistance <= 1 &&
      !(rowDistance === 0 && colDistance === 0);
    return isOneSquare;
  }
}
