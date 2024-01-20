import Piece from "./index";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Pawn extends Piece {
  public type: Chess.PieceType = "pawn";

  public validMoves(gameState: GameState): Move[] {
    let firstMove = false;
    let direction = this.color === "white" ? 1 : -1;
    if (this.color === "white" && this.position.rank === 2)
      firstMove = true;
    if (this.color === "black" && this.position.rank === 7)
      firstMove = true;
    // console.log(this.position);
    const moves: Move[] = [
      new Move({
        white: this.color === "white",
        from: this.position,
        to: this.position.copy().addRank(direction),
        piece: this,
      }),
      // position.copy().addRank(this.color === "white" ? 1 : -1)
    ];

    if (firstMove) {
      moves.push(
        new Move({
          white: this.color === "white",
          from: this.position.copy(),
          to: this.position.copy().addRank(2 * direction),
          piece: this,
        }),
      );
    }

    // Takes
    const potentials = [
      this.position.copy().addRank(direction).addFile(1),
      this.position.copy().addRank(direction).addFile(-1),
    ];
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
}

export default Pawn;
