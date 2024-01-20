import type { Chess } from "../types";
import { CasesPieceMap } from "./cases";
import { NeoPieceMap } from "./neo";

export type PieceMap = {
  white: {
    [K in Chess.PieceType]: string;
  };
  black: {
    [K in Chess.PieceType]: string;
  };
};

export type PieceSetTypes = "cases" | "neo";

export type PieceSets = {
  [K in PieceSetTypes]: PieceMap;
};

export const pieceSets: PieceSets = {
  cases: CasesPieceMap,
  neo: NeoPieceMap,
};
