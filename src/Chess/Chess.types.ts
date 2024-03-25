import { Piece } from "../Piece";
// import { SquareID } from "../SquareID";

export type Color = "white" | "black";

// export type SquareIDType =
//   | string
//   | {
//       file: string | number;
//       rank: number;
//     };

export type MoveType = {
  from: string;
  to: string;
  castle?: CastleType;
  promotion?: PieceType;
  enPassant?: boolean;
};

export type HalfMove = {
  from: string;
  to: string;
  color: Color;
  piece: PieceType;
  take?: PieceType;
  castle?: CastleType;
  enPassant?: boolean;
  check?: Color;
  promotion?: PieceType;
};

export type CompleteHalfMove = {
  state: HalfMoveState;
  move: HalfMove;
  algebraic: string;
};

// export type FullMove = {
//   white: CompleteHalfMove;
//   black?: CompleteHalfMove;
// };

export type HalfMoveState = {
  fen: string;
  gameState: GameState;
};

export type CastleType = "queen" | "king";

export type MatrixType = Piece | undefined;

export type PieceType =
  | "pawn"
  | "king"
  | "queen"
  | "bishop"
  | "rook"
  | "knight";

export type CastlingAbility = {
  [K in Color]: {
    [J in CastleType]?: boolean;
  };
};

export type GameState = {
  colorToMove: Color;
  enPassant?: string;
  castling: CastlingAbility;
  inCheck: boolean;
};

export type GameBoardExecuteOptions = {
  silent?: boolean;
};

export type ChessExecuteOptions = GameBoardExecuteOptions & {
  validate?: boolean;
};

export type GameStatus =
  | "in-progress"
  | "checkmate"
  | "stalemate"
  | "insufficient"
  | "check"
  | "50move"
  | "repetition";
