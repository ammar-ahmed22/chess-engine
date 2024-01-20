import React from "react";
import { useContext } from "react";
import ChessContext from "../context/chess";
import {
  Box,
  Text,
  Grid,
  GridItem,
  useColorModeValue
} from "@chakra-ui/react"
import { SquareID } from "../chess/move";

// Components
import Square from "./Square";

const Board: React.FC = () => {
  const ctx = useContext(ChessContext);
  if (!ctx) {
    throw new Error("Context is null!")
  }
    
  const { gameState, updateFEN, settings, validMoves } = ctx;
  const { gameBoard } = gameState

  return (
    <Box width="80vh" >
      <Box 
        // border="solid 1px blue" 
        height="9vh"
      ></Box>
      <Grid 
        // border="solid 1px pink" 
        height="80vh" 
        templateColumns="repeat(8, 1fr)"
      >
        {
          gameBoard.get.flattenedMatrix(settings.reversedBoard).map((piece, idx) => {
            const id = SquareID.fromFlatIdx(idx);
            let indicateMove = false;
            if (validMoves) {
              for (let move of validMoves) {
                if (id.equals(move.to)) indicateMove = true;
              }
            }
            return (
              <Square 
                piece={piece} 
                idx={idx} 
                key={id.toString()}
                indicateMove={indicateMove}
              />
            )
          })
        }
      </Grid>
      <Box 
        // border="solid 1px blue" 
        height="9vh"
      ></Box>
    </Box>
  )
};

export default Board;
