import React, { useContext } from "react";
import { 
  Box,
  Button 
} from "@chakra-ui/react";
import ChessContext from "../context/chess";

const ControlPanel: React.FC = () => {

  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error("Context is not defined!");
  const { setSettings } = ctx
  
  const handleFlipBoard = () => {
    setSettings(prev => ({
      ...prev,
      reversedBoard: !prev.reversedBoard
    }))
  }

  return (
    <Box 
      flexGrow="1" 
      border="solid 1px green" 
      height="100%"
    >
      <Button onClick={() => handleFlipBoard()}>Flip Board</Button>
    </Box>
  )
}

export default ControlPanel;