import { Piece } from ".";
import { GameBoard } from "../GameBoard";
import type { PieceType, GameState, HalfMove } from "../Chess";

class Queen extends Piece {
  public type: PieceType = "queen";

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q";
  }

  public validMoves(board: GameBoard, state: GameState, filterSelfCheck: boolean = true): HalfMove[] {
    const moves = [
      ...this.diagonalMoves(board),
      ...this.orthogonalMoves(board),
    ];

    if (state.inCheck || filterSelfCheck) {
      const fen = board.fen();
      return moves.filter((move) => {
        const b = new GameBoard(fen);
        const result = b.execute(move, state, { silent: true });
        if (result) return true;
        return false;
      });
    }

    return moves;
  }
}

export default Queen;
