import { Color, GameState, MoveType, FullMove, HalfMove, CastlingAbility, ChessExecuteOptions } from "@engine-types";
import { validateFEN } from "../utils/validation";
import { nullMessage } from "../utils/error";
import GameBoard from "../GameBoard";
import SquareID from "../SquareID";

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
    if (lastFull.white && !lastFull.black) return "black";
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
        king: true
      },
      black: {
        queen: true,
        king: true
      }
    };
    let inCheck: boolean = false;
    let lastFull = this.moves.at(-1);
    if (lastFull) {
      if (lastFull.black && lastFull.white) {
        if (lastFull.black.check) inCheck = true;
      } else if (lastFull.white) {
        if (lastFull.white.check) inCheck = true;
      }
    }
    for (let fullMove of this.moves) {
      const whiteMove = fullMove.white;
      const blackMove = fullMove.black;
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
    }
  }

  /**
   * Returns the moves played
   */
  public history() {
    return this.moves;
  }

  public checkmate(): boolean {
    return this.state().inCheck && this.validMoves().length === 0
  }

  // =============== Methods ===============
  /**
   * Executes a move and updates the game state
   * @param move Move object
   */
  public execute(move: MoveType | HalfMove, opts?: ChessExecuteOptions): HalfMove | null {
    if (opts?.validate) {
      // check if the passed move is in the valid moves.
      const mFrom = SquareID.fromSquareIDType(move.from);
      const mTo = SquareID.fromSquareIDType(move.to);
      let isValid = false;
      const validMoves = this.validMoves();
      for (let validMove of validMoves) {
        const vFrom = SquareID.fromSquareIDType(validMove.from);
        const vTo = SquareID.fromSquareIDType(validMove.to);
        if (vFrom.algebraic === mFrom.algebraic && vTo.algebraic === mTo.algebraic) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        return nullMessage("Move is not valid!", opts?.silent)
      }
    }
    const board = new GameBoard(this.currentFen);
    const halfMove = board.execute(move, this.state(), { silent: opts?.silent });
    if (!halfMove) return null;
    const idx = this.moves.length - 1;
    const colorToMove = this.colorToMove();
    if (colorToMove !== halfMove.color) {
      return nullMessage(`Cannot move ${halfMove.color} on ${colorToMove}'s turn!`, opts?.silent);
    }
    if (halfMove.color === "white") {
      this.moves.push({
        white: halfMove
      })
    } else {
      this.moves[idx].black = halfMove;
    }
    this.currentFen = board.fen();
    return halfMove
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
