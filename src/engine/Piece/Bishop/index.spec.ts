import Chess from "../../Chess";
import GameBoard from "../../GameBoard";
import Bishop from ".";
import SquareID from "../../SquareID";

describe("Bishop", () => {
  it("generates valid moves correctly", () => {
    const chess = new Chess();
    // bishop on c4, can take pawn on b5, can take pawn on f7, 8 valid moves
    const fen = "rnbqkbnr/p1pppppp/8/1p6/2B1P3/8/PPPP1PPP/RNBQK1NR"
    const board = new GameBoard(fen);
    const pos = new SquareID("c4");
    const bishop = board.atID(pos) as Bishop;
    expect(bishop.type).toBe("bishop");
    const moves = bishop.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }

    expect(takes).toBe(2);
    expect(moves).toHaveLength(8);
  })
})