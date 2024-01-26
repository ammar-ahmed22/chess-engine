import { parseFEN } from "../fen";
import { SquareID } from "../squareID";
import Queen from "./queen";

describe("Queen", () => {
  // Queen on a4, putting king in check, can take knight on b4, 12 valid moves
  const fen =
    "2bqkbnr/1pp1pppp/8/3p4/Qn1P4/2P5/PP2PPPP/RNB1KBNR w KQkq - 0 1";
  const state = parseFEN(fen);
  it("creates valid moves correctly", () => {
    const a4 = new SquareID("a", 4);
    const queen = state.gameBoard.get.atID(a4) as Queen;
    expect(queen).toBeDefined();
    expect(queen.color).toBe("white");
    expect(queen.type).toBe("queen");
    const moves = queen.validMoves(state);
    expect(moves.length).toBe(12);
    let tIdx = -1;
    moves.forEach((m, i) => {
      if (m.take) tIdx = i;
    });
    expect(tIdx).not.toBe(-1);
    expect(moves[tIdx].take).toBeDefined();
    expect(moves[tIdx].to.toString()).toBe("b4");
    expect(moves[tIdx].take?.type).toBe("knight");
    expect(moves[tIdx].take?.color).toBe("black");
  });
});
