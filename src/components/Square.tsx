import React, { useContext } from "react";
import {
  GridItem,
  useColorModeValue,
  Box,
  Image,
  Text,
  BoxProps,
} from "@chakra-ui/react";
import Piece from "../chess/pieces";
import { SquareID } from "../chess/squareID";
import { pieceSets } from "../chess/assets";
import ChessContext from "../context/chess";
import Move from "../chess/move";
import { executeMove } from "../chess/fen";

type SquareProps = {
  piece: Piece | undefined;
  idx: number;
  move?: Move;
};

const Square: React.FC<SquareProps> = ({
  piece,
  idx,
  move,
}) => {
  const ctx = useContext(ChessContext);
  if (!ctx) {
    throw new Error("Context is not defined!");
  }

  const {
    whiteSquare,
    blackSquare,
    pieceSet,
    reversedBoard,
  } = ctx.settings;
  const { gameState, updateFEN } = ctx;

  const row = Math.floor(idx / 8);
  const col = idx % 8;
  const isWhite = (row + col) % 2 === 0;
  const image = piece
    ? pieceSets[pieceSet][piece.color][piece.type]
    : undefined;

  const id = SquareID.fromFlatIdx(
    idx,
    reversedBoard,
  ).toString();
  const showRank = col === 0;
  const showFile = row === 7;

  const handleClick = () => {
    if (move) {
      // TODO Save the move after its executed
      const state = executeMove(gameState, move);
      updateFEN(state);
      ctx.setValidMoves(undefined);
      return;
    }
    if (piece) {
      const moves = piece.validMoves(ctx.gameState);
      ctx.setValidMoves(moves);
    }
  };

  const moveHintStyles = (): BoxProps => {
    const shared: BoxProps = {
      pos: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 4,
      borderRadius: "100%",
    };
    let added: BoxProps = {};
    if (move?.take) {
      added = {
        boxSizing: "border-box",
        h: "10vh",
        w: "10vh",
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: "1vh",
        borderStyle: "solid",
      };
    } else if (move) {
      added = {
        h: "3vh",
        w: "3vh",
        bg: "rgba(0, 0, 0, 0.2)",
      };
    }
    return {
      ...shared,
      ...added,
    };
  };

  return (
    <GridItem
      height="100%"
      width="100%"
      bg={isWhite ? whiteSquare : blackSquare}
      color={isWhite ? blackSquare : whiteSquare}
      display="flex"
      justifyContent="center"
      alignItems="center"
      pos="relative"
      cursor={piece || move ? "pointer" : "default"}
      onClick={() => handleClick()}
    >
      {showRank && (
        <Text
          pos="absolute"
          top="1"
          left="1"
          margin={0}
          padding={0}
          fontSize="sm"
          fontWeight="bold"
        >
          {id[1]}
        </Text>
      )}
      {showFile && (
        <Text
          pos="absolute"
          bottom="1"
          right="1"
          margin={0}
          padding={0}
          fontSize="md"
          fontWeight="bold"
        >
          {id[0]}
        </Text>
      )}
      {move && <Box {...moveHintStyles()} />}
      <Box
        h="10vh"
        w="10vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {piece && image && (
          <Image src={image} height="90%" />
        )}
      </Box>
    </GridItem>
  );
};

export default Square;
