import React from "react";
import { useContext } from "react";
import ChessContext from "../context/chess";
import {
  Box,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { SquareID } from "../chess/squareID";

// Components
import Square from "./Square";
import Move from "../chess/move";

const Board: React.FC = () => {
  const ctx = useContext(ChessContext);
  if (!ctx) {
    throw new Error("Context is null!");
  }

  const { gameState, updateFEN, settings, validMoves } =
    ctx;
  const { gameBoard } = gameState;

  return (
    <Box width="80vh">
      <Box
        // border="solid 1px blue"
        height="9vh"
      ></Box>
      <Grid
        // border="solid 1px pink"
        height="80vh"
        templateColumns="repeat(8, 1fr)"
      >
        {gameBoard.get
          .flattenedMatrix(settings.reversedBoard)
          .map((piece, idx) => {
            const id = SquareID.fromFlatIdx(
              idx,
              settings.reversedBoard,
            );
            let move: Move | undefined = undefined;
            if (validMoves) {
              for (let validMove of validMoves) {
                if (id.equals(validMove.to)) {
                  move = validMove;
                }
              }
            }
            return (
              <Square
                piece={piece}
                idx={idx}
                key={id.toString()}
                move={move}
              />
            );
          })}
      </Grid>
      <Box
        // border="solid 1px blue"
        height="9vh"
      ></Box>
    </Box>
  );
};

export default Board;
