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
});
