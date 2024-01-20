import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Queen extends Piece {
  public type: Chess.PieceType = "queen";

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q";
  }
}

export default Queen;
