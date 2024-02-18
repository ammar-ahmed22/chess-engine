import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState } from "@engine-types";

class Queen extends Piece {
  public type: PieceType = "queen";

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q"
  }

  public validMoves(board: GameBoard, state: GameState): Move[] {
    return []
  }
}

export default Queen;