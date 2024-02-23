import Pawn from "./Pawn";
import { GameBoard } from "../GameBoard";
import { Chess } from "../Chess";
import { SquareID } from "../SquareID";

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

  it("generates valid move for piece promotion correctly", () => {
    const chess = new Chess();
    // pawn on g7 can promote on square above, and take bishop and knight to promote as well, in total 3 * 4 valid moves
    const fen = "rnbqkb1r/ppppn1P1/5p2/4p2p/8/8/PPPPP1PP/RNBQKBNR"
    const g7 = new SquareID("g7");
    const board = new GameBoard(fen);
    const pawn = board.atID(g7) as Pawn;
    expect(pawn.type).toBe("pawn");
    const moves = pawn.validMoves(board, chess.state());
    for (let move of moves) {
      expect(move.promotion).toBeDefined();
    }
    expect(moves).toHaveLength(12);
  })
})