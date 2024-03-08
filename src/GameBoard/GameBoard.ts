import { Piece } from "../Piece";
import { validateFEN } from "../utils/validation";
import type {
  Color,
  GameState,
  MatrixType,
  MoveType,
  PieceType,
  HalfMove,
  GameBoardExecuteOptions,
} from "../Chess";
import { SquareID } from "../SquareID";
import {
  fen2matrix,
  matrix2fen,
  str2piece,
} from "../utils/transform";
import { nullMessage } from "../utils/error";

export type ValidMovesOpts = {
  kings?: boolean,
  opponent?: boolean,
  noSelfCheck?: boolean
}

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

  /**
   * Iterates over the matrix
   * @param callbackfn
   */
  private iter(
    callbackfn: (
      piece: MatrixType,
      id: [number, number],
      matrix: MatrixType[][],
    ) => void,
  ) {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        callbackfn(this.matrix[i][j], [i, j], this.matrix);
      }
    }
  }

  /**
   * Checks if the move executed puts the opponent in check
   *
   * Should be called after the move is executed (i.e. matrix is updated)
   * @param state GameState
   * @returns
   */
  private checkForCheck(state: GameState): Color[] {
    let unChecked: GameState = { ...state, inCheck: false };
    const board = new GameBoard(this.fen());
    const allValidMoves = board.allValidMoves(unChecked, { kings: true, opponent: true, noSelfCheck: false });
    let checks: Color[] = []
    for (let move of allValidMoves) {
      if (move.take && move.take === "king") {
        checks.push(move.color === "white" ? "black" : "white");
      }
    }

    return checks;
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
    });
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
  public execute(
    move: MoveType,
    state: GameState,
    opts?: GameBoardExecuteOptions,
  ): HalfMove | null {
    let from: SquareID = SquareID.fromSquareIDType(move.from);
    let to: SquareID = SquareID.fromSquareIDType(move.to);

    const fromPiece = this.atID(from);
    if (!fromPiece) {
      return nullMessage(
        "Could not find piece to move!",
        opts?.silent,
      );
    }

    if (move.castle) {
      // handle castling
      // castling, move.to -> spot the king moves to
      if (fromPiece.type !== "king") {
        return nullMessage(
          "Cannot castle a non-king piece!",
          opts?.silent,
        );
      }
      const initialRank = fromPiece.color === "white" ? 1 : 8;
      const rookFile = move.castle === "king" ? 8 : 1;
      const rookFromPos = new SquareID(rookFile, initialRank);
      const rook = this.atID(new SquareID(rookFile, initialRank));
      if (!rook || rook.type !== "rook") {
        return nullMessage(
          `Cannot castle ${move.castle}side, rook is not on the \`${move.castle === "king" ? "h" : "a"}\` file!`,
          opts?.silent,
        );
      }
      let rookToPos = to
        .copy()
        .addFile(move.castle === "king" ? -1 : 1);
      this.matrix[from.matrixID[0]][from.matrixID[1]] = undefined;
      this.matrix[to.matrixID[0]][to.matrixID[1]] = fromPiece;
      this.matrix[rookFromPos.matrixID[0]][rookFromPos.matrixID[1]] =
        undefined;
      this.matrix[rookToPos.matrixID[0]][rookToPos.matrixID[1]] =
        rook;

      const check = this.checkForCheck(state).find(c => c !== fromPiece.color);

      return {
        from: move.from,
        to: move.to,
        color: fromPiece.color,
        piece: fromPiece.type,
        castle: move.castle,
        check
      };
    }

    const toPiece = this.atID(to);
    if (toPiece && fromPiece.color === toPiece.color) {
      return nullMessage(
        "Cannot take piece of the same color",
        opts?.silent,
      );
    }

    this.matrix[from.matrixID[0]][from.matrixID[1]] = undefined;
    this.matrix[to.matrixID[0]][to.matrixID[1]] = move.promotion
      ? str2piece(move.promotion, from, fromPiece.color)
      : fromPiece;

    if (move.enPassant) {
      let dir = fromPiece.color === "white" ? -1 : 1;
      try {
        let enPassantTarget = to.copy().addRank(dir);
        let enPassantPiece = this.atID(enPassantTarget);
        if (!enPassantPiece) return nullMessage("Cannot find piece on en passant target square!", opts?.silent);
        this.matrix[enPassantTarget.matrixID[0]][enPassantTarget.matrixID[1]] = undefined;
      } catch (error) {
        return nullMessage(`${error}`, opts?.silent)
      }

    }

    const checks = this.checkForCheck(state);
    let check = checks.find(c => c !== state.colorToMove)

    if (checks.some(c => c === state.colorToMove)) {
      this.matrix[from.matrixID[0]][from.matrixID[1]] = fromPiece;
      this.matrix[to.matrixID[0]][to.matrixID[1]] = toPiece;
      return nullMessage(
        "Cannot make move that puts your own king in check!",
        opts?.silent,
      );
    }

    return {
      from: move.from,
      to: move.to,
      color: fromPiece.color,
      piece: fromPiece.type,
      take: move.enPassant ? "pawn" : toPiece?.type,
      castle: move.castle,
      check,
      promotion: move.promotion,
    };
  }

  /**
   * Gets all the valid moves
   * @param state The state of the game
   * @param includeKings If true, will include ability to take kings
   * @param includeOpponent If true, will include opponent moves
   * @returns
   */
  public allValidMoves(
    state: GameState,
    opts?: ValidMovesOpts
    // includeKings: boolean = false,
    // includeOpponent: boolean = false,
    // filterChecks: boolean = true,
  ): HalfMove[] {
    let kings = opts?.kings ?? false;
    let opponent = opts?.opponent ?? false;
    let noSelfCheck = opts?.noSelfCheck ?? true;
    const moves: HalfMove[] = [];
    this.iter((piece) => {
      if (opponent) {
        if (piece) {
          moves.push(...piece.validMoves(this, state, noSelfCheck));
        }
      } else {
        if (piece && piece.color === state.colorToMove) {
          moves.push(...piece.validMoves(this, state, noSelfCheck));
        }
      }
    });
    return moves.filter((move) => {
      if (kings) {
        return true;
      } else {
        if (move.take && move.take === "king") {
          return false;
        } else {
          return true;
        }
      }
    });
  }

  static createMatrix(fen: string): MatrixType[][] {
    validateFEN(fen);
    return fen2matrix(fen);
  }
}

export default GameBoard;
