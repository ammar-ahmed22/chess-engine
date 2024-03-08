import Pawn from "./Pawn";
import { GameBoard } from "../GameBoard";
import { Chess, MoveType } from "../Chess";
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
  });

  it("generates valid move for piece promotion correctly", () => {
    const chess = new Chess();
    // pawn on g7 can promote on square above, and take bishop and knight to promote as well, in total 3 * 4 valid moves
    const fen = "rnbqkb1r/ppppn1P1/5p2/4p2p/8/8/PPPPP1PP/RNBQKBNR";
    const g7 = new SquareID("g7");
    const board = new GameBoard(fen);
    const pawn = board.atID(g7) as Pawn;
    expect(pawn.type).toBe("pawn");
    const moves = pawn.validMoves(board, chess.state());
    for (let move of moves) {
      expect(move.promotion).toBeDefined();
    }
    expect(moves).toHaveLength(12);
  });

  it("does not allow for taking the king", () => {
    const chess = new Chess();
    // white pawn on e7 in front of king.
    const fen = "rnbqkbnr/ppppPppp/8/8/8/8/PPPPP1PP/RNBQKBNR";
    const e7 = new SquareID("e7");
    const board = new GameBoard(fen);
    const pawn = board.atID(e7) as Pawn;
    expect(pawn.type).toBe("pawn");
    const moves = pawn.validMoves(board, chess.state());
    // promotion moves come as 4 moves (2 * 4 = 8)
    expect(moves).toHaveLength(8);
  });

  it("generates en passant moves correctly", () => {
    const chess = new Chess();
    const moves: MoveType[] = [
      { from: "c2", to: "c4" },
      { from: "b8", to: "c6" },
      { from: "c4", to: "c5" },
      { from: "b7", to: "b5" },
    ];
    for (let move of moves) {
      expect(chess.execute(move)).not.toBeNull();
    }
    expect(chess.state().enPassant).toBeDefined();
    expect(chess.state().enPassant?.algebraic).toBe("b6");
    const validMoves = chess.validMoves();
    const c5PawnMoves = validMoves.filter((move) => {
      return move.from === "c5";
    });
    expect(c5PawnMoves).toHaveLength(1);
    expect(c5PawnMoves[0].enPassant).toBeDefined();
    expect(c5PawnMoves[0].to).toBe("b6");
  });

  it("does not calculate moves that put king in check", () => {
    const chess = new Chess();
    const fen = "rnbqk1nr/pppp1ppp/8/8/3NP3/6b1/PPP2PPP/RNBQKB1R";
    const board = new GameBoard(fen);
    const f2 = new SquareID("f2");
    const f2Pawn = board.atID(f2) as Pawn;
    expect(f2Pawn.type).toBe("pawn");
    expect(f2Pawn.validMoves(board, chess.state())).toHaveLength(1);
  });
});
