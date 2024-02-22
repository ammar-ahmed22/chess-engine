import Piece from "../../Piece";
import GameBoard from "../../GameBoard";
import SquareID from "../../SquareID";
import { PieceType, GameState, HalfMove } from "@engine-types";

class Pawn extends Piece {
  public type: PieceType = "pawn";

  public get fenChar(): string {
    return this.color === "white" ? "P" : "p"
  }

  public validMoves(board: GameBoard, state: GameState): HalfMove[] {
    const moves: HalfMove[] = [];
    let firstMove = false;
    let dir = this.color === "white" ? 1 : -1;
    const secondLastRank = dir === -1 ? 2 : 7;
    if (this.color === "white" && this.position.rank === 2) firstMove = true;
    if (this.color === "black" && this.position.rank === 7) firstMove = true;

    // TODO: Piece promotion!!
    if (this.position.rank === secondLastRank) {
      const potentials = [
        this.position.copy().addRank(dir), // one rank above
        this.position.file !== 1 ? this.position.copy().addRank(dir).addFile(-1) : undefined,
        this.position.file !== 8 ? this.position.copy().addRank(dir).addFile(1) : undefined
      ].filter(p => p) as SquareID[];
      for (let potential of potentials) {
        const promotions = ["queen", "knight", "rook", "bishop"];
        for (let promotion of promotions) {
          if (this.position.file === potential.file) { // regular move
            moves.push({
              color: this.color,
              from: this.position.algebraic,
              to: potential.algebraic,
              piece: this.type,
              promotion
            })
          } else { // take
            const piece = board.atID(potential);
            if (piece && piece.color !== this.color) {
              moves.push({
                color: this.color,
                from: this.position.algebraic,
                to: potential.algebraic,
                piece: this.type,
                take: piece.type,
                promotion
              })
            }
          }
        }
      }
      return moves;
    }

    // 1 rank and 2 ranks above
    for (let i = 0; i < 2; i++) {
      const pos = this.position.copy().addRank(dir * (i + 1));
      const move: HalfMove = {
        color: this.color,
        from: this.position.algebraic,
        to: pos.algebraic,
        piece: this.type,
      }
      // Square must be empty to move there
      if (board.atID(pos)) continue;
      if (i === 0) {
        moves.push(move)
      } else if (firstMove) {
        moves.push(move)
      }
    }

    const potentialTakes = [
      this.position.file !== 8 ? this.position.copy().addRank(dir).addFile(1) : undefined,
      this.position.file !== 1 ? this.position.copy().addRank(dir).addFile(-1) : undefined 
    ].filter(p => p) as SquareID[];

    for (let potential of potentialTakes) {
      const potentialPiece = board.atID(potential)
      if (potentialPiece && potentialPiece.color !== this.color) {
        moves.push({
          from: this.position.algebraic,
          to: potential.algebraic,
          piece: this.type,
          color: this.color,
          take: potentialPiece.type,
        })
      }
    }

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

export default Pawn;