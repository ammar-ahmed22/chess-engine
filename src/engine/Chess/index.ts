import { Color, Move } from "@engine-types";
import { validateFEN } from "../utils/validation";

class Chess {
  private moves: string[] = [];
  private currentFen: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  private castling: {
    [K in Color]: [boolean, boolean];
  } = {
    white: [true, true],
    black: [true, true],
  };

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
   * @param moves An array of strings representing the moves in algebraic notation.
   */
  public setMoves(moves: string[]): void {
    // TODO validate the moves (possibly add a strict argument which validates if every move was actually a valid move)
  }

  // =============== Getters ===============
  /**
   * Returns the color to move
   */
  public colorToMove(): Color {
    return this.moves.length === 0
      ? "white"
      : this.moves.length % 2 === 0
        ? "black"
        : "white";
  }

  /**
   * Returns the current FEN position
   */
  public fen() {
    return this.currentFen;
  }

  /**
   * Returns the moves played in algebraic notation
   */
  public history() {
    return this.moves;
  }

  // =============== Methods ===============
  /**
   * Executes a move and updates the game state
   * @param move A Move object
   */
  public execute(move: Move) {
    // TODO validate the move object before executing it
    // TODO execute the move and update the FEN
    // TODO update the moves
  }

  /**
   *
   * @returns All the valid moves for the current position and state of the game in algebraic notation
   */
  public validMoves(): string[] {
    return [];
  }
}

export default Chess;
