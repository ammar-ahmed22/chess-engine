import { createContext } from "react";
import { GameState } from "../chess/game";
import Move from "../chess/move";
import type { SetState } from "../types";
import type { PieceSetTypes } from "../chess/assets";
import { BoxProps } from "@chakra-ui/react";

export type Settings = {
  pieceSet: PieceSetTypes;
  whiteSquare: BoxProps["bg"];
  blackSquare: BoxProps["bg"];
  reversedBoard: boolean;
};

export type ChessContextType = {
  fen: string;
  validMoves?: Move[];
  setValidMoves: SetState<Move[] | undefined>;
  gameState: GameState;
  setFEN: SetState<string>;
  updateFEN: (gameState: GameState) => void;
  settings: Settings;
  setSettings: SetState<Settings>;
};

const ChessContext = createContext<ChessContextType | null>(
  null,
);

export default ChessContext;
