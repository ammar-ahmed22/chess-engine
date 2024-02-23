import React from "react";

export type ChessBoardProps = {
  size: string | number,
  position: string,
}

const ChessBoard: React.FC<ChessBoardProps> = ({ size }) => {
  return (
    <div>
      size: {size}
    </div>
  );
};

export default ChessBoard;
