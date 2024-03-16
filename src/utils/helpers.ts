import type { FullMove } from "../Chess";


/**
 * Returns all the positions in order given a game history
 * @param history The game history
 */
export const allPositions = (history: FullMove[]) => {
  const positions: string[] = [];
  for (let full of history) {
    positions.push(full.white.state.fen);
    if (full.black) {
      positions.push(full.black.state.fen);
    }
  }

  return positions;
}