import Knight from "./knight";
import { parseFEN } from "../fen";
import { SquareID } from "../squareID";
import Move from "../move";

describe("Knight", () => {
  // Knight on c3, black pawn on d5
  const knightC3 =
    "rnbqkbnr/ppp1pppp/8/3p4/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1";
  const state = parseFEN(knightC3);
  it("should generate valid moves correctly", () => {
    const c3Knight = state.gameBoard.get.atID(
      new SquareID("c", 3),
    ) as Knight;
    expect(c3Knight).toBeDefined();
    expect(c3Knight.type).toBe("knight");
    expect(c3Knight.color).toBe("white");
    expect(c3Knight.position.toString()).toBe("c3");
    const moves = c3Knight.validMoves(state);
    expect(moves.length).toBe(5);
    let take: Move | undefined = undefined;
    for (let move of moves) {
      if (move.take) take = move;
    }
    expect(take).toBeDefined();
    expect(take?.to.toString()).toBe("d5");
  });

  const starting =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const startingState = parseFEN(starting);
  it("should generate moves correctly for the starting state", () => {
    const b1Knight = startingState.gameBoard.get.atID(
      new SquareID("b", 1),
    ) as Knight;
    expect(b1Knight).toBeDefined();
    expect(b1Knight.type).toBe("knight");
    expect(b1Knight.color).toBe("white");
    expect(b1Knight.position.toString()).toBe("b1");
    const moves = b1Knight.validMoves(startingState);
    expect(moves.length).toBe(2);
  });
});
