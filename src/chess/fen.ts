import { GameBoard, GameState } from "./game";
import Piece from "./pieces";
import { Chess } from "./types";
import { createPiece } from "./pieces/utils";
import { SquareID } from "./move";

const validateFEN = (fenString: string) => {
  const parts = fenString.trim().split(" ");
  // Number of parts
  if (parts.length !== 6) {
    throw new Error(`FEN string must have 6 parts!`);
  }

  // Extraction
  const [
    board,
    moveColor,
    castling,
    enPassant,
    halfMoves,
    fullMoves,
  ] = parts;

  // Board
  const ranks = board.split("/").filter((s) => s);
  if (ranks.length !== 8) {
    throw new Error(
      `FEN string does not have the correct number of ranks OR there is an invalid separator!. fen: '${fenString}'`,
    );
  }

  // Validating ranks
  for (const rank of ranks) {
    const allowedRegex = /^[rnbqkpRNBQKP12345678]+$/;
    if (!allowedRegex.test(rank)) {
      for (const char of rank) {
        if (!allowedRegex.test(char)) {
          throw new Error(
            `FEN ranks contain invalid character: '${char}'! fen: '${fenString}'`,
          );
        }
      }
    }
  }

  // Validating color to move
  if (moveColor.length !== 1) {
    throw new Error(
      `FEN move color: '${moveColor}' must be a single character! fen: '${fenString}'`,
    );
  }

  if (!["w", "b"].includes(moveColor)) {
    throw new Error(
      `FEN move color: '${moveColor}' must be 'w' or 'b'! fen: '${fenString}'`,
    );
  }

  // Validating castling
  if (castling.length > 4)
    throw new Error(
      `FEN castling can have a maximum of 4 characters! fen: '${fenString}'`,
    );
  let noCastle = false;
  if (castling.length === 1 && castling === "-")
    noCastle = true;
  if (!noCastle) {
    for (const char of castling) {
      if (!["K", "k", "Q", "q"].includes(char)) {
        throw new Error(
          `Invalid character in castling! fen: '${fenString}'`,
        );
      }
    }
  }

  // Validate move count
  if (isNaN(parseInt(halfMoves))) {
    throw new Error(
      `Half move count must be an integer!, fen: '${fenString}'`,
    );
  }

  if (parseInt(halfMoves) < 0) {
    throw new Error(
      `Half move count must be >= 0!, fen: '${fenString}'`,
    );
  }

  if (isNaN(parseInt(fullMoves))) {
    throw new Error(
      `Full move count must be an integer!, fen: '${fenString}'`,
    );
  }

  if (parseInt(fullMoves) < 1) {
    throw new Error(
      `Full move count must be >= 0!, fen: '${fenString}'`,
    );
  }

  // Validate en passant
  let noPassant = false;
  if (enPassant.length === 1 && enPassant === "-")
    noPassant = true;
  if (!noPassant) {
    if (enPassant.length !== 2) {
      throw new Error(
        `En passant must be 2 characters denoting rank and file!, fen: '${fenString}'`,
      );
    }
    const file = enPassant[0];
    let rank = enPassant[1];
    if (isNaN(parseInt(rank))) {
      throw new Error(
        `Rank of en passant must be a number!, fen: '${fenString}'`,
      );
    }
    if (parseInt(rank) < 1 || parseInt(rank) > 8) {
      throw new Error(
        `Rank of en passant must be between 1-8!, fen: '${fenString}'`,
      );
    }

    const allowedRegex = /^[abcdefgh]+$/;
    if (!allowedRegex.test(file)) {
      throw new Error(
        `File of en passant must be from a-h!, fen: '${fenString}'`,
      );
    }
  }

  return {
    board: board.split("/"),
    isWhite: moveColor === "w",
    castlingStr: castling,
    enPassantStr: enPassant,
    halfMoves: parseInt(halfMoves),
    fullMoves: parseInt(fullMoves),
  };
};

export const parseFEN = (fenString: string): GameState => {
  // Validation
  const {
    board,
    isWhite,
    castlingStr,
    enPassantStr,
    halfMoves,
    fullMoves,
  } = validateFEN(fenString);

  // Create board matrix
  const matrix: (Piece | undefined)[][] = [];
  for (let i = 0; i < board.length; i++) {
    let rank: string = board[i];
    let temp: (Piece | undefined)[] = [];
    let rankNum = 8 - i;
    for (let j = 0; j < rank.length; j++) {
      let char = rank[j];
      let fileNum = j + 1;
      if (!isNaN(parseInt(char))) {
        const emptyCount = parseInt(char);
        fileNum += emptyCount;
        for (let k = 0; k < emptyCount; k++) {
          temp.push(undefined);
        }
      } else {
        const pos = new SquareID(fileNum, rankNum);
        const piece = createPiece(char, pos);
        temp.push(piece);
      }
    }
    matrix.push(temp);
  }
  // for (const rank of board) {
  //   let temp: (Piece | undefined)[] = [];
  //   for (const char of rank) {
  //     if (!isNaN(parseInt(char))) {
  //       // number --> this many empty squares!
  //       const emptyCount = parseInt(char);
  //       for (let i = 0; i < emptyCount; i++) {
  //         temp.push(undefined);
  //       }
  //     } else {
  //       const piece = createPiece(char);
  //       temp.push(piece);
  //     }
  //   }
  //   matrix.push(temp);
  // }

  // Parse castling
  const castling: Chess.Castling = {
    black: [false, false],
    white: [false, false],
  };

  if (castlingStr !== "-") {
    for (const char of castlingStr) {
      const mapKey: "black" | "white" =
        char.toLowerCase() === char ? "black" : "white";
      const index = char.toLowerCase() === "k" ? 0 : 1;
      castling[mapKey][index] = true;
    }
  }

  // Parse en passant
  let enPassant: SquareID | undefined;
  if (enPassantStr !== "-") {
    const file = enPassantStr[0];
    // const rank = enPassantStr[1];
    if (isNaN(parseInt(enPassantStr[1]))) {
      throw new Error(`enPassant is invalid: '${enPassantStr}'`);
    }
    const rank = parseInt(enPassantStr[1]);
    enPassant = new SquareID(file, rank);
  }

  return new GameState({
    gameBoard: new GameBoard(matrix),
    whiteToMove: isWhite,
    castling,
    enPassant,
    halfMoveCount: halfMoves,
    fullMoveCount: fullMoves,
  });
};

export const createFEN = (gameState: GameState): string => {
  const { 
    gameBoard,
    whiteToMove,
    castling,
    enPassant,
    halfMoveCount,
    fullMoveCount
  } = gameState;

  // Game board
  let rows: string[] = [];
  for (let i = 0; i < 8; i++) {
    let temp: string = "";
    let emptyCount = 0;
    for (let j = 0; j < 8; j++) {
      const piece = gameBoard.matrix[i][j];
      if (piece) {
        if (emptyCount !== 0) {
          temp += emptyCount;
        }
        temp += piece.fenChar;
        emptyCount = 0;
      } else {
        emptyCount++;
        continue;
      }
    }
    if (emptyCount !== 0) {
      temp += emptyCount;
    }
    rows.push(temp);
  }

  // Castling
  let castleStr = "";
  let noCastle = true;
  for (let k in castling) {
    let key = k as "black" | "white";
    for (let val of castling[key]) {
      if (val) noCastle = false;
    }
  }
  if (noCastle) {
    castleStr = "-"
  } else {
    if (castling.white[0]) castleStr += "K";
    if (castling.white[1]) castleStr += "Q";
    if (castling.black[0]) castleStr += "k";
    if (castling.black[1]) castleStr += "q";
  }



  return `${rows.join("/")} ${whiteToMove ? "w" : "b"} ${castleStr} ${enPassant ? enPassant.toString() : "-"} ${halfMoveCount} ${fullMoveCount}`;
};
