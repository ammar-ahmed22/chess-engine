import Chess from ".";

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
    expect(moves).toHaveLength(30);
  })
});
