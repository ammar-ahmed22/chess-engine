import React, { useState } from "react";
import ChessContext, {
  ChessContextType,
  Settings,
} from "../context/chess";
import Move from "../chess/move";
import { useFEN } from "../hooks/useFEN";
// ChakraUI
import {
  Container,
  useColorModeValue,
} from "@chakra-ui/react";

// Components
import Board from "./Board";
import ControlPanel from "./ControlPanel";

const Chess: React.FC = () => {
  const startingFEN =
    "rnbqkbnr/p1p1pppp/8/8/8/1p1p4/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const { fen, gameState, setFEN, updateFEN } =
    useFEN(startingFEN);
  const whiteSquare = useColorModeValue(
    "gray.100",
    "gray.100",
  );
  const blackSquare = useColorModeValue(
    "blue.700",
    "blue.700",
  );
  const [settings, setSettings] = useState<Settings>({
    pieceSet: "cases",
    whiteSquare,
    blackSquare,
    reversedBoard: false,
  });

  const [validMoves, setValidMoves] = useState<
    Move[] | undefined
  >();
  const context: ChessContextType = {
    fen,
    gameState,
    setFEN,
    updateFEN,
    settings,
    setSettings,
    validMoves,
    setValidMoves,
  };

  React.useEffect(() => {
    console.log(validMoves);
  }, [validMoves]);

  return (
    <ChessContext.Provider value={context}>
      <Container
        maxW={{
          base: "100%",
          md: "container.lg",
        }}
        // border="solid 1px red"
        minH="100vh"
        centerContent
        flexDir="row"
        p={0}
      >
        <Board />
        <ControlPanel />
      </Container>
    </ChessContext.Provider>
  );
};

export default Chess;
