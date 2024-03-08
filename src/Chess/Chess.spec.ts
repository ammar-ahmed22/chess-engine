import { Chess } from ".";
import type { HalfMove, MoveType } from ".";

describe("Chess", () => {
  it("executes moves correctly", () => {
    const chess = new Chess();
    const m1 = chess.execute({
      from: "e2",
      to: "e4",
    });
    let history = chess.history();
    expect(m1).not.toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR",
    );
    expect(chess.colorToMove()).toBe("black");
    expect(history).toHaveLength(1);
    expect(history[0].moves.white).toBeDefined();
    expect(history[0].moves.black).not.toBeDefined();

    const m2 = chess.execute({
      from: "e7",
      to: "e5",
    });

    history = chess.history();
    expect(m2).toBeDefined();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR",
    );
    expect(chess.colorToMove()).toBe("white");
    expect(history).toHaveLength(1);
    expect(history[0].moves.white).toBeDefined();
    expect(history[0].moves.black).toBeDefined();

    const m3 = chess.execute({
      from: "g1",
      to: "f3",
    });

    history = chess.history();
    expect(m3).toBeDefined();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R",
    );
    expect(chess.colorToMove()).toBe("black");
    expect(history).toHaveLength(2);
    expect(history[1].moves.white).toBeDefined();
    expect(history[1].moves.black).not.toBeDefined();
  });

  it("returns null when executing an incorrect move", () => {
    const chess = new Chess();
    const result = chess.execute({
      from: "e4",
      to: "e2",
    });

    expect(result).toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    );
    expect(chess.history()).toHaveLength(0);
  });

  it("returns null when executing a move on the wrong turn", () => {
    // moving black piece on white's turn
    const chess = new Chess();
    const result = chess.execute({
      from: "e7",
      to: "e5",
    });

    expect(result).toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    );
    expect(chess.history()).toHaveLength(0);
  });

  it("creates all valid moves correctly", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "d7",
      to: "d5",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();

    expect(moves).toHaveLength(31);
  });

  it("calculates checks correctly", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "d7",
      to: "d5",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();

    expect(moves).toHaveLength(31);

    result = chess.execute({
      from: "f1",
      to: "b5",
    });
    expect(result).not.toBeNull();
    if (result) {
      expect(result.check).toBe("black");
      expect(chess.state().inCheck).toBe(true);
    }

    moves = chess.validMoves();
    // only 5 valid moves that remove check
    expect(moves).toHaveLength(5);
  });

  it("does not allow you to put your own king in check", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "f7",
      to: "f5",
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(31);

    result = chess.execute({
      from: "f1",
      to: "b5",
    });
    expect(result).not.toBeNull();

    result = chess.execute({
      from: "d7",
      to: "d5",
    });

    expect(result).toBeNull();
  });

  it("executes kingside castling correctly", () => {
    const chess = new Chess();
    // white can castle kingside
    chess.setPosition(
      "rnbqkbnr/pppppppp/8/8/4PP2/3B1N2/PPPP2PP/RNBQK2R",
    );
    const result = chess.execute({
      from: "e1",
      to: "g1",
      castle: "king",
    });

    expect(result).not.toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppppppp/8/8/4PP2/3B1N2/PPPP2PP/RNBQ1RK1",
    );
  });

  it("executes queenside castling correctly", () => {
    const chess = new Chess();
    // white can castle queenside
    chess.setPosition(
      "rnbqkbnr/pppppppp/8/8/5B2/2NP4/PPPQPPPP/R3KBNR",
    );
    const result = chess.execute({
      from: "e1",
      to: "c1",
      castle: "queen",
    });

    expect(result).not.toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbnr/pppppppp/8/8/5B2/2NP4/PPPQPPPP/2KR1BNR",
    );
  });

  it("calculates castling ability correctly", () => {
    const chess = new Chess();
    // white kings pawn move
    chess.execute({
      from: "e2",
      to: "e4",
    });
    // black kings pawn move
    chess.execute({
      from: "e7",
      to: "e5",
    });
    // move white king
    chess.execute({
      from: "e1",
      to: "e2",
    });

    let state = chess.state();
    let expected = {
      white: {
        queen: false,
        king: false,
      },
      black: {
        queen: true,
        king: true,
      },
    };
    expect(state.castling).toMatchObject(expected);

    // move black knight (to make space for the king side rook)
    chess.execute({
      from: "g8",
      to: "f6",
    });

    // move white king again (need to make white move)
    chess.execute({
      from: "e2",
      to: "e3",
    });

    // move black kingside rook
    chess.execute({
      from: "h8",
      to: "g8",
    });

    state = chess.state();
    expected = {
      white: {
        queen: false,
        king: false,
      },
      black: {
        queen: true,
        king: false,
      },
    };

    expect(state.castling).toMatchObject(expected);
  });

  it("validates moves when executing correctly", () => {
    let chess = new Chess();
    // This is an invalid move, bishop is blocked by the pawns
    // It should be allowed by the engine because it only validates that the piece exists and that is the right color to move.
    let result = chess.execute({
      from: "f1",
      to: "c4",
    });

    expect(result).not.toBeNull();

    chess = new Chess();
    result = chess.execute(
      {
        from: "f1",
        to: "c4",
      },
      { validate: true },
    );

    expect(result).toBeNull();
  });

  it("finds checkmate correctly", () => {
    // Play scholars mate
    let chess = new Chess();
    let moves: MoveType[] = [
      // white kings pawn
      {
        from: "e2",
        to: "e4",
      },
      // black kings pawn
      {
        from: "e7",
        to: "e5",
      },
      // white bishop to c4
      {
        from: "f1",
        to: "c4",
      },
      // black knight to c6
      {
        from: "b8",
        to: "c6",
      },
      // white queen to h5
      {
        from: "d1",
        to: "h5",
      },
      // black knight to f6
      {
        from: "g8",
        to: "f6",
      },
      // white queen to f7, checkmate
      {
        from: "h5",
        to: "f7",
      },
    ];
    for (let move of moves) {
      let result = chess.execute(move);
      expect(result).not.toBeNull();
    }
    expect(chess.state().inCheck).toBe(true);
    expect(chess.checkmate()).toBe(true);
    expect(chess.status()).toBe("checkmate");
  });

  it("executes piece promotion correctly", () => {
    const chess = new Chess();
    // pawn on g7 can promote
    chess.setPosition(
      "rnbqkb1r/ppppn1P1/5p2/4p2p/8/8/PPPPP1PP/RNBQKBNR",
    );
    const moves = chess.validMoves();
    let promotionMove;
    for (let move of moves) {
      if (
        move.from === "g7" &&
        move.to === "g8" &&
        move.promotion === "queen"
      ) {
        promotionMove = move;
      }
    }
    expect(promotionMove).toBeDefined();
    const result = chess.execute(promotionMove as HalfMove);
    expect(result).not.toBeNull();
    expect(chess.fen()).toBe(
      "rnbqkbQr/ppppn3/5p2/4p2p/8/8/PPPPP1PP/RNBQKBNR",
    );
  });

  it("calculates en passant target square correctly", () => {
    const chess = new Chess();
    chess.execute({ from: "e2", to: "e4" });
    const state = chess.state();
    expect(state.enPassant).toBeDefined();
    expect(state.enPassant?.algebraic).toBe("e3");
  });

  it("calculates and executes en passant correctly", () => {
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
    const enPassantMove = c5PawnMoves[0];
    expect(chess.execute(enPassantMove)).not.toBeNull();
    expect(chess.fen()).toBe(
      "r1bqkbnr/p1pppppp/1Pn5/8/8/8/PP1PPPPP/RNBQKBNR",
    );
  });

  it("finds stalemate correctly", () => {
    const chess = new Chess();
    // dummy move to make it black's turn
    chess.execute({ from: "e2", to: "e4" });
    // stale mate position, king is trapped by other king
    chess.setPosition("k7/P7/K7/8/5B2/8/8/8");
    expect(chess.stalemate()).toBe(true);
    expect(chess.status()).toBe("stalemate");
  });

  it("does not provide moves that put king in check", () => {
    const chess = new Chess();
    const moves: MoveType[] = [
      { from: "e2", to: "e4" },
      { from: "e7", to: "e5" },
      { from: "d2", to: "d4" },
      { from: "e5", to: "d4" },
      { from: "d1", to: "d4" },
      { from: "f8", to: "d6" },
      { from: "d4", to: "d1" },
      { from: "d6", to: "g3" },
    ];
    for (let move of moves) {
      chess.execute(move);
    }
    const validMoves = chess.validMoves();
    let f2Pawn = validMoves.filter((move) => move.from === "f2");
    // Only move should be taking the bishop as other moves put king in check.
    expect(f2Pawn).toHaveLength(1);
  });

  it("finds draw by insufficient material correctly", () => {
    const positions = [
      // two kings only
      "2k5/8/8/1K6/8/8/8/8",
      // king and bishop vs king
      "2k2b2/8/8/1K6/8/8/8/8",
      // king and knight vs king,
      "3k4/8/8/8/2K5/4N3/8/8",
      // king and bishop vs king and bishop. Both bishops on same color square.
      "8/3k4/1b6/8/8/2K3B1/8/8",
    ];
    const chess = new Chess();
    for (let pos of positions) {
      chess.setPosition(pos);
      expect(chess.insufficient()).toBe(true);
      expect(chess.status()).toBe("insufficient");
    }
  });

  it("finds draw by repetition correctly", () => {
    const chess = new Chess();
    const moves: MoveType[] = [
      { from: "g1", to: "f3" },
      { from: "g8", to: "f6" },
      { from: "f3", to: "g1" },
      { from: "f6", to: "g8" },
    ];

    for (let i = 0; i < 3; i++) {
      for (let move of moves) {
        if (i !== 2 && move.from !== "f6") {
          expect(chess.repetition()).toBe(false);
          expect(chess.status()).toBe("in-progress");
        }
        chess.execute(move);
      }
    }
    expect(chess.repetition()).toBe(true);
    expect(chess.status()).toBe("repetition");
  });

  it("finds draw by 50move rule correctly", () => {
    const chess = new Chess();
    const developingMoves: MoveType[] = [
      { from: "e2", to: "e4" },
      { from: "e7", to: "e5" },
      { from: "g1", to: "f3" },
      { from: "g8", to: "f6" },
      { from: "d2", to: "d4" },
      { from: "e5", to: "d4" },
      { from: "d1", to: "d4" },
      { from: "f8", to: "c5" },
      { from: "f1", to: "d3" },
      { from: "e8", to: "g8", castle: "king" },
      { from: "e1", to: "g1", castle: "king" },
      { from: "d7", to: "d5" },
    ];

    for (let move of developingMoves) {
      chess.execute(move);
    }

    for (let i = 0; i < 100; i++) {
      const moves = chess.validMoves().filter((move) => {
        if (move.piece === "pawn" || move.take) return false;
        return true;
      });
      expect(moves.length).toBeGreaterThan(0);
      if (moves.length > 0) {
        const percentage = i / 99;
        chess.execute(
          moves[Math.floor(percentage * (moves.length - 1))],
        );
      }
    }
    expect(chess.fiftymove()).toBe(true);
    expect(chess.status()).toBe("50move");
  });
});
