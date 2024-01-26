import { parseFEN } from "../fen";
import Bishop from "./bishop";
import { SquareID } from "../squareID";

describe("Bishop", () => {
  // This fen has the bishop in a position where it can take pieces as well as puts the king in check
  // It has 7 valid moves for the bishop
  // TODO: When checks are implemented change the check test to a separate test case
  const fen =
    "rnbqkbnr/1pp1pppp/8/1B1p4/p7/4P3/PPPP1PPP/RNBQK1NR w KQkq - 0 1";
  const state = parseFEN(fen);
  it("creates valid moves correctly", () => {
    const b5 = new SquareID("b", 5);
    const bishop = state.gameBoard.get.atID(b5) as Bishop;
    expect(bishop).toBeDefined();
    expect(bishop.color).toBe("white");
    expect(bishop.type).toBe("bishop");
    const moves = bishop.validMoves(state);
    expect(moves.length).toBe(8);
    let takeMoveIdx: number = -1;
    moves.forEach((m, i) => {
      if (m.take) takeMoveIdx = i;
    });
    expect(moves[takeMoveIdx]).toBeDefined();
    expect(moves[takeMoveIdx].take).toBeDefined();
    expect(moves[takeMoveIdx].take?.color).toBe("black");
    expect(moves[takeMoveIdx].take?.type).toBe("pawn");
  });
});
