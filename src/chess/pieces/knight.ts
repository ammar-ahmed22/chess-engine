import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Knight extends Piece {
  public type: Chess.PieceType = "knight";

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "N" : "n";
  }
}

export default Knight;
