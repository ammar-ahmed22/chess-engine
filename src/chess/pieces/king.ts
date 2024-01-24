import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class King extends Piece {
  public type: Chess.PieceType = "king";

  public validMoves(gameState: GameState): Move[] {
    // TODO valid moves
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k";
  }

  public copy() {
    return new King(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default King;
