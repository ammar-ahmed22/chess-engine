import { Chess } from "../Chess";
import { GameBoard } from "../GameBoard";
import { SquareID } from "../SquareID";
import King from "./King";

describe("King", () => {
  it("creates valid moves correctly", () => {
    const chess = new Chess();
    // king on d4, can take pawn, 7 valid moves
    const fen = "rnbqkbnr/pp1ppppp/8/2p5/3K4/4P3/PPPP1PPP/RNBQ1BNR"
    const board = new GameBoard(fen);
    const pos = new SquareID("d4");
    const king = board.atID(pos) as King;
    expect(king.type).toBe("king");
    const moves = king.validMoves(board, chess.state());
    expect(moves).toHaveLength(7);
    let takes = 0;
    for (let move of moves) {
      if (move.take) takes++;
    }
    expect(takes).toBe(1);
  })

  it("creates castle moves correctly", () => {
    const chess = new Chess();
    // white king can castle queenside, but not kingside because there is bishop in the way
    const fen = "rn1qkbnr/ppp2ppp/4p3/3p4/3P1B2/2NbPN2/PPPQ1PPP/R3K2R";
    const board = new GameBoard(fen);
    const pos = new SquareID("e1");
    const king = board.atID(pos) as King;
    expect(king.type).toBe("king");
    const moves = king.validMoves(board, chess.state());
    let castle = 0;
    for (let move of moves) {
      if (move.castle) {
        castle++;
      }
    }
    expect(castle).toBe(1);
  })
})