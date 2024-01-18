import Piece from "./index";

class Pawn extends Piece {
  public type: string = "pawn";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default Pawn;