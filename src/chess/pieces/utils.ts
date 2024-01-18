import Pawn from "./pawn";
import Knight from "./knight";
import Bishop from "./bishop";
import King from "./king";
import Queen from "./queen";
import Rook from "./rook";

/**
 * Creates a Piece object given the FEN character
 * @param char A single character from `rnbkqp`, lowercase for black, uppercase for white
 * @returns 
 */
const createPiece = (char: string) => {
  const allowedRegex = /^[rnbqkpRNBQKP]+$/
  if (char.length !== 1) {
    throw new Error("Only characters allowed!")
  }
  if (!allowedRegex.test(char)) {
    throw new Error("Invalid character!")
  }

  const isWhite = char.toLowerCase() !== char;
  switch (char.toLowerCase()) {
    case "r":
      return new Rook(isWhite)
    
    case "b":
      return new Bishop(isWhite)
    
    case "n":
      return new Knight(isWhite)
    
    case "k":
      return new King(isWhite)
    
    case "q":
      return new Queen(isWhite);
    
    case "p":
      return new Pawn(isWhite);
    default:
      throw new Error(`Cannot parse character: '${char}'`)
  }
} 

export { createPiece };