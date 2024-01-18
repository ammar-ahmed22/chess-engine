import { GameState } from "../game";
import Move, { SquareID } from "../move";

abstract class Piece {
  private isWhite: boolean;
  public position: SquareID;
  public abstract type: string;
  constructor(isWhite: boolean, position: SquareID) {
    this.isWhite = isWhite;
    this.position = position;
  }

  get color(): "white" | "black" {
    return this.isWhite ? "white" : "black";
  }

  public abstract validMoves(gameState: GameState): Move[];
  public abstract get fenChar(): string;
}

export default Piece;
