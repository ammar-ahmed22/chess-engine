import Piece from ".";
import { GameState } from "../game";
import Move from "../move";

class Bishop extends Piece {
  public type: string = "bishop";
  // constructor(white: boolean, position: SquareID) {
  //   super(white, position);
  // }

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "B" : "b";
  }
}

export default Bishop;
