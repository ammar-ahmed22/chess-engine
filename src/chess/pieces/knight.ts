import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";
import { SquareID } from "../squareID";

class Knight extends Piece {
  public type: Chess.PieceType = "knight";

  public validMoves(gameState: GameState): Move[] {
    // Create all potential moves
    const { rank, file } = this.position;
    console.log("knight:", this.position.toString());
    const potentialMoves: number[][] = [];
    // Go in all 4 directions 2 squares
    // In each direction, go left and right one square (or up down)

    // Up and down (rank +-= 2 )
    for (let i = -1; i <= 1; i += 2) {
      let newRank = rank + 2 * i;
      // Left and right (file +-= 1)
      for (let j = -1; j <= 1; j += 2) {
        let newFile = file + j;
        potentialMoves.push([newFile, newRank]);
      }
    }

    // Left and right (file +-= 2)
    for (let i = -1; i <= 1; i += 2) {
      let newFile = file + 2 * i;
      for (let j = -1; j <= 1; j += 2) {
        let newRank = rank + j;
        potentialMoves.push([newFile, newRank]);
      }
    }

    const moves = potentialMoves
      .map((pot) => {
        if (SquareID.isValid(pot[0], pot[1])) {
          const to = new SquareID(pot[0], pot[1]);
          let take = gameState.gameBoard.get.atID(to);
          if (!take) {
            return new Move({
              white: this.color === "white",
              from: this.position,
              to,
              piece: this,
            });
          } else if (
            take.color !== this.color &&
            take.type !== "king"
          ) {
            return new Move({
              white: this.color === "white",
              from: this.position,
              to,
              piece: this,
              take,
            });
          } else {
            return undefined;
          }
        }
        return undefined;
      })
      .filter((move) => move) as Move[];

    return moves;
  }

  public get fenChar(): string {
    return this.color === "white" ? "N" : "n";
  }

  public copy() {
    return new Knight(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default Knight;
