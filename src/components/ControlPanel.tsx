import React, { useContext } from "react";
import {
  Box,
  Button,
  Editable,
  useEditableControls,
  EditablePreview,
  EditableInput,
  Flex,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import ChessContext from "../context/chess";

const FENEditor: React.FC = () => {
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          icon={<FaCheck />}
          {...getSubmitButtonProps()}
          aria-label=""
        />
        <IconButton
          icon={<FaTimes />}
          {...getCancelButtonProps()}
          aria-label=""
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          icon={<FaEdit />}
          {...getEditButtonProps()}
          aria-label=""
          size="sm"
        />
      </Flex>
    );
  }

  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error("Context is not defined!");
  const { fen, setFEN } = ctx;
  // TODO: Make it so that the preview updates with the state FEN value
  return (
    <Editable
      textAlign="center"
      defaultValue={fen}
      fontSize="sm"
      isPreviewFocusable={false}
      onSubmit={(val: string) => {
        setFEN(val);
      }}
    >
      <EditablePreview />
      <EditableInput />
      <EditableControls />
    </Editable>
  );
};

const ControlPanel: React.FC = () => {
  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error("Context is not defined!");
  const { setSettings } = ctx;

  const handleFlipBoard = () => {
    setSettings((prev) => ({
      ...prev,
      reversedBoard: !prev.reversedBoard,
    }));
  };

  return (
    <Box
      flexGrow="1"
      border="solid 1px green"
      height="100%"
    >
      <Button onClick={() => handleFlipBoard()}>
        Flip Board
      </Button>
      <FENEditor />
    </Box>
  );
};

export default ControlPanel;
