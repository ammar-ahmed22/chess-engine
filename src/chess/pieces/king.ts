import Piece from ".";

class King extends Piece {
  public type: string = "king";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default King;