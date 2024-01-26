import { GameState } from "../game";
import Move from "../move";
import { SquareID } from "../squareID";
import type { Chess } from "../types";

abstract class Piece {
  private isWhite: boolean;
  public position: SquareID;
  public abstract type: Chess.PieceType;
  constructor(isWhite: boolean, position: SquareID) {
    this.isWhite = isWhite;
    this.position = position;
  }

  get color(): "white" | "black" {
    return this.isWhite ? "white" : "black";
  }

  public abstract copy(): Piece;

  public abstract validMoves(gameState: GameState): Move[];
  public abstract get fenChar(): string;

  protected getDiagonalMoves(gameState: GameState): Move[] {
    const moves: Move[] = [];
    // Looping through to get all 4 directions
    // h = 1 -> right, h = -1 -> left
    for (let h = -1; h <= 1; h += 2) {
      // v = 1 -> up, v = -1 -> down
      for (let v = -1; v <= 1; v += 2) {
        // Can have at most 8 moves to move in any given diagonal
        for (let i = 1; i <= 8; i++) {
          // out of bounds
          if (
            this.position.rank + v * i > 8 ||
            this.position.rank + v * i < 1 ||
            this.position.file + h * i > 8 ||
            this.position.file + h * i < 1
          )
            break;
          const pos = this.position
            .copy()
            .addRank(v * i)
            .addFile(h * i);
          const piece = gameState.gameBoard.get.atID(pos);
          // Hit a same color piece or king, stop the diagonal
          // NOTE: potentially add kings to the valid moves to handle checks/checkmate
          if (
            piece &&
            (piece.color === this.color ||
              piece.type === "king")
          )
            break;
          moves.push(
            new Move({
              white: this.color === "white",
              from: this.position,
              to: pos,
              piece: this,
              take: piece,
            }),
          );
          // If it's a different color, non-king breaks after adding the take move
          if (piece) break;
        }
      }
    }
    return moves;
  }

  protected getOrthogonalMoves(
    gameState: GameState,
  ): Move[] {
    const moves: Move[] = [];
    // Horizontal directions
    for (let h = -1; h <= 1; h += 2) {
      // Can have at most 8 moves, breaks early
      for (let i = 1; i <= 8; i++) {
        if (
          this.position.file + h * i < 1 ||
          this.position.file + h * i > 8
        )
          break;
        const pos = this.position.copy().addFile(h * i);
        const piece = gameState.gameBoard.get.atID(pos);
        if (
          piece &&
          (piece.color === this.color ||
            piece.type === "king")
        )
          break;
        moves.push(
          new Move({
            white: this.color === "white",
            from: this.position,
            to: pos,
            take: piece,
            piece: this,
          }),
        );
        if (piece) break;
      }
    }

    // Vertical directions
    for (let v = -1; v <= 1; v += 2) {
      // Can have at most 8 moves, breaks early
      for (let i = 1; i <= 8; i++) {
        if (
          this.position.rank + v * i < 1 ||
          this.position.rank + v * i > 8
        )
          break;
        const pos = this.position.copy().addRank(v * i);
        const piece = gameState.gameBoard.get.atID(pos);
        if (
          piece &&
          (piece.color === this.color ||
            piece.type === "king")
        )
          break;
        moves.push(
          new Move({
            white: this.color === "white",
            from: this.position,
            to: pos,
            take: piece,
            piece: this,
          }),
        );
        if (piece) break;
      }
    }

    return moves;
  }
}

export default Piece;
