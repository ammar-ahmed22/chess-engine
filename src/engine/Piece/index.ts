import SquareID from "../SquareID";
import { Color, GameState, PieceType, HalfMove } from "@engine-types";
import Move from "../Move";
import GameBoard from "../GameBoard";


abstract class Piece {
  public color: Color;
  protected position: SquareID;

  constructor(color: Color, position: SquareID) {
    this.color = color;
    this.position = position;
  }

  public abstract type: PieceType;
  public abstract validMoves(board: GameBoard, state: GameState): HalfMove[];
  public abstract get fenChar(): string;
}

export default Piece;
