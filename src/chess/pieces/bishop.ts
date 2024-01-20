import Piece from ".";
import { GameState } from "../game";
import Move from "../move";
import type { Chess } from "../types";

class Bishop extends Piece {
  public type: Chess.PieceType = "bishop";

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b";
  }
}

export default Bishop;
