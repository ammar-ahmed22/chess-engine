import SquareID from "../SquareID";
import { Color, GameState, PieceType, HalfMove } from "@engine-types";
import Move from "../Move";
import GameBoard from "../GameBoard";


abstract class Piece {
  public color: Color;
  protected position: SquareID;

  constructor(color: Color, position: SquareID) {
    this.color = color;
    this.position = position;
  }

  public abstract type: PieceType;
  public abstract validMoves(board: GameBoard, state: GameState): HalfMove[];
  public abstract get fenChar(): string;

  protected diagonalMoves(board: GameBoard): HalfMove[] {
    const moves: HalfMove[] = [];

    // Iterating over all 4 directions
    // h = -1 or 1
    for (let h = -1; h <= 1; h+=2) {
      // v = -1 or 1
      for (let v = -1; v <= 1; v+=2) {
        // at most 8 diagonal moves (I think maybe 7 but it's ok)
        for (let i = 1; i <= 8; i++) {
          // out of bounds
          if (
            this.position.rank + (v * i) > 8 ||
            this.position.rank + (v * i) < 1 ||
            this.position.file + (h * i) > 8 ||
            this.position.file + (h * i) < 1
            ) break; // breaks out of moves loop
          
          const pos = this.position.copy().addFile(h * i).addRank(v * i);
          const piece = board.atID(pos);
          // Once a piece of same color hit, stop the diagonal
          // TODO potentially include kings for check
          if (piece && (piece.color === this.color || piece.type === "king")) break; 
          moves.push({
            from: this.position.algebraic,
            to: pos.algebraic,
            color: this.color,
            piece: this.type,
            take: piece && piece.type
          })
          if (piece) break; // break after adding the take
        }
      }
    }

    return moves;
  }
}

export default Piece;
