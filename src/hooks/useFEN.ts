import { useState, useEffect } from "react";
import { createFEN, parseFEN } from "../chess/fen";
import { GameState } from "../chess/game";

const useFEN = (fenString: string) => {
  const [fen, setFEN] = useState(fenString);
  const [gameState, setGameState] = useState(parseFEN(fenString));


  useEffect(() => {
    setGameState(parseFEN(fen));
  }, [fen, setGameState])

  return {
    fen,
    setFEN,
    gameState,
    updateFEN: (gameState: GameState) => {
      setFEN(createFEN(gameState));
    }
  }
}

export { useFEN };