import { parseFEN } from "../fen";
import Rook from "./rook";
import { SquareID } from "../squareID";

describe("Rook", () => {
  // Rook on e5, king in check, can take bishop on d5, 6 valid moves
  const fen =
    "rnbqk1nr/1pp2ppp/8/p2bR3/5p2/8/1PPPPPPP/1NBQKB1R w KQkq - 0 1";
  const state = parseFEN(fen);
  it("creates valid moves correctly", () => {
    const e5 = new SquareID("e", 5);
    const rook = state.gameBoard.get.atID(e5) as Rook;
    expect(rook).toBeDefined();
    expect(rook.color).toBe("white");
    expect(rook.type).toBe("rook");
    const moves = rook.validMoves(state);
    expect(moves.length).toBe(8);
    let tIdx = -1;
    moves.forEach((m, i) => {
      if (m.take) tIdx = i;
    });
    expect(tIdx).not.toBe(-1);
    expect(moves[tIdx].take).toBeDefined();
    expect(moves[tIdx].take?.type).toBe("bishop");
    expect(moves[tIdx].take?.color).toBe("black");
  });
});
