export function parseInput(input) {
  const parts = input.trim().split(" ");
  if (parts.length !== 2) {
    return null;
  }
  const fromSquare = parts[0];
  const toSquare = parts[1];

  const fromCol = fromSquare.charCodeAt(0) - 97;
  const fromRow = 8 - parseInt(fromSquare[1]);

  const toCol = toSquare.charCodeAt(0) - 97;
  const toRow = 8 - parseInt(toSquare[1]);

  if (isNaN(fromRow) || isNaN(fromCol) || isNaN(toRow) || isNaN(toCol))  return null;
  return { fromRow, fromCol, toRow, toCol };
}
