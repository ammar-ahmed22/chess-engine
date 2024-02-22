// import { Pawn, Rook, Knight, Bishop, King, Queen } from "../Piece/map";
import Pawn from "../Piece/Pawn";
import Rook from "../Piece/Rook";
import King from "../Piece/King";
import Knight from "../Piece/Knight";
import Bishop from "../Piece/Bishop";
import Queen from "../Piece/Queen";
import { ValueError } from "./error";
import SquareID from "../SquareID";
import Piece from "../Piece";
import { Color, MatrixType } from "@engine-types";


export function str2piece(char: string, pos: SquareID): Piece {
  if (char.length !== 1) throw new ValueError("Only single characters allowed!", char);
  const color: Color = char.toLowerCase() !== char ? "white" : "black";
  switch (char.toLowerCase()) {
    case "p":
      return new Pawn(color, pos)
    case "r":
      return new Rook(color, pos)
    case "n":
      return new Knight(color, pos)
    case "b":
      return new Bishop(color, pos)
    case "k":
      return new King(color, pos)
    case "q":
      return new Queen(color, pos)
    default:
      throw new ValueError(`Cannot parse character: \`${char}\``, char)
  }
}

export const fen2matrix = (fen: string): MatrixType[][] => {
  const result: MatrixType[][] = [];
  const board = fen.split("/");
  for (let i = 0; i < board.length; i++) {
    let rank = board[i];
    let temp: MatrixType[] = [];
    let rankNum = 8 - i;
    let fileNum = 1;
    for (let j = 0; j < board[i].length; j++) {
      let char = rank[j];
      if (!isNaN(parseInt(char))) {
        const emptyCount = parseInt(char);
        fileNum += emptyCount;
        for (let k = 0; k < emptyCount; k++) {
          temp.push(undefined);
        }
      } else {
        const pos = new SquareID(fileNum, rankNum);
        const piece = str2piece(char, pos);
        temp.push(piece);
        fileNum++;
      }
    }
    result.push(temp);
  }
  return result;
}

export const matrix2fen = (matrix: MatrixType[][]): string => {
  let ranks: string[] = [];
  for (let i = 0; i < 8; i++) {
    let temp: string = "";
    let empty = 0;
    for (let j = 0; j < 8; j++) {
      const piece = matrix[i][j];
      if (piece) {
        if (empty !== 0) {
          temp += empty;
        }
        temp += piece.fenChar;
        empty = 0
      } else {
        empty++;
        continue;
      }
    }
    if (empty !== 0) {
      temp += empty;
    }
    ranks.push(temp);
  }

  return ranks.join("/");
}