import Piece from ".";
import { GameState } from "../game";
import Move, { SquareID } from "../move";

class Knight extends Piece {
  public type: string = "knight";
  // constructor(white: boolean = true) {
  //   super(white);
  // }

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "N" : "n";
  }
}

export default Knight;
