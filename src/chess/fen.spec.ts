import { parseFEN, createFEN } from "./fen";

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
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR Wass KQkq - 0 1", // color to move is too long
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR a KQkq - 0 1", // color to move is incorrect
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqk - 0 1", // castling is too long
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQka - 0 1", // castling contains incorrect character
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1", // half move count is not number
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - -1 1", // half move count is less than 0
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 a", // full move count is not number
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0", // full move count is less than 1
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a 0 1", // en passant is single char
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq aa 0 1", // en passant rank is not number
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a9 0 1", // en passant rank too large
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq z1 0 1", // en passant file incorrect
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
    const files = "abcdefgh";
    const ranks = "87654321";
    const expectedPositions = [];
    for (let i = 0; i < ranks.length; i++) {
      let temp = [];
      for (let j = 0; j < files.length; j++) {
        const id = `${files[j]}${ranks[i]}`;
        temp.push(id);
      }
      expectedPositions.push(temp);
    }

    expect(gameBoard.matrix.length).toBe(8);
    expect(gameBoard.matrix[0].length).toBe(8);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const expectedType = expectedBoardTypes[i][j];
        expect(gameBoard.matrix[i][j]?.type).toEqual(
          expectedType,
        );

        if (gameBoard.matrix[i][j]) {
          expect(
            gameBoard.matrix[i][j]?.position.toString(),
          ).toEqual(expectedPositions[i][j]);
        }
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

  it("should parse enPassant correctly", () => {
    const { enPassant } = startingState;
    expect(enPassant).not.toBeDefined();
    const a5 =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a5 0 1";
    const a5State = parseFEN(a5);
    expect(a5State.enPassant).toBeDefined();
    expect(a5State.enPassant?.file).toEqual(1);
    expect(a5State.enPassant?.rank).toEqual(5);
  });

  it("should parse full and half moves correctly", () => {
    const { fullMoveCount, halfMoveCount } = startingState;
    expect(fullMoveCount).toEqual(1);
    expect(halfMoveCount).toEqual(0);
  });
});

describe("createFEN", () => {
  const testCases = [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b - e2 0 1"
  ];
  const testStates = testCases.map(test => parseFEN(test));
  // const starting =
  //   ;
  // const startingState = parseFEN(starting);
  
  it("should create the fen string correctly", () => {
    for (let i = 0; i < testStates.length; i++) {
      const state = testStates[i];
      const created = createFEN(state);
      expect(created).toEqual(testCases[i]);
    }
  });
});
