import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { PieceType, GameState } from "@engine-types";

class Pawn extends Piece {
  public type: PieceType = "pawn";

  public get fenChar(): string {
    return this.color === "white" ? "P" : "p"
  }

  public validMoves(board: GameBoard, state: GameState): Move[] {
    return []
  }
}

export default Pawn;