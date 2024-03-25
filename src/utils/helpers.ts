import type { CompleteHalfMove, HalfMove, PieceType } from "../Chess";
import { SquareID } from "../SquareID";


/**
 * Returns all the positions in order given a game history
 * @param history The game history
 */
export const allPositions = (history: CompleteHalfMove[]) => {
  const positions: string[] = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"];
  for (let complete of history) {
    positions.push(complete.state.fen);
  }

  return positions;
}

const algebraicPiece = (piece: PieceType) => {
  switch (piece) {
    case "pawn":
      return ""
    case "knight":
      return "N";
    default:
      return piece[0].toUpperCase();
  }
}

/**
 * Returns the standard algebraic move notation for the move made
 * @param halfMove 
 * @param validMoves 
 */
export const algebraicMove = (halfMove: HalfMove, validMoves: HalfMove[]) => {
  if (halfMove.castle) {
    return halfMove.castle === "king" ? "O-O" : "O-O-O";
  } else {
    const sameDestination: HalfMove[] = [];
    for (let move of validMoves) {
      if (move.from === halfMove.from && move.to === halfMove.to) continue;
      if (move.piece === halfMove.piece && move.to === halfMove.to) {
        sameDestination.push(move);
      }
    }

    let disambiguator = "";
    let sameFile = false;
    let sameRank = false;
    if (sameDestination.length > 0) {
      const mFrom = new SquareID(halfMove.from);
      for (let move of sameDestination) {
        const from = new SquareID(move.from);
        if (from.file === mFrom.file) sameFile = true;
        if (from.rank === mFrom.rank) sameRank = true;
      }
      if (sameFile && sameRank) {
        disambiguator = halfMove.from;
      } else if (sameFile) {
        disambiguator = halfMove.from[1];
      } else {
        disambiguator = halfMove.from[0];
      }
    }

    if (disambiguator) console.log(disambiguator);

    let result = algebraicPiece(halfMove.piece);
    if (halfMove.take) {
      if (halfMove.piece === "pawn") {
        return halfMove.from[0] + "x" + halfMove.to;
      } else {
        return result + disambiguator + "x" + halfMove.to;
      }
    } else {
      return result + disambiguator + halfMove.to + (halfMove.promotion ? `=${halfMove.promotion}` : "");
    }
  }
}