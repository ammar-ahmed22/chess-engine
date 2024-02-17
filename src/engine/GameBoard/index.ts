import Piece from "../Piece";
import { MatrixType } from "@engine-types";

class GameBoard {
  private matrix: MatrixType[][] = [];
  constructor(fen: string) {
    this.matrix = GameBoard.createMatrix(fen);
  }

  static createMatrix(fen: string): MatrixType[][] {

    return []
  }
}

export default GameBoard;