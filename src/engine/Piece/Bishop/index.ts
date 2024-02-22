import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "../../../types";

class Bishop extends Piece {
  public type: PieceType = "bishop";

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    const moves = this.diagonalMoves(board);

    if (state.inCheck) {
      const fen = board.fen();
      return moves.filter(move => {
        const b = new GameBoard(fen);
        const result = b.execute(move, state, { silent: true });
        if (result) return true;
        return false;
      })
    }
    
    return moves;
  }
}

export default Bishop;