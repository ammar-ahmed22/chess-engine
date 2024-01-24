import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Bishop extends Piece {
  public type: Chess.PieceType = "bishop";

  public validMoves(gameState: GameState): Move[] {
    // TODO valid moves
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b";
  }

  public copy() {
    return new Bishop(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default Bishop;
