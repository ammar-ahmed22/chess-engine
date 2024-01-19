import { createPiece } from "./utils";
import {
  Pawn,
  Rook,
  Knight,
  Bishop,
  King,
  Queen,
} from "./pieceMap";
import { SquareID } from "../move";

describe("createPiece", () => {
  const id = new SquareID("a", 1);
  it("should create pieces correctly", () => {
    const tests = "prnbkqPRNBKQ";
    const expectedInstances = [
      Pawn,
      Rook,
      Knight,
      Bishop,
      King,
      Queen,
    ];

    for (let i = 0; i < 6; i++) {
      const blackTest = tests[i];
      const whiteTest = tests[i + 6];
      const blackCreated = createPiece(blackTest, id);
      const whiteCreated = createPiece(whiteTest, id);
      expect(blackCreated).toBeInstanceOf(
        expectedInstances[i],
      );
      expect(blackCreated.color).toEqual("black");
      expect(whiteCreated).toBeInstanceOf(
        expectedInstances[i],
      );
      expect(whiteCreated.color).toEqual("white");
    }
  });

  it("should throw errors for invalid inputs", () => {
    const invalidInputs = ["ammar", "L"];
    for (let invalid of invalidInputs) {
      expect(() => createPiece(invalid, id)).toThrow();
    }
  });
});
