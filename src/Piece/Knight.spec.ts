import { Chess } from "../Chess";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import Knight from "./Knight";

describe("Knight", () => {
  it("creates valid moves correctly", () => {
    const chess = new Chess();
    // knight on e5, can take 2 pawns, 8 valid moves
    const fen = "rnbqkbnr/pppppppp/8/4N3/8/8/PPPPPPPP/RNBQKB1R";
    const board = new GameBoard(fen);
    const pos = new SquareID("e5");
    const knight = board.atID(pos) as Knight;
    expect(knight.type).toBe("knight");
    const moves = knight.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }
    expect(takes).toBe(2);
    expect(moves).toHaveLength(8);
  });

  it("does not calculate moves that put king in check", () => {
    const chess = new Chess();
    // pinned knight, no valid moves
    const fen = "rnbqk1nr/p1pp1ppp/1p6/8/1b2P3/2Np4/PPP2PPP/RNBQKB1R"
    const board = new GameBoard(fen);
    const c3 = new SquareID("c3");
    const knight = board.atID(c3) as Knight;
    expect(knight.type).toBe("knight");
    const moves = knight.validMoves(board, chess.state());
    expect(moves).toHaveLength(0);
  })
});
