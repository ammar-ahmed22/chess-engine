import Piece from ".";
import { GameState } from "../game";
import Move, { SquareID } from "../move";

class Queen extends Piece {
  public type: string = "queen";
  // constructor(white: boolean = true) {
  //   super(white);
  // }

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "Q" : "q";
  }
}

export default Queen;
