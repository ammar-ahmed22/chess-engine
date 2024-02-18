import Piece from "../../engine/Piece";
import SquareID from "../../engine/SquareID";

export type Color = "white" | "black";

export type SquareIDType = string | {
  file: string | number,
  rank: number
}

export type MoveType = {
  from: SquareIDType;
  to: SquareIDType;
  castle?: string
};

export type HalfMove = {
  from: SquareIDType,
  to: SquareIDType,
  color: Color,
  take?: PieceType,
  castle?: string,
  enPassant?: boolean,
  check?: boolean
}

export type FullMove = {
  [K in Color]?: HalfMove
}

export type MatrixType = Piece | undefined;

export type PieceType = "pawn" | "king" | "queen" | "bishop" | "rook" | "knight";

export type CastlingAbility = {
  [K in Color]: [boolean, boolean]
}

export type GameState = {
  colorToMove: Color,
  enPassant?: SquareID,
  castling: CastlingAbility
}
