import Piece from "./pieces";
import Pawn from "./pieces/pawn";
import { SquareID } from "./squareID";

type MoveConstructorParams = {
  white?: boolean;
  from: SquareID;
  to: SquareID;
  castle?: boolean;
  take?: Piece;
  piece: Piece;
  check?: boolean;
};

class Move {
  public white: boolean = true;
  public from: SquareID = new SquareID(1, 1);
  public to: SquareID = new SquareID(1, 1);
  public castle: boolean = false;
  public take?: Piece;
  public piece: Piece = new Pawn(this.white, this.from);
  public check?: boolean = false;
  constructor(params: MoveConstructorParams) {
    Object.assign(this, params);
  }
}

export default Move;
