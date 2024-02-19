import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState, HalfMove } from "@engine-types";

class Queen extends Piece {
  public type: PieceType = "queen";

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    return []
  }
}

export default Queen;