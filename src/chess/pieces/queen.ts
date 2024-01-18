import Piece from ".";

class Queen extends Piece {
  public type: string = "queen";
  constructor(white: boolean = true) {
    super(white);
  }

  public validMoves(): string {
    return "bing";
  }
}

export default Queen;