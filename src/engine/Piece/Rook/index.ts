import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState } from "@engine-types";

class Rook extends Piece {
  public type: PieceType = "rook";

  public get fenChar(): string {
    return this.color === "white" ? "R" : "r"
  }

  public validMoves(board: GameBoard, state: GameState): Move[] {
    return []
  }
}

export default Rook;