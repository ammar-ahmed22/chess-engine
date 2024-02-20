import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "@engine-types";

class Queen extends Piece {
  public type: PieceType = "queen";

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    return [
      ...this.diagonalMoves(board),
      ...this.orthogonalMoves(board)
    ]
  }
}

export default Queen;