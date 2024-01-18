abstract class Piece {
  private isWhite: boolean;
  public abstract type: string;
  constructor(isWhite: boolean = false) {
    this.isWhite = isWhite;
  }

  get color(): "white" | "black" {
    return this.isWhite ? "white" : "black";
  }

  public abstract validMoves(): string;
}

export default Piece;
