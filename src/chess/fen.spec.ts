import { parseFEN } from "./fen";

describe("parseFEN", () => {
  const starting =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  it("should call parseFEN without errors", () => {
    expect(() => parseFEN(starting)).not.toThrow();
  });

  const startingState = parseFEN(starting);

  it("should throw errors for invalid inputs", () => {
    const invalidFENs = [
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/ w KQkq - 0 1", // missing one row
      "ammar", // completely invalid
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1", // missing color to move
      "rnbqkbnz/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // incorrect letter
      "rnbqkbnr/pppppppp/8/8/10/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // incorrect number of empty spaces
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/ RNBQKBNR w KQkq - 0 1", // extra space added
      "rnbqkbnr,pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // invalid separator,
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR W KQkq - 0 1", // color to move is capital
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR a KQkq - 0 1", // color to move is incorrect
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqk - 0 1", // castling is too long
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQka - 0 1", // castling contains incorrect character
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1", // half move count is not number
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 a", // full move count is not number
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0", // full move count is less than 1
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a 0 1", // en passant incorrect
    ];

    for (const fen of invalidFENs) {
      expect(() => parseFEN(fen)).toThrow(Error);
    }
  });

  it("should create the game board correctly", () => {
    const { gameBoard } = startingState;

    const expectedBoardTypes = [
      [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "bishop",
        "knight",
        "rook",
      ],
      new Array(8).fill("pawn"),
      new Array(8).fill(undefined),
      new Array(8).fill(undefined),
      new Array(8).fill(undefined),
      new Array(8).fill(undefined),
      new Array(8).fill("pawn"),
      [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "bishop",
        "knight",
        "rook",
      ],
    ];

    expect(gameBoard.matrix.length).toBe(8);
    expect(gameBoard.matrix[0].length).toBe(8);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const expectedType = expectedBoardTypes[i][j];
        expect(gameBoard.matrix[i][j]?.type).toEqual(
          expectedType,
        );
        if (i < 2) {
          expect(gameBoard.matrix[i][j]?.color).toEqual(
            "black",
          );
        }
        if (i > 6) {
          expect(gameBoard.matrix[i][j]?.color).toEqual(
            "white",
          );
        }
      }
    }
  });

  it("should have the correct color to move", () => {
    const { whiteToMove } = startingState;
    expect(whiteToMove).toBe(true);
  });

  it("should parse castling correctly", () => {
    const { castling } = startingState;
    const expected = {
      black: [true, true],
      white: [true, true],
    };
    expect(castling).toEqual(expected);
    const threeCastle =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Qkq - 0 1";
    const threeCastleState = parseFEN(threeCastle);
    expect(threeCastleState.castling).toEqual({
      white: [false, true],
      black: [true, true],
    });
    const noCastle =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
    const noCastleState = parseFEN(noCastle);
    expect(noCastleState.castling).toEqual({
      white: [false, false],
      black: [false, false],
    });
  });
});
