import { algebraicMove } from "./helpers";
import { Chess } from "../Chess";
import type { MoveType } from "../Chess";

describe("algebraicMove", () => {
  it("generates the correct algebraic move notation for basic moves", () => {
    const chess = new Chess();
    const moves: MoveType[] = [
      { from: "e2", to: "e4" },
      { from: "d7", to: "d5" },
      { from: "e4", to: "d5" },
      { from: "d8", to: "d5" },
      { from: "f1", to: "d3" },
      { from: "e7", to: "e5" },
      { from: "g1", to: "f3" },
      { from: "f8", to: "d6" },
      { from: "e1", to: "g1", castle: "king" },
    ]
    const algebraics = [
      "e4",
      "d5",
      "exd5",
      "Qxd5",
      "Bd3",
      "e5",
      "Nf3",
      "Bd6",
      "O-O"
    ]
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      let vMoves = chess.validMoves();
      let result = chess.execute(move);
      if (result) {
        const algebraic = algebraicMove(result, vMoves);
        expect(algebraic).toBe(algebraics[i]);
      }
    }
  })

  it("generates the correct algebraic move notation for ambiguous moves", () => {
    const chess = new Chess();
    chess.setPosition("3r3r/8/8/8/R3Q2Q/8/8/R6Q");
    let vMoves = chess.validMoves();
    let rookMove = vMoves.find((m) => m.piece === "rook" && m.from === "a1" && m.to === "a3");
    if (rookMove) {
      let result = chess.execute(rookMove);
      if (result) {
        expect(algebraicMove(result, vMoves)).toBe("R1a3")
      }
    }
    chess.setPosition("3r3r/8/8/8/R3Q2Q/8/8/R6Q");
    vMoves = chess.validMoves();
    rookMove = vMoves.find((m) => m.piece === "rook" && m.from === "d8" && m.to === "f8");
    if (rookMove) {
      let result = chess.execute(rookMove);
      if (result) {
        expect(algebraicMove(result, vMoves)).toBe("Rdf8")
      }
    }

    chess.setPosition("3r3r/8/8/8/R3Q2Q/8/8/R6Q");
    vMoves = chess.validMoves();
    let queenMove = vMoves.find((m) => m.piece === "queen" && m.from === "h4" && m.to === "e1");
    if (queenMove) {
      let result = chess.execute(queenMove);
      if (result) {
        expect(algebraicMove(result, vMoves)).toBe("Qh4e1")
      }
    }
  })
})