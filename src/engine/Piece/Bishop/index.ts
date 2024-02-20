import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "../../../types";

class Bishop extends Piece {
  public type: PieceType = "bishop";

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    return this.diagonalMoves(board);
  }
}

export default Bishop;