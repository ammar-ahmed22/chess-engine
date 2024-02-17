import { validateFEN } from "./validation";

describe("validateFEN", () => {
  it("throws errors for invalid FEN separator", () => {
    const invalidSep = "rnbqkbnr:pppppppp:8:8:8:8:PPPPPPPP:RNBQKBNR"
    expect(() => validateFEN(invalidSep)).toThrow();
  })

  it("throws an error for invalid characters", () => {
    const invalidChars = "zzzzzz/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    expect(() => validateFEN(invalidChars)).toThrow();
  })
})