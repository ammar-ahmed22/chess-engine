import React, { useContext } from "react";
import {
  GridItem,
  useColorModeValue,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import Piece from "../chess/pieces";
import { SquareID } from "../chess/move";
import { pieceSets } from "../chess/assets";
import ChessContext from "../context/chess";

type SquareProps = {
  piece: Piece | undefined;
  idx: number;
  indicateMove?: boolean;
};

const Square: React.FC<SquareProps> = ({
  piece,
  idx,
  indicateMove = false,
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
    if (piece) {
      const moves = piece.validMoves(ctx.gameState);
      if (moves.length) ctx.setValidMoves(moves);
    }
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
          fontSize="sm"
          fontWeight="bold"
        >
          {id[0]}
        </Text>
      )}
      {indicateMove && (
        <Box
          h="3vh"
          w="3vh"
          pos="absolute"
          top="50%"
          left="50%"
          borderRadius="100%"
          bg={isWhite ? "blackAlpha.500" : "whiteAlpha.500"}
          transform="translate(-50%, -50%)"
        />
      )}
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
