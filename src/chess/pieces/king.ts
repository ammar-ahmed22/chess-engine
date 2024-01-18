import Piece from ".";
import { GameState } from "../game";
import Move from "../move";

class King extends Piece {
  public type: string = "king";
  // constructor(white: boolean = true) {
  //   super(white);
  // }

  public validMoves(gameState: GameState): Move[] {
    return [];
  }

  public get fenChar(): string {
    return this.color === "white" ? "K" : "k";
  }
}

export default King;
