import Piece from "./index";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";
import { SquareID } from "../squareID";

class Pawn extends Piece {
  public type: Chess.PieceType = "pawn";

  public validMoves(gameState: GameState): Move[] {
    let firstMove = false;
    let direction = this.color === "white" ? 1 : -1;
    if (this.color === "white" && this.position.rank === 2)
      firstMove = true;
    if (this.color === "black" && this.position.rank === 7)
      firstMove = true;

    const moves: Move[] = [];
    let N = 2;

    // TODO: Piece promotion!!
    if (direction === -1 && this.position.rank === 2)
      return [];
    if (direction === 1 && this.position.rank === 7)
      return [];
    if (direction === -1 && this.position.rank === 1)
      return [];
    if (direction === 1 && this.position.rank === 8)
      return [];

    // 1 rank above and 2 ranks forward
    for (let i = 0; i < N; i++) {
      const pos = this.position
        .copy()
        .addRank(direction * (i + 1));
      const move = new Move({
        white: this.color === "white",
        from: this.position,
        to: pos,
        piece: this,
      });
      if (!gameState.gameBoard.get.atID(pos)) {
        // Square must be empty
        if (i === 0) {
          // 1 rank above always available
          moves.push(move);
        } else if (i === 1 && firstMove) {
          // 2 ranks only available when first move
          moves.push(move);
        }
      }
    }

    // Takes
    const potentials = [
      this.position.file !== 8
        ? this.position.copy().addRank(direction).addFile(1)
        : undefined,
      this.position.file !== 1
        ? this.position
            .copy()
            .addRank(direction)
            .addFile(-1)
        : undefined,
    ].filter((p) => p) as SquareID[];
    for (let pot of potentials) {
      const potPiece = gameState.gameBoard.get.atID(pot);
      if (
        potPiece &&
        potPiece.color !== this.color &&
        potPiece.type !== "king"
      ) {
        moves.push(
          new Move({
            white: this.color === "white",
            from: this.position.copy(),
            to: pot,
            piece: this,
            take: potPiece,
          }),
        );
      }
    }

    return moves;
  }

  public get fenChar(): string {
    return this.color === "white" ? "P" : "p";
  }

  public copy() {
    return new Pawn(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default Pawn;
