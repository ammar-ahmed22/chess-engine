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
      if (move.take) takes++
    }
    expect(takes).toBe(2);
    expect(moves).toHaveLength(11);
  })
})