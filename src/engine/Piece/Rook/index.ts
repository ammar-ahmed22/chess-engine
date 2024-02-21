import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "@engine-types";

class Rook extends Piece {
  public type: PieceType = "rook";

  public get fenChar(): string {
    return this.color === "white" ? "R" : "r"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    const moves = this.orthogonalMoves(board);

    if (state.inCheck) {
      // TODO filter the moves to only those moves that remove from check
      const fen = board.fen();
      return moves.filter(move => {
        // console.log(fen);
        const b = new GameBoard(fen);
        const result = b.execute(move, state, { silent: true });
        if (result) return true;
        return false;
      })
    }

    return moves;
  }
}

export default Rook;