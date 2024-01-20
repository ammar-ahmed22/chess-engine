import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useFEN } from "./useFEN";
import { createFEN } from "../chess/fen";

describe("useFEN", () => {
  const starting =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  it("should create the game state", () => {
    const { result } = renderHook(() => useFEN(starting))
    const { fen, gameState } = result.current;
    expect(fen).toBe(starting);
    expect(gameState.gameBoard.matrix.length).toBe(8);
    expect(gameState.gameBoard.matrix[0].length).toBe(8);
  })

  it("should update the FEN with setFEN", async () => {
    const { result } = renderHook(() => useFEN(starting));
    act(() => {
      const { setFEN, gameState } = result.current;
      gameState.whiteToMove = false;
      setFEN(createFEN(gameState));
    })

    await waitFor(() => {
      const updated = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";
      expect(result.current.fen).toBe(updated)
      expect(result.current.gameState.whiteToMove).toBe(false);
    })
  })

  it("should update the FEN with updateFEN", async () => {
    const { result } = renderHook(() => useFEN(starting));
    act(() => {
      const { updateFEN, gameState } = result.current;
      gameState.castling.black[0] = false;
      gameState.whiteToMove = false;
      updateFEN(gameState);
    })

    await waitFor(() => {
      const updated = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1";
      expect(result.current.fen).toBe(updated);
      expect(result.current.gameState.castling.black[0]).toBe(false);
      expect(result.current.gameState.whiteToMove).toBe(false);
    })

  })
})