import type { CompleteHalfMove } from "../Chess";


/**
 * Returns all the positions in order given a game history
 * @param history The game history
 */
export const allPositions = (history: CompleteHalfMove[]) => {
  const positions: string[] = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"];
  for (let complete of history) {
    positions.push(complete.state.fen);
  }

  return positions;
}