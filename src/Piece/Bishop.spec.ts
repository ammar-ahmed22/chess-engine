import { Chess } from "../Chess";
import { GameBoard } from "../GameBoard";
import Bishop from "./Bishop";
import { SquareID } from "../SquareID";

describe("Bishop", () => {
  it("generates valid moves correctly", () => {
    const chess = new Chess();
    // bishop on c4, can take pawn on f7, 9 valid moves
    const fen = "rnbqkbnr/pppppppp/8/8/2B1P3/8/PPPP1PPP/RNBQK1NR";
    const board = new GameBoard(fen);
    const pos = new SquareID("c4");
    const bishop = board.atID(pos) as Bishop;
    expect(bishop.type).toBe("bishop");
    const moves = bishop.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }

    expect(takes).toBe(1);
    expect(moves).toHaveLength(9);
  });

  it("does not calculate moves that put king in check", () => {
    const chess = new Chess();
    // bishop on e2 is pinned, no valid moves
    const fen = "rnb1kbnr/pppp1ppp/8/8/3Qq3/8/PPP1BPPP/RNB1K1NR"
    const board = new GameBoard(fen);
    const e2 = new SquareID("e2")
    const bishop = board.atID(e2) as Bishop;
    expect(bishop.type).toBe("bishop");
    const moves = bishop.validMoves(board, chess.state());
    expect(moves).toHaveLength(0);
  })
});
