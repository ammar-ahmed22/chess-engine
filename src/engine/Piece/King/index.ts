import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import { PieceType, GameState, HalfMove } from "@engine-types";

class King extends Piece {
  public type: PieceType = "king";

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    
    const moves =  [
      ...this.diagonalMoves(board, 1),
      ...this.orthogonalMoves(board, 1)
    ]

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

export default King;