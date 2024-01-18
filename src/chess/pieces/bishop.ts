import Piece from ".";

class Bishop extends Piece {
  public type: string = "bishop";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default Bishop;
