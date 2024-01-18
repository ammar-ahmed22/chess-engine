import Piece from ".";

class Rook extends Piece {
  public type: string = "rook";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default Rook;
