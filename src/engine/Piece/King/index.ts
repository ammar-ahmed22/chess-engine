import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "@engine-types";

class King extends Piece {
  public type: PieceType = "king";

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    return [
      ...this.diagonalMoves(board, 1),
      ...this.orthogonalMoves(board, 1)
    ]
  }
}

export default King;