import Piece from "../Piece";
import { validateFEN } from "../utils/validation";
import { Color, GameState, MatrixType, MoveType, PieceType, HalfMove } from "@engine-types";
import SquareID from "../SquareID";
import { fen2matrix, matrix2fen } from "../utils/transform";
import Move from "../Move";

class GameBoard {
  private matrix: MatrixType[][] = [];
  constructor(param: MatrixType[][]);
  constructor(param: string);
  constructor(param: string | MatrixType[][]) {
    if (typeof param === "string") {
      this.matrix = GameBoard.createMatrix(param);
    } else {
      this.matrix = param;
    }
  }

  
  private iter(callbackfn: (piece: MatrixType, id: [number, number], matrix: MatrixType[][]) => void) {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        callbackfn(this.matrix[i][j], [i, j], this.matrix);
      }
    }
  }

  /**
   * Returns the piece (or undefined) at a given square
   * @param id SquareID
   * @returns 
   */
  public atID(id: SquareID): MatrixType; 

  /**
   * Returns the piece (or undefined) at a given square
   * @param id The indices of the matrix [i, j]
   */
  public atID(id: [number, number]): MatrixType;

  public atID(id: SquareID | [number, number]): MatrixType {
    const [row, col] = Array.isArray(id) ? id : id.matrixID;
    return this.matrix[row][col];
  }

  /**
   * Searches for a piece and returns any matches.
   * @param type The type of piece to search for.
   * @param color The color of the piece to search for.
   */
  public find(type: PieceType, color: Color): Piece[] | undefined {
    let result: Piece[] = [];
    this.iter((piece) => {
      if (piece && piece.type == type && piece.color === color) {
        result.push(piece);
      }
    })
    return result.length !== 0 ? result : undefined;
  }

  /**
   * Generates the FEN string for the current position.
   */
  public fen() {
    return matrix2fen(this.matrix);
  }

  /**
   * Executes a move on the game board
   * @param move A move object
   * @mutating
   */
  public execute(move: MoveType): HalfMove | null {
    
    let from: SquareID = SquareID.fromSquareIDType(move.from);
    let to: SquareID = SquareID.fromSquareIDType(move.to);

    const fromPiece = this.atID(from);
    if (!fromPiece) {
      console.warn("Could not find piece to move!")
      return null;
    }

    if (move.castle) {
      // TODO handle castling
      return {
        from: move.from,
        to: move.to,
        color: fromPiece.color,
        castle: move.castle,
      };
    }

    const toPiece = this.atID(to);
    if (toPiece && fromPiece.color === toPiece.color) {
      console.warn("Cannot take piece of the same color")
      return null;
    }

    this.matrix[from.matrixID[0]][from.matrixID[1]] = undefined;
    this.matrix[to.matrixID[0]][to.matrixID[1]] = fromPiece;

    return {
      from: move.from,
      to: move.to,
      color: fromPiece.color,
      take: toPiece?.type,
      castle: move.castle,
    };
  }

  public allValidMoves(state: GameState): Move[] {
    const moves: Move[] = [];
    this.iter((piece) => {
      if (piece && piece.color === state.colorToMove) {
        moves.push(...piece.validMoves(this, state))
      }
    })
    return moves;
  }


  static createMatrix(fen: string): MatrixType[][] {
    validateFEN(fen);
    return fen2matrix(fen);
  }


}

export default GameBoard;
