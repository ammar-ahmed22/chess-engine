import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState } from "../../../types";

class Bishop extends Piece {
  public type: PieceType = "bishop";

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b"
  }

  public validMoves(board: GameBoard, state: GameState): Move[] {
    return []
  }
}

export default Bishop;