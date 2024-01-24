import Move from "./move";
import Piece from "./pieces";
import { SquareID } from "./squareID";
import { Chess } from "./types";

class GameBoard {
  public matrix: (Piece | undefined)[][] = [];
  constructor(matrix: (Piece | undefined)[][]) {
    this.matrix = matrix;
  }

  public get = {
    /**
     * Gets the piece at the given SquareID
     * @param id SquareID instance
     * @returns
     */
    atID: (id: SquareID): Piece | undefined => {
      const [row, col] = id.boardIdx;
      return this.matrix[row][col];
    },
    /**
     * Returns a flattened matrix (1d array)
     * @param reverse Boolean whether to reverse the order
     * @returns
     */
    flattenedMatrix: (reverse: boolean = false) => {
      if (reverse) {
        // Render black on the bottom
        return this.matrix.flatMap((row) => row).reverse();
      }
      return this.matrix.flatMap((row) => row);
    },
  };

  /**
   * Deep copies the GameBoard
   * @returns GameBoard
   */
  public copy(): GameBoard {
    const matrix: (Piece | undefined)[][] = [];
    for (let i = 0; i < this.matrix.length; i++) {
      let temp: (Piece | undefined)[] = [];
      for (let j = 0; j < this.matrix[i].length; j++) {
        temp.push(this.matrix[i][j]?.copy());
      }
      matrix.push(temp);
    }
    return new GameBoard(matrix);
  }

  static executeMove(gameBoard: GameBoard, move: Move) {
    const copy = gameBoard.copy();
    let taken: Piece | undefined = undefined;
    let takenBy: Piece | undefined = undefined;

    if (move.castle) {
      // handle castling
    } else {
      const fromPiece = copy.get.atID(move.from);
      if (!fromPiece) {
        throw new Error("Cannot find piece to move!");
      }

      const fromIdx = move.from.boardIdx;
      const toPiece = copy.get.atID(move.to);
      if (toPiece && toPiece.color === fromPiece.color) {
        throw new Error(
          "Cannot take piece of the same color!",
        );
      }
      if (toPiece) {
        taken = toPiece.copy();
        takenBy = fromPiece.copy();
      }
      const toIdx = move.to.boardIdx;
      copy.matrix[fromIdx[0]][fromIdx[1]] = undefined;
      copy.matrix[toIdx[0]][toIdx[1]] = fromPiece.copy();
    }

    // return [copy, []];
    return {
      gameBoard: copy,
      taken,
      takenBy,
    };
  }
}

type GameStateParams = {
  gameBoard: GameBoard;
  whiteToMove: boolean;
  enPassant?: SquareID;
  castling: Chess.Castling;
  halfMoveCount: number;
  fullMoveCount: number;
};

class GameState {
  public gameBoard: GameBoard;
  public whiteToMove: boolean;
  public castling: Chess.Castling;
  public halfMoveCount: number;
  public fullMoveCount: number;
  public enPassant?: SquareID;
  constructor({
    gameBoard,
    whiteToMove,
    castling,
    enPassant,
    halfMoveCount,
    fullMoveCount,
  }: GameStateParams) {
    this.gameBoard = gameBoard;
    this.whiteToMove = whiteToMove;
    this.castling = castling;
    this.enPassant = enPassant;
    this.halfMoveCount = halfMoveCount;
    this.fullMoveCount = fullMoveCount;
  }
}

export { GameBoard, GameState };
