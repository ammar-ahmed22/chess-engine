import { Piece } from ".";
import { GameBoard } from "../GameBoard";
import type { PieceType, GameState, HalfMove } from "../Chess";

class Rook extends Piece {
  public type: PieceType = "rook";

  public get fenChar(): string {
    return this.color === "white" ? "R" : "r"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    const moves = this.orthogonalMoves(board);

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

export default Rook;