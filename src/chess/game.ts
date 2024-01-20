import Move from "./move";
import Piece from "./pieces";
import { SquareID } from "./move";
import { Chess } from "./types";

class GameBoard {
  public matrix: (Piece | undefined)[][] = [];
  constructor(matrix: (Piece | undefined)[][]) {
    this.matrix = matrix;
  }

  public get = {
    atID: (id: SquareID): Piece | undefined => {
      const [row, col] = id.boardIdx;
      return this.matrix[row][col];
    },
    flattenedMatrix: (reverse: boolean = false) => {
      if (reverse) {
        // Render black on the bottom
        return this.matrix.flatMap((row) => row).reverse();
      }
      return this.matrix.flatMap((row) => row);
    },
  };
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
  public moves: Move[] = [];
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
