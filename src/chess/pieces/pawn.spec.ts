import { parseFEN } from "../fen";
import { SquareID } from "../move";
import Pawn from "./pawn";

describe("Pawn", () => {
  const starting =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const startingState= parseFEN(starting);
  it("should generate validMoves correctly for the starting position", () => {
    const e2Pawn = startingState.gameBoard.get.atID(new SquareID("e", 2)) as Pawn;
    expect(e2Pawn).toBeDefined();
    const moves = e2Pawn.validMoves(startingState);
    expect(moves.length).toBe(2);
    const expectedMoves = ["e3", "e4"];
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      expect(move.from.toString()).toBe("e2");
      expect(move.to.toString()).toBe(expectedMoves[i]);
    }
  })

  const allMoves = "rnbqkbnr/ppp1p1pp/8/8/8/3p1p2/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  const allMoveState = parseFEN(allMoves);
  it("should generate validMoves correctly when takes are available", () => {
    const e2Pawn = allMoveState.gameBoard.get.atID(new SquareID("e", 2)) as Pawn;
    expect(e2Pawn).toBeDefined();
    const moves = e2Pawn.validMoves(allMoveState);
    expect(moves.length).toBe(4);
    let takeCount = 0;
    for (let move of moves) {
      if (move.take) takeCount++;
    }
    expect(takeCount).toBe(2);
  })

})