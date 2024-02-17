import Piece from "@engine/Piece";

export type Color = "white" | "black";

export type Move = {
  colorToMove?: Color;
  from: string;
  to: string;
  castle?: boolean;
  take?: string;
  piece: string;
  check?: boolean;
};

export type MatrixType = Piece | undefined;
