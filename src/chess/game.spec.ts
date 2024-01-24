import { parseFEN } from "./fen";
import Move from "./move";
import { SquareID } from "./squareID";
import Piece from "./pieces";
import { GameBoard } from "./game";

const starting =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { gameBoard } = parseFEN(starting);

describe("GameBoard.get.atID", () => {
  it("gets the correct piece", () => {
    const test = new SquareID(1, 1);
    const piece = gameBoard.get.atID(test);
    expect(piece).toBeDefined();
    expect(piece?.color).toBe("white");
    expect(piece?.type).toBe("rook");
  });
});

describe("GameBoard.get.flattenedMatrix", () => {
  it("creates the flattened matrix correctly in non-reverse order", () => {
    const flat = gameBoard.get.flattenedMatrix(false);
    expect(flat.length).toBe(64);
    expect(flat[0]).toBeDefined();
    expect(flat[0]?.color).toBe("black");
    expect(flat[0]?.type).toBe("rook");
    const noParam = gameBoard.get.flattenedMatrix();
    expect(noParam.length).toBe(64);
    expect(noParam[0]).toBeDefined();
    expect(noParam[0]?.color).toBe("black");
    expect(noParam[0]?.type).toBe("rook");
  });

  it("creates the flattened matrix correctly in reverse order", () => {
    const flat = gameBoard.get.flattenedMatrix(true);

    expect(flat.length).toBe(64);
    expect(flat[0]).toBeDefined();
    expect(flat[0]?.color).toBe("white");
    expect(flat[0]?.type).toBe("rook");
  });
});

describe("GameBoard.copy", () => {
  it("copies the gameboard correctly", () => {
    const copy = gameBoard.copy();
    expect(copy.matrix.length).toBe(
      gameBoard.matrix.length,
    );
    for (let i = 0; i < copy.matrix.length; i++) {
      expect(copy.matrix[i].length).toBe(
        gameBoard.matrix[i].length,
      );
      for (let j = 0; j < copy.matrix[i].length; j++) {
        if (!gameBoard.matrix[i][j]) {
          expect(copy.matrix[i][j]).not.toBeDefined();
        } else {
          expect(copy.matrix[i][j]?.type).toBe(
            gameBoard.matrix[i][j]?.type,
          );
          expect(
            copy.matrix[i][j]?.position.toString(),
          ).toBe(
            gameBoard.matrix[i][j]?.position.toString(),
          );
          expect(copy.matrix[i][j]?.color).toBe(
            gameBoard.matrix[i][j]?.color,
          );
        }
      }
    }
  });
});

describe("GameBoard.executeMove", () => {
  it("executes the move correctly for a non-take", () => {
    const e2 = new SquareID("e", 2);
    const e4 = new SquareID("e", 4);
    const testMove = new Move({
      white: true,
      from: e2,
      to: e4,
      piece: gameBoard.get.atID(e2) as Piece,
    });

    const executed = GameBoard.executeMove(
      gameBoard,
      testMove,
    );
    const { gameBoard: exec, taken, takenBy } = executed;
    expect(exec.get.atID(e2)).not.toBeDefined();
    expect(exec.get.atID(e4)).toBeDefined();
    expect(exec.get.atID(e4)?.type).toBe("pawn");
    expect(exec.get.atID(e4)?.color).toBe("white");
    expect(taken).not.toBeDefined();
    expect(takenBy).not.toBeDefined();
  });

  it("executes the move correctly for a take", () => {
    const centerPawns =
      "rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1";
    const { gameBoard } = parseFEN(centerPawns);
    const d4 = new SquareID("d", 4);
    const e5 = new SquareID("e", 5);
    const testMove = new Move({
      white: true,
      from: d4,
      to: e5,
      take: gameBoard.get.atID(e5),
      piece: gameBoard.get.atID(d4) as Piece,
    });

    const executed = GameBoard.executeMove(
      gameBoard,
      testMove,
    );
    const { gameBoard: exec, taken, takenBy } = executed;
    expect(exec.get.atID(d4)).not.toBeDefined();
    expect(exec.get.atID(e5)).toBeDefined();
    expect(exec.get.atID(e5)?.type).toBe("pawn");
    expect(exec.get.atID(e5)?.color).toBe("white");
    expect(taken).toBeDefined();
    expect(takenBy).toBeDefined();
    expect(taken?.type).toBe("pawn");
    expect(takenBy?.type).toBe("pawn");
    expect(taken?.color).toBe("black");
    expect(takenBy?.color).toBe("white");
  });
});
