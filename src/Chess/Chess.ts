import type {
  Color,
  GameState,
  MoveType,
  CompleteHalfMove,
  // FullMove,
  HalfMove,
  CastlingAbility,
  ChessExecuteOptions,
  GameStatus,
  CastleType,
} from ".";
import { validateFEN } from "../utils/validation";
import { nullMessage } from "../utils/error";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import { fen2matrix } from "../utils";
import { Piece } from "../Piece";
import { algebraicMove } from "../utils/helpers";

class Chess {
  private moves: CompleteHalfMove[] = [];
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
  public setMoves(moves: CompleteHalfMove[]): void {
    // TODO validate the moves
    this.moves = moves;
  }

  // =============== Getters ===============
  /**
   * Returns the color to move
   */
  public colorToMove(): Color {
    if (this.moves.length === 0) return "white";
    const lastMove = this.moves.at(-1) as CompleteHalfMove;
    return lastMove.move.color === "white" ? "black" : "white";
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
    // let lastFull = this.moves.at(-1);
    let lastMove: HalfMove | undefined = this.moves.at(-1)?.move;
    // if (lastFull) {
    //   if (lastFull.black && lastFull.white) {
    //     lastMove = lastFull.black.move;
    //   } else if (lastFull.white) {
    //     lastMove = lastFull.white.move;
    //   }
    // }
    let enPassant: SquareID | undefined;
    if (lastMove && lastMove.check) inCheck = true;
    if (lastMove && lastMove.piece === "pawn") {
      const from = SquareID.fromAlgebraic(lastMove.from);
      const to = SquareID.fromAlgebraic(lastMove.to);
      const diff = Math.abs(to.rank - from.rank);
      const dir = Math.sign(to.rank - from.rank);
      if (diff === 2) {
        // moved 2 squares
        enPassant = from.copy().addRank(dir);
      }
    }

    for (let completeMove of this.moves) {
      const color = completeMove.move.color;
      if (completeMove.move.piece === "king") {
        castling[color].king = false;
        castling[color].queen = false;
      }
      if (completeMove.move.piece === "rook") {
        const kingside = new SquareID("h", color === "white" ? 1 : 8);
        const queenside = new SquareID("a", color === "white" ? 1 : 8);
        const from = new SquareID(completeMove.move.from);
        if (kingside.equals(from)) {
          castling[color].king = false;
        }

        if (queenside.equals(from)) {
          castling[color].queen = false;
        }
      }
    }

    return {
      colorToMove: this.colorToMove(),
      castling,
      inCheck,
      enPassant: enPassant?.algebraic,
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
    const nonKing: Piece[] = matrix
      .flatMap((a) => a)
      .filter((piece) => piece && piece.type !== "king") as Piece[];

    // if 0 length, means only 2 kings
    if (nonKing.length === 0) return true;

    // 1 knight or 1 bishop only
    if (
      nonKing.length === 1 &&
      (nonKing[0].type === "bishop" || nonKing[0].type === "knight")
    )
      return true;

    // both have 1 bishop on the same color square
    if (
      nonKing.length === 2 &&
      nonKing[0].type === "bishop" &&
      nonKing[1].type === "bishop" &&
      nonKing[0].position.color === nonKing[1].position.color
    )
      return true;

    return false;
  }

  public repetition(): boolean {
    const moves = this.history();
    const genCastleString = (castling: {
      [K in CastleType]?: boolean;
    }) => {
      let res = "";
      if (castling.king) res += "k";
      if (castling.queen) res += "q";
      if (res === "") res += "-";
      return res;
    };
    // create an array with a "rich FEN", `${FEN} ${colorToMove} ${castling} ${en passant target}`
    // when any of these positions repeat 3 times in a row, draw by repetition.
    const richFENs: string[] = moves.map((complete) => {
      let color = complete.move.color;
      let richFEN = `${complete.state.fen} ${color === "white" ? "b" : "w"} ${genCastleString(complete.state.gameState.castling[color])} ${complete.state.gameState.enPassant ?? "-"}`;
      return richFEN;
    });
    const map: Record<string, number> = {};
    for (let fen of richFENs) {
      if (fen in map) {
        map[fen]++;
      } else {
        map[fen] = 1;
      }
    }

    for (let fen in map) {
      if (map[fen] >= 3) return true;
    }
    return false;
  }

  public fiftymove(): boolean {
    if (this.moves.length < 100) return false;
    let lastFifty =
      this.moves.length === 100 ? this.moves : this.moves.slice(-100);
    for (let i = lastFifty.length - 1; i >= 0; i--) {
      const curr = lastFifty[i];
      if (curr.move.piece === "pawn") return false;
      if (curr.move.take) return false;
    }

    return true;
  }

  public status(): GameStatus {
    if (this.checkmate()) return "checkmate";
    if (this.stalemate()) return "stalemate";
    if (this.insufficient()) return "insufficient";
    if (this.repetition()) return "repetition";
    if (this.fiftymove()) return "50move";
    if (this.state().inCheck) return "check";
    return "in-progress";
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
      const mFrom = SquareID.fromAlgebraic(move.from);
      const mTo = SquareID.fromAlgebraic(move.to);
      let isValid = false;
      const validMoves = this.validMoves();
      for (let validMove of validMoves) {
        const vFrom = SquareID.fromAlgebraic(validMove.from);
        const vTo = SquareID.fromAlgebraic(validMove.to);
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
    const colorToMove = this.colorToMove();
    if (colorToMove !== halfMove.color) {
      return nullMessage(
        `Cannot move ${halfMove.color} on ${colorToMove}'s turn!`,
        opts?.silent,
      );
    }
    
    this.moves.push({
      move: halfMove,
      state: {
        fen: board.fen(),
        gameState: this.state()
      },
      algebraic: algebraicMove(halfMove, this.validMoves())
    })
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
