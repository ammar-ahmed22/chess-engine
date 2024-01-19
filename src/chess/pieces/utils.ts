import { SquareID } from "../move";
import {
  Pawn,
  Rook,
  Knight,
  Bishop,
  King,
  Queen,
} from "./pieceMap";

/**
 * Creates a Piece object given the FEN character
 * @param char A single character from `rnbkqp`, lowercase for black, uppercase for white
 * @returns
 */
const createPiece = (char: string, position: SquareID) => {
  if (char.length !== 1) {
    throw new Error("Only characters allowed!");
  }

  const isWhite = char.toLowerCase() !== char;
  switch (char.toLowerCase()) {
    case "r":
      return new Rook(isWhite, position);

    case "b":
      return new Bishop(isWhite, position);

    case "n":
      return new Knight(isWhite, position);

    case "k":
      return new King(isWhite, position);

    case "q":
      return new Queen(isWhite, position);

    case "p":
      return new Pawn(isWhite, position);
    default:
      throw new Error(`Cannot parse character: '${char}'`);
  }
};

export { createPiece };
