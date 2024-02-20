import { Color, GameState, MoveType, FullMove, HalfMove, CastlingAbility } from "@engine-types";
import { validateFEN } from "../utils/validation";
import GameBoard from "../GameBoard";

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
    // TODO validate the fen before adding it
    validateFEN(fen);
    this.currentFen = fen;
  }

  /**
   * Sets the moves of the game
   * @param moves An array of Move objects.
   */
  public setMoves(moves: FullMove[]): void {
    // TODO validate the moves
    // moves should alternate black and white
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
    // TODO all of these values should be generated by the moves
    // e.g. castling ability should be found by going through the moves.
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
    for (let fullMove of this.moves) {
      const whiteMove = fullMove.white;
      const blackMove = fullMove.black;
      if (whiteMove && whiteMove.castle) {
        // TODO figure this out based on how you handle castling
      }

      if (blackMove && blackMove.castle ) {
        // TODO figure this out based on how you handle castling
      }
    }
    return {
      colorToMove: this.colorToMove(),
      castling
    }
  }

  /**
   * Returns the moves played
   */
  public history() {
    return this.moves;
  }

  // =============== Methods ===============
  /**
   * Executes a move and updates the game state
   * @param move Move object
   */
  public execute(move: MoveType | HalfMove, validate?: boolean): HalfMove | null {
    // COMPLETE validate the move before executing it (move execution handles this)
    // COMPLETE execute the move and update the FEN
    // COMPLETE update the moves
    // COMPLETE something is wonky here, I think you can possibly execute a black piece as the first move (FIXED)
    if (validate) {
      // check if the passed move is in the valid moves.
      const validMoves = this.validMoves();
      // do the check, return null if not found.
    }
    const board = new GameBoard(this.currentFen);
    const halfMove = board.execute(move);
    if (!halfMove) return null;
    const idx = this.moves.length - 1;
    const colorToMove = this.colorToMove();
    if (colorToMove !== halfMove.color) {
      console.warn(`Cannot move ${halfMove.color} on ${colorToMove}'s turn!`)
      return null;
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
