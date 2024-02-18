import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState } from "@engine-types";

class King extends Piece {
  public type: PieceType = "king";

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k"
  }

  public validMoves(board: GameBoard, state: GameState): Move[] {
    return []
  }
}

export default King;