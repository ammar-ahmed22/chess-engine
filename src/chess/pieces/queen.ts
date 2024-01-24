import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Queen extends Piece {
  public type: Chess.PieceType = "queen";

  public validMoves(gameState: GameState): Move[] {
    // TODO valid moves
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q";
  }

  public copy() {
    return new Queen(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default Queen;
