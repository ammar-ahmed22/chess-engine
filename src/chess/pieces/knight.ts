import Piece from ".";

class Knight extends Piece {
  public type: string = "knight";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default Knight;