import { ValueError } from "./error";

/**
 * Validates a FEN string
 * @param fen FEN string
 */
export const validateFEN = (fen: string): boolean => {
  const ranks = fen.split("/").filter((s) => s);
  if (ranks.length !== 8) {
    throw new ValueError(
      `FEN string does not have the correct number of ranks OR there is an invalid separator!`,
      fen,
    );
  }

  // Validating ranks
  for (const rank of ranks) {
    const allowedRegex = /^[rnbqkpRNBQKP12345678]+$/;
    if (!allowedRegex.test(rank)) {
      for (const char of rank) {
        if (!allowedRegex.test(char)) {
          throw new ValueError(
            `FEN ranks contain invalid character: '${char}'!`,
            fen,
          );
        }
      }
    }
  }

  return true;
};
