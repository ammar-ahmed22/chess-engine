import { 
  FaChessPawn as Fa6Pawn,
  FaChessRook as Fa6Rook,
  FaChessKnight as Fa6Knight,
  FaChessBishop as Fa6Bishop,
  FaChessKing as Fa6King,
  FaChessQueen as Fa6Queen,
  FaRegChessPawn, 
  FaRegChessRook,
  FaRegChessKnight,
  FaRegChessBishop,
  FaRegChessKing,
  FaRegChessQueen
} from "react-icons/fa6"
import { 
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessKing,
  FaChessBishop,
  FaChessQueen 
} from "react-icons/fa"
import type { Chess } from "../chess/types"
import type { IconType } from "react-icons"

type IconSets = "fa" |  "fa6" | "fa6reg";
export type IconSetMap = {
  [K in IconSets]: IconMap
}

export type IconMap = {
  [K in Chess.PieceType]: IconType
}

const fa6: IconMap = {
  pawn: Fa6Pawn,
  rook: Fa6Rook,
  knight: Fa6Knight,
  bishop: Fa6Bishop,
  king: Fa6King,
  queen: Fa6Queen
}

const fa: IconMap = {
  pawn: FaChessPawn,
  rook: FaChessRook,
  knight: FaChessKnight,
  bishop: FaChessBishop,
  king: FaChessKing,
  queen: FaChessQueen
}

const fa6reg: IconMap = {
  pawn: FaRegChessPawn,
  rook: FaRegChessRook,
  knight: FaRegChessKnight,
  bishop: FaRegChessBishop,
  king: FaRegChessKing,
  queen: FaRegChessQueen
}

export const iconMap: IconSetMap = {
  fa,
  fa6,
  fa6reg
}