import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import Move from "../../Move";
import { GameState, PieceType, HalfMove } from "../../../types";

class Knight extends Piece {
  public type: PieceType = "knight";

  public get fenChar(): string {
    return this.color === "white" ? "N" : "n"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    return []
  }
}

export default Knight;