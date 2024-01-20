export namespace Chess {
  export type Castling = {
    black: [boolean, boolean];
    white: [boolean, boolean];
  };
  export type PieceType =
    | "pawn"
    | "rook"
    | "knight"
    | "bishop"
    | "king"
    | "queen";
}
