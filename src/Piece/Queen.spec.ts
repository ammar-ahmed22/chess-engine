import { Chess } from "../Chess";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import Queen from "./Queen";

describe("Queen", () => {
  it("creates valid moves correctly", () => {
    const chess = new Chess();
    // queen on f4, can take knight on e5, can take pawn on f7, 11 valid moves
    const fen = "r1bqkbnr/pppppppp/8/4n3/4PQ2/8/PPPP1PPP/RNB1KBNR";
    const board = new GameBoard(fen);
    const pos = new SquareID("f4");
    const queen = board.atID(pos) as Queen;
    expect(queen.type).toBe("queen");
    const moves = queen.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }
    expect(takes).toBe(2);
    expect(moves).toHaveLength(11);
  });

  it("does not calculate moves that put king in check", () => {
    const chess = new Chess();
    // queen on e2 is pinned, only move vertically and take the pinning piece.
    const fen = "rnb1kb1r/pppp1ppp/8/8/3pq3/5N2/PPP1Q1PP/RNB1KB1R";
    const board = new GameBoard(fen);
    const e2 = new SquareID("e2");
    const queen = board.atID(e2) as Queen;
    expect(queen.type).toBe("queen"); 
    expect(queen.validMoves(board, chess.state())).toHaveLength(2);
  })
});
