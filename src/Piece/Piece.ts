import { SquareID } from "../SquareID";
import type { Color, GameState, PieceType, HalfMove } from "../Chess";
import { GameBoard } from "../GameBoard";

abstract class Piece {
  public color: Color;
  public position: SquareID;

  constructor(color: Color, position: SquareID) {
    this.color = color;
    this.position = position;
  }

  public abstract type: PieceType;
  public abstract validMoves(
    board: GameBoard,
    state: GameState,
    filterSelfCheck?: boolean
  ): HalfMove[];
  public abstract get fenChar(): string;

  // protected onlyExecutable(board: GameBoard, state: GameState, moves: HalfMove[]) {
  //   const fen = board.fen();
  //   return moves.filter((move) => {
  //     const b = new GameBoard(fen);
  //     const result = b.execute(move, state, { silent: true });
  //     if (result) return true;
  //     return false;
  //   })
  // }
  /**
   * Returns moves for all 4 diagonals
   * @param board GameBoard
   * @returns
   */
  protected diagonalMoves(
    board: GameBoard,
    cap: number = 8,
  ): HalfMove[] {
    const moves: HalfMove[] = [];

    // Iterating over all 4 directions
    // h = -1 or 1
    for (let h = -1; h <= 1; h += 2) {
      // v = -1 or 1
      for (let v = -1; v <= 1; v += 2) {
        // at most 8 diagonal moves (I think maybe 7 but it's ok)
        for (let i = 1; i <= cap; i++) {
          // out of bounds
          if (
            !SquareID.isValid(
              this.position.file + h * i,
              this.position.rank + v * i,
            )
          )
            break;
          const pos = this.position
            .copy()
            .addFile(h * i)
            .addRank(v * i);
          const piece = board.atID(pos);
          // Once a piece of same color hit, stop the diagonal
          // included kings for check
          if (piece && piece.color === this.color) break;
          moves.push({
            from: this.position.algebraic,
            to: pos.algebraic,
            color: this.color,
            piece: this.type,
            take: piece && piece.type,
          });
          if (piece) break; // break after adding the take
        }
      }
    }

    return moves;
  }

  protected orthogonalMoves(
    board: GameBoard,
    cap: number = 8,
  ): HalfMove[] {
    const moves: HalfMove[] = [];

    // horizontal direction -> dir = 0, vertical direction -> dir = 1
    for (let d = 0; d < 2; d++) {
      // left/right, up/down
      let dir: "file" | "rank" = d === 0 ? "file" : "rank";
      for (let i = -1; i <= 1; i += 2) {
        // At most 8 moves (or cap) in each direction
        for (let j = 1; j <= cap; j++) {
          if (
            this.position[dir] + i * j < 1 ||
            this.position[dir] + i * j > 8
          )
            break;
          const pos = this.position.copy();
          if (dir === "file") {
            pos.addFile(i * j);
          } else {
            pos.addRank(i * j);
          }
          const piece = board.atID(pos);
          if (piece && piece.color === this.color) break;
          moves.push({
            color: this.color,
            from: this.position.algebraic,
            to: pos.algebraic,
            piece: this.type,
            take: piece && piece.type,
          });
          if (piece) break;
        }
      }
    }

    return moves;
  }
}

export default Piece;
