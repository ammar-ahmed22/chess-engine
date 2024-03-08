import { Piece } from ".";
import { GameBoard } from "../GameBoard";
import type { PieceType, GameState, HalfMove } from "../Chess";

class King extends Piece {
  public type: PieceType = "king";

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k";
  }

  public validMoves(board: GameBoard, state: GameState, filterSelfCheck: boolean = true): HalfMove[] {
    const moves = [
      ...this.diagonalMoves(board, 1),
      ...this.orthogonalMoves(board, 1),
    ];

    const initialRank = this.color === "white" ? 1 : 8;
    const fen = board.fen();
    const kingUnmoved = this.position.algebraic === `e${initialRank}`;
    if (state.castling[this.color].king && kingUnmoved) {
      // has kingside ability
      let canCastle = true;
      for (let i = 1; i <= 3; i++) {
        const pos = this.position.copy().addFile(i);
        const piece = board.atID(pos);
        if (i === 3) {
          // check if rook is there
          if (!piece || piece.type !== "rook") {
            canCastle = false;
            break;
          }
        } else {
          // check if empty
          const b = new GameBoard(fen);
          // Result will be null if move causes king to be in check
          const result = b.execute(
            { from: this.position.algebraic, to: pos.algebraic },
            state,
            { silent: true },
          );
          if (piece || !result) {
            canCastle = false;
            break;
          }
        }
      }
      if (canCastle) {
        moves.push({
          color: this.color,
          from: this.position.algebraic,
          to: `g${initialRank}`,
          piece: this.type,
          castle: "king",
        });
      }
    }
    if (state.castling[this.color].queen && kingUnmoved) {
      // has queenside ability
      let canCastle = true;
      for (let i = 1; i <= 4; i++) {
        const pos = this.position.copy().addFile(-i);
        const piece = board.atID(pos);
        if (i === 4) {
          // check if rook is there
          if (!piece || piece.type !== "rook") {
            canCastle = false;
            break;
          }
        } else {
          // check if empty
          const b = new GameBoard(fen);
          // Result will be null if move causes king to be in check
          const result = b.execute(
            { from: this.position.algebraic, to: pos.algebraic },
            state,
            { silent: true },
          );
          if (piece || !result) {
            canCastle = false;
            break;
          }
        }
      }
      if (canCastle) {
        moves.push({
          color: this.color,
          from: this.position.algebraic,
          to: `c${initialRank}`,
          piece: this.type,
          castle: "queen",
        });
      }
    }

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

export default King;
