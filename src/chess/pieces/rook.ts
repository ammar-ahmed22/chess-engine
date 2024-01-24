import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Rook extends Piece {
  public type: Chess.PieceType = "rook";

  public validMoves(gameState: GameState): Move[] {
    // TODO valid moves
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "R" : "r";
  }

  public copy() {
    return new Rook(
      this.color === "white",
      this.position.copy(),
    );
  }
}

export default Rook;
