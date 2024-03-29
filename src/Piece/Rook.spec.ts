import { Chess } from "../Chess";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import Rook from "./Rook";

describe("Rook", () => {
  it("creates valid moves correctly", () => {
    const chess = new Chess();
    // rook on e5, can take knight on h5, can take pawn on e7, 11 valid moves
    const fen = "rnbqkb1r/pppppppp/8/4R2n/7P/8/PPPPPPP1/RNBQKBN1";
    const board = new GameBoard(fen);
    const pos = new SquareID("e5");
    const rook = board.atID(pos) as Rook;
    expect(rook.type).toBe("rook");
    const moves = rook.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }
    expect(takes).toBe(2);
    expect(moves).toHaveLength(11);
  });

  it("does not calculate moves that put king in check", () => {
    const chess = new Chess();
    // rook on e5 is pinned, can only move vertically
    const fen = "r1b1kbnr/ppp1qppp/8/n3R3/P7/8/1PPP1PPP/1NBQKBNR";
    const board = new GameBoard(fen);
    const e5 = new SquareID("e5");
    const rook = board.atID(e5) as Rook;
    expect(rook.type).toBe("rook");
    expect(rook.validMoves(board, chess.state())).toHaveLength(5);
  });
});
