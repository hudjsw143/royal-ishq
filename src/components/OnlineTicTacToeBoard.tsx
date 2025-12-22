import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { RoomData } from "@/hooks/useOnlineGame";

interface OnlineTicTacToeBoardProps {
  roomData: RoomData;
  isHost: boolean;
  onMove: (index: number) => void;
  disabled?: boolean;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const OnlineTicTacToeBoard = ({
  roomData,
  isHost,
  onMove,
  disabled = false,
}: OnlineTicTacToeBoardProps) => {
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  const board = roomData?.gameState?.board || Array(9).fill("");
  const currentTurn = roomData?.gameState?.currentTurn || "host";
  const isMyTurn = (isHost && currentTurn === "host") || (!isHost && currentTurn === "guest");
  const mySymbol = isHost ? "👑" : "❤️";
  const opponentSymbol = isHost ? "❤️" : "👑";

  // Check for winning line
  useEffect(() => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        setWinningLine(combination);
        return;
      }
    }
    setWinningLine(null);
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] !== "" || !isMyTurn || disabled || roomData?.gameState?.winner) return;
    onMove(index);
  };

  const getPlayerName = (turn: "host" | "guest") => {
    if (turn === "host") {
      return isHost ? "Your turn" : `${roomData.host.name}'s turn`;
    }
    return isHost ? `${roomData.guest?.name || "Partner"}'s turn` : "Your turn";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Turn Indicator */}
      <motion.div
        key={currentTurn}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-medium text-foreground">
          {getPlayerName(currentTurn)}
        </p>
        <p className="text-3xl mt-1">
          {currentTurn === "host" ? "👑" : "❤️"}
        </p>
        {isMyTurn && (
          <p className="text-xs text-secondary mt-1 animate-pulse">Make your move!</p>
        )}
      </motion.div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-primary/10 backdrop-blur-sm border-2 border-secondary/40 shadow-lg">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            disabled={cell !== "" || !isMyTurn || disabled}
            whileHover={cell === "" && isMyTurn && !disabled ? { scale: 1.05 } : {}}
            whileTap={cell === "" && isMyTurn && !disabled ? { scale: 0.95 } : {}}
            className={`
              h-20 w-20 sm:h-24 sm:w-24 rounded-xl text-4xl sm:text-5xl
              flex items-center justify-center
              transition-all duration-200
              ${winningLine?.includes(index) 
                ? "bg-secondary/30 border-secondary shadow-gold" 
                : "bg-card/80 border-border/50 hover:border-secondary/50"
              }
              border-2
              ${cell === "" && isMyTurn && !disabled ? "cursor-pointer hover:bg-muted/50" : "cursor-default"}
              disabled:opacity-100
            `}
          >
            {cell !== "" && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {cell}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Your Symbol Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>You are</span>
        <span className="text-2xl">{mySymbol}</span>
      </div>

      {/* Winner Animation */}
      {winningLine && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="text-6xl animate-bounce">
            {board[winningLine[0]] === mySymbol ? "🎉" : "😅"}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OnlineTicTacToeBoard;
