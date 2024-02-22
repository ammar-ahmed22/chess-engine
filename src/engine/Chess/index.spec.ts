import Chess from ".";
import { MoveType } from "../../types";

describe("Chess", () => {
  it("executes moves correctly", () => {
    const chess = new Chess();
    const m1 = chess.execute({
      from: "e2",
      to: "e4",
    });
    let history = chess.history();
    expect(m1).not.toBeNull();
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    expect(chess.colorToMove()).toBe("black");
    expect(history).toHaveLength(1);
    expect(history[0].white).toBeDefined();
    expect(history[0].black).not.toBeDefined();
    
    const m2 = chess.execute({
      from: "e7",
      to: "e5"
    })
    
    history = chess.history();
    expect(m2).toBeDefined();
    expect(chess.fen()).toBe("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    expect(chess.colorToMove()).toBe("white");
    expect(history).toHaveLength(1);
    expect(history[0].white).toBeDefined();
    expect(history[0].black).toBeDefined();

    const m3 = chess.execute({
      from: "g1",
      to: "f3"
    })

    history = chess.history();
    expect(m3).toBeDefined();
    expect(chess.fen()).toBe("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    expect(chess.colorToMove()).toBe("black");
    expect(history).toHaveLength(2);
    expect(history[1].white).toBeDefined();
    expect(history[1].black).not.toBeDefined();
  });

  it("returns null when executing an incorrect move", () => {
    const chess = new Chess();
    const result = chess.execute({
      from: "e4",
      to: "e2"
    })
  
    expect(result).toBeNull();
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    expect(chess.history()).toHaveLength(0);
  })

  it("returns null when executing a move on the wrong turn", () => {
    // moving black piece on white's turn
    const chess = new Chess();
    const result = chess.execute({
      from: "e7",
      to: "e5"
    })

    expect(result).toBeNull();
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    expect(chess.history()).toHaveLength(0);

  })

  it("creates all valid moves correctly", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "d7",
      to: "d5"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    
    expect(moves).toHaveLength(31);
  })

  it("calculates checks correctly", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "d7",
      to: "d5"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    
    expect(moves).toHaveLength(31);

    result = chess.execute({
      from: "f1",
      to: "b5"
    });
    expect(result).not.toBeNull();
    if (result) {
      expect(result.check).toBe("black");
      expect(chess.state().inCheck).toBe(true);
    }

    moves = chess.validMoves();
    // only 5 valid moves that remove check
    expect(moves).toHaveLength(5);
  })

  it("does not allow you to put your own king in check", () => {
    const chess = new Chess();
    let moves = chess.validMoves();
    expect(moves).toHaveLength(20);
    let result = chess.execute({
      from: "e2",
      to: "e4"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(20);

    result = chess.execute({
      from: "f7",
      to: "f5"
    });
    expect(result).not.toBeNull();
    moves = chess.validMoves();
    expect(moves).toHaveLength(31);

    result = chess.execute({
      from: "f1",
      to: "b5"
    });
    expect(result).not.toBeNull();
    
    result = chess.execute({
      from: "d7",
      to: "d5"
    })

    expect(result).toBeNull();
  })

  it("executes kingside castling correctly", () => {
    const chess = new Chess();
    // white can castle kingside
    chess.setPosition("rnbqkbnr/pppppppp/8/8/4PP2/3B1N2/PPPP2PP/RNBQK2R");
    const result = chess.execute({
      from: "e1",
      to: "g1",
      castle: "king"
    })
    
    expect(result).not.toBeNull();
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/4PP2/3B1N2/PPPP2PP/RNBQ1RK1")
  })

  it("executes queenside castling correctly", () => {
    const chess = new Chess();
    // white can castle queenside
    chess.setPosition("rnbqkbnr/pppppppp/8/8/5B2/2NP4/PPPQPPPP/R3KBNR")
    const result = chess.execute({
      from: "e1",
      to: "c1",
      castle: "queen"
    })

    expect(result).not.toBeNull();
    expect(chess.fen()).toBe("rnbqkbnr/pppppppp/8/8/5B2/2NP4/PPPQPPPP/2KR1BNR")
  })

  it("calculates castling ability correctly", () => {
    const chess = new Chess();
    // white kings pawn move
    chess.execute({
      from: "e2",
      to: "e4"
    })
    // black kings pawn move
    chess.execute({
      from: "e7",
      to: "e5"
    })
    // move white king
    chess.execute({
      from: "e1",
      to: "e2"
    })

    let state = chess.state();
    let expected = {
      white: {
        queen: false,
        king: false,
      },
      black: {
        queen: true,
        king: true
      }
    }
    expect(state.castling).toMatchObject(expected);

    // move black knight (to make space for the king side rook)
    chess.execute({
      from: "g8",
      to: "f6"
    })

    // move white king again (need to make white move)
    chess.execute({
      from: "e2",
      to: "e3"
    })

    // move black kingside rook
    chess.execute({
      from: "h8",
      to: "g8"
    })

    state = chess.state();
    expected = {
      white: {
        queen: false,
        king: false,
      },
      black: {
        queen: true,
        king: false
      }
    }

    expect(state.castling).toMatchObject(expected)
  })

  it("validates moves when executing correctly", () => {
    let chess = new Chess();
    // This is an invalid move, bishop is blocked by the pawns
    // It should be allowed by the engine because it only validates that the piece exists and that is the right color to move.
    let result = chess.execute({
      from: "f1",
      to: "c4"
    });

    expect(result).not.toBeNull();

    chess = new Chess();
    result = chess.execute({
      from: "f1",
      to: "c4"
    }, { validate: true })
    
    expect(result).toBeNull()
  })

  it("finds checkmate correctly", () => {
    // Play scholars mate
    let chess = new Chess();
    let moves: MoveType[] = [
      // white kings pawn
      {
        from: "e2",
        to: "e4"
      },
      // black kings pawn
      {
        from: "e7",
        to: "e5"
      },
      // white bishop to c4
      {
        from: "f1",
        to: "c4"
      },
      // black knight to c6
      {
        from: "b8",
        to: "c6"
      },
      // white queen to h5
      {
        from: "d1",
        to: "h5"
      },
      // black knight to f6
      {
        from: "g8",
        to: "f6"
      },
      // white queen to f7, checkmate
      {
        from: "h5",
        to: "f7"
      }
    ]
    for (let move of moves) {
      let result = chess.execute(move);
      expect(result).not.toBeNull();
    }
    expect(chess.state().inCheck).toBe(true);
    expect(chess.checkmate()).toBe(true);
  })
});
