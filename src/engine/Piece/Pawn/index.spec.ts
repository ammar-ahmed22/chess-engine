import Pawn from ".";
import GameBoard from "../../GameBoard";
import Chess from "../../Chess";
import SquareID from "../../SquareID";

describe("Pawn", () => {
  it("generates valid moves correctly", () => {
    const chess = new Chess();
    // 2 black pawns can be taken by the white e2 pawn, white e2 pawn can also move both 2 moves forward
    const fen = "rnbqkbnr/ppp1p1pp/8/8/8/3p1p2/PPPPPPPP/RNBQKBNR";
    const pawn = new Pawn("white", new SquareID("e2"));
    const board = new GameBoard(fen);
    const moves = pawn.validMoves(board, chess.state());
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }

    expect(moves).toHaveLength(4);
    expect(takes).toBe(2);
  })
})