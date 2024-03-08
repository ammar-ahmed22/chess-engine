import { Piece } from ".";
import { GameBoard } from "../GameBoard";
import type { GameState, PieceType, HalfMove } from "../Chess";
import { SquareID } from "../SquareID";

class Knight extends Piece {
  public type: PieceType = "knight";

  public get fenChar(): string {
    return this.color === "white" ? "N" : "n";
  }

  public validMoves(
    board: GameBoard,
    state: GameState,
    filterSelfCheck: boolean = true,
  ): HalfMove[] {
    // Go in all 4 dirs, 2 squares
    const potentialIDs: SquareID[] = [];
    // Vertical dir, 2 squares
    for (let i = -1; i <= 1; i += 2) {
      let r = this.position.rank + 2 * i;
      // Horizontal dir, 1 square
      for (let j = -1; j <= 2; j += 2) {
        let f = this.position.file + j;
        if (SquareID.isValid(f, r)) {
          potentialIDs.push(new SquareID(f, r));
        }
      }
    }

    // Horizontal dir, 2 squares
    for (let i = -1; i <= 1; i += 2) {
      let f = this.position.file + 2 * i;
      // Vertical dir, 1 square
      for (let j = -1; j <= 2; j += 2) {
        let r = this.position.rank + j;
        if (SquareID.isValid(f, r)) {
          potentialIDs.push(new SquareID(f, r));
        }
      }
    }

    const moves = potentialIDs
      .map((id) => {
        const piece = board.atID(id);
        if (piece && piece.color === this.color) return undefined;
        return {
          color: this.color,
          from: this.position.algebraic,
          to: id.algebraic,
          piece: this.type,
          take: piece && piece.type,
        };
      })
      .filter((m) => m) as HalfMove[];

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

export default Knight;
