import Piece from ".";
import { GameState } from "../game";
import Move, { SquareID } from "../move";

class Rook extends Piece {
  public type: string = "rook";
  // constructor(white: boolean = true) {
  //   super(white);
  // }

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "R" : "r";
  }
}

export default Rook;
