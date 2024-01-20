import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class King extends Piece {
  public type: Chess.PieceType = "king";

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k";
  }
}

export default King;
