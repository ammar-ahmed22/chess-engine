import { Color, MoveType } from "@engine-types";
import Piece from "../Piece";
import SquareID from "../SquareID";

class Move {
  // public color: Color | undefined;
  // public from: SquareID;
  // public to: SquareID;
  // public take: Piece | undefined;
  // public piece: Piece;
  // public castle: boolean | undefined; 
  // public check: boolean | undefined;
  // public enPassant?: boolean | undefined;

  // constructor(params: MoveType) {
  //   this.color = params.color;
  //   this.from = params.from;
  //   this.to = params.to;
  //   this.take = params.take;
  //   this.piece = params.piece;
  //   this.castle = params.castle;
  //   this.check = params.check;
  //   this.enPassant = params.enPassant;
  // }

  
  // probably won't include this -> requires figuring out valid moves for each piece, too much work
  // when both Rooks, for example, can move to the same square, have to distinguish one of them
  // Thus, requires knowing where the other pieces on the board
  // /**
  //  * Returns the move in algebraic notation
  //  *
  //  * @readonly
  //  * @type {string}
  //  */
  // get algebraic() {
  //   if (this.piece.type === "pawn" && !this.take) {
  //     return this.to.algebraic;
  //   }
  //   if (this.take) {

  //   }
  //   return ""
  // }
}

export default Move;