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
      const id = new SquareID("a", 1);
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
});
