import type {
  Color,
  GameState,
  MoveType,
  FullMove,
  HalfMove,
  CastlingAbility,
  ChessExecuteOptions,
  GameStatus
} from ".";
import { validateFEN } from "../utils/validation";
import { nullMessage } from "../utils/error";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import { fen2matrix } from "../utils";
import { Piece } from "../Piece";

class Chess {
  private moves: FullMove[] = [];
  private currentFen: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  // =============== Setters ===============
  /**
   * Sets the current position of the game
   * @param fen FEN string (e.g. whatever the fuck)
   */
  public setPosition(fen: string): void {
    validateFEN(fen);
    this.currentFen = fen;
  }

  /**
   * Sets the moves of the game
   * @param moves An array of Move objects.
   */
  public setMoves(moves: FullMove[]): void {
    // TODO validate the moves
    this.moves = moves;
  }

  // =============== Getters ===============
  /**
   * Returns the color to move
   */
  public colorToMove(): Color {
    if (this.moves.length === 0) return "white";
    const lastFull = this.moves.at(-1) as FullMove;
    if (lastFull.moves.white && !lastFull.moves.black) return "black";
    return "white";
  }

  /**
   * Returns the current FEN position
   */
  public fen() {
    return this.currentFen;
  }

  public state(): GameState {
    let castling: CastlingAbility = {
      white: {
        queen: true,
        king: true,
      },
      black: {
        queen: true,
        king: true,
      },
    };
    let inCheck: boolean = false;
    let lastFull = this.moves.at(-1);
    let lastMove;
    if (lastFull) {
      if (lastFull.moves.black && lastFull.moves.white) {
        lastMove = lastFull.moves.black;
      } else if (lastFull.moves.white) {
        lastMove = lastFull.moves.white;
      }
    }
    let enPassant: SquareID | undefined;
    if (lastMove && lastMove.check) inCheck = true;
    if (lastMove && lastMove.piece === "pawn") {
      const from = SquareID.fromSquareIDType(lastMove.from);
      const to = SquareID.fromSquareIDType(lastMove.to);
      const diff = Math.abs(to.rank - from.rank);
      const dir = Math.sign(to.rank - from.rank);
      if (diff === 2) { // moved 2 squares
        enPassant = from.copy().addRank(dir);
      }
    }

    for (let fullMove of this.moves) {
      const whiteMove = fullMove.moves.white;
      const blackMove = fullMove.moves.black;
      if (whiteMove && whiteMove.piece === "king") {
        castling.white.king = false;
        castling.white.queen = false;
      }
      if (whiteMove && whiteMove.piece === "rook") {
        const h1 = new SquareID("h1");
        const a1 = new SquareID("a1");
        const from = SquareID.fromSquareIDType(whiteMove.from);
        if (h1.algebraic === from.algebraic) {
          castling.white.king = false;
        }
        if (a1.algebraic === from.algebraic) {
          castling.white.queen = false;
        }
      }

      if (blackMove && blackMove.piece === "king") {
        castling.black.king = false;
        castling.black.queen = false;
      }
      if (blackMove && blackMove.piece === "rook") {
        const h8 = new SquareID("h8");
        const a8 = new SquareID("a8");
        const from = SquareID.fromSquareIDType(blackMove.from);
        if (h8.algebraic === from.algebraic) {
          castling.black.king = false;
        }
        if (a8.algebraic === from.algebraic) {
          castling.black.queen = false;
        }
      }
    }

    return {
      colorToMove: this.colorToMove(),
      castling,
      inCheck,
      enPassant
    };
  }

  /**
   * Returns the moves played
   */
  public history() {
    return this.moves;
  }

  /**
   * Returns true if checkmate
   */
  public checkmate(): boolean {
    return this.state().inCheck && this.validMoves().length === 0;
  }

  /**
   * Returns true if stalemate
   */
  public stalemate(): boolean {
    return !this.state().inCheck && this.validMoves().length === 0;
  }

  /**
   * Returns true if draw by insufficient material
   */
  public insufficient(): boolean {
    const matrix = fen2matrix(this.fen());
    const nonKing: Piece[] = matrix.flatMap(a => a).filter(piece => piece && piece.type !== "king") as Piece[];
    
    // if 0 length, means only 2 kings
    if (nonKing.length === 0) return true;

    // 1 knight or 1 bishop only
    if (nonKing.length === 1 && (nonKing[0].type === "bishop" || nonKing[0].type === "knight")) return true;

    // both have 1 bishop on the same color square
    if (nonKing.length === 2 && nonKing[0].type === "bishop" && nonKing[1].type === "bishop" && nonKing[0].position.color === nonKing[1].position.color) return true;

    return false;
  }

  public status(): GameStatus {
    if (this.checkmate()) return "checkmate";
    if (this.stalemate()) return "stalemate";
    if (this.insufficient()) return "insufficient";

    if (this.state().inCheck) return "check";
    return "in-progress"
  }

  /**
   * Clones the Chess object
   */
  public clone(): Chess {
    const chess = new Chess();
    chess.setPosition(this.fen());
    chess.setMoves(this.history());
    return chess;
  }

  /**
   * Returns a GameBoard object with the current position
   */
  public board(): GameBoard {
    return new GameBoard(this.currentFen);
  }

  // =============== Methods ===============
  /**
   * Executes a move and updates the game state
   * @param move Move object
   */
  public execute(
    move: MoveType | HalfMove,
    opts?: ChessExecuteOptions,
  ): HalfMove | null {
    if (opts?.validate) {
      // check if the passed move is in the valid moves.
      const mFrom = SquareID.fromSquareIDType(move.from);
      const mTo = SquareID.fromSquareIDType(move.to);
      let isValid = false;
      const validMoves = this.validMoves();
      for (let validMove of validMoves) {
        const vFrom = SquareID.fromSquareIDType(validMove.from);
        const vTo = SquareID.fromSquareIDType(validMove.to);
        if (
          vFrom.algebraic === mFrom.algebraic &&
          vTo.algebraic === mTo.algebraic
        ) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        return nullMessage("Move is not valid!", opts?.silent);
      }
    }
    const board = new GameBoard(this.currentFen);
    const halfMove = board.execute(move, this.state(), {
      silent: opts?.silent,
    });
    if (!halfMove) return null;
    const idx = this.moves.length - 1;
    const colorToMove = this.colorToMove();
    if (colorToMove !== halfMove.color) {
      return nullMessage(
        `Cannot move ${halfMove.color} on ${colorToMove}'s turn!`,
        opts?.silent,
      );
    }
    if (halfMove.color === "white") {
      this.moves.push({
        moves: {
          white: halfMove
        },
        state: {
          white: {
            fen: board.fen(),
            state: this.state()
          }
        }
      });
    } else {
      this.moves[idx].moves.black = halfMove;
      this.moves[idx].state.black = {
        fen: board.fen(),
        state: this.state()
      }
    }
    this.currentFen = board.fen();
    return halfMove;
  }

  /**
   *
   * @returns All the valid moves for the current position
   */
  public validMoves(): HalfMove[] {
    const board = new GameBoard(this.currentFen);
    return board.allValidMoves(this.state());
  }
}

export default Chess;
