import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface TicTacToeBoardProps {
  playerSymbol: "👑" | "❤️";
  opponentSymbol: "👑" | "❤️";
  currentTurn: "player" | "opponent";
  isAIOpponent?: boolean;
  onMove: (index: number) => void;
  onGameEnd: (winner: "player" | "opponent" | "draw") => void;
  disabled?: boolean;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Anti-diagonal
];

const TicTacToeBoard = ({
  playerSymbol,
  opponentSymbol,
  currentTurn,
  isAIOpponent = false,
  onMove,
  onGameEnd,
  disabled = false,
}: TicTacToeBoardProps) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  const checkWinner = useCallback((currentBoard: (string | null)[]): { winner: string | null; line: number[] | null } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combination };
      }
    }
    return { winner: null, line: null };
  }, []);

  const isBoardFull = useCallback((currentBoard: (string | null)[]): boolean => {
    return currentBoard.every(cell => cell !== null);
  }, []);

  // AI Move Logic
  const getAIMove = useCallback((currentBoard: (string | null)[]): number => {
    const aiSymbol = opponentSymbol;
    const playerSym = playerSymbol;

    // 1. Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = aiSymbol;
        if (checkWinner(testBoard).winner === aiSymbol) {
          return i;
        }
      }
    }

    // 2. Block player from winning
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = playerSym;
        if (checkWinner(testBoard).winner === playerSym) {
          return i;
        }
      }
    }

    // 3. Take center
    if (!currentBoard[4]) return 4;

    // 4. Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !currentBoard[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take any available
    const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
  }, [opponentSymbol, playerSymbol, checkWinner]);

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (board[index] || gameEnded || disabled) return;
    if (currentTurn === "opponent" && isAIOpponent) return;
    if (currentTurn !== "player") return;

    const symbol = playerSymbol;
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    onMove(index);

    const { winner, line } = checkWinner(newBoard);
    if (winner) {
      setWinningLine(line);
      setGameEnded(true);
      setTimeout(() => onGameEnd("player"), 500);
    } else if (isBoardFull(newBoard)) {
      setGameEnded(true);
      setTimeout(() => onGameEnd("draw"), 500);
    }
  };

  // AI Move Effect
  useEffect(() => {
    if (currentTurn === "opponent" && isAIOpponent && !gameEnded && !disabled) {
      const timer = setTimeout(() => {
        const aiIndex = getAIMove(board);
        if (aiIndex !== undefined && aiIndex >= 0) {
          const newBoard = [...board];
          newBoard[aiIndex] = opponentSymbol;
          setBoard(newBoard);
          onMove(aiIndex);

          const { winner, line } = checkWinner(newBoard);
          if (winner) {
            setWinningLine(line);
            setGameEnded(true);
            setTimeout(() => onGameEnd("opponent"), 500);
          } else if (isBoardFull(newBoard)) {
            setGameEnded(true);
            setTimeout(() => onGameEnd("draw"), 500);
          }
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, isAIOpponent, gameEnded, disabled, board, getAIMove, opponentSymbol, onMove, checkWinner, isBoardFull, onGameEnd]);

  // Handle opponent move in offline/online mode
  useEffect(() => {
    if (currentTurn === "opponent" && !isAIOpponent && !gameEnded && !disabled) {
      // In offline mode, opponent can click directly
    }
  }, [currentTurn, isAIOpponent, gameEnded, disabled]);

  const handleOpponentClick = (index: number) => {
    if (board[index] || gameEnded || disabled) return;
    if (currentTurn !== "opponent" || isAIOpponent) return;

    const symbol = opponentSymbol;
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    onMove(index);

    const { winner, line } = checkWinner(newBoard);
    if (winner) {
      setWinningLine(line);
      setGameEnded(true);
      setTimeout(() => onGameEnd("opponent"), 500);
    } else if (isBoardFull(newBoard)) {
      setGameEnded(true);
      setTimeout(() => onGameEnd("draw"), 500);
    }
  };

  const handleClick = (index: number) => {
    if (currentTurn === "player") {
      handleCellClick(index);
    } else if (!isAIOpponent) {
      handleOpponentClick(index);
    }
  };

  // Reset board when game restarts
  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setWinningLine(null);
    setGameEnded(false);
  };

  // Expose reset via ref or callback if needed
  useEffect(() => {
    if (disabled && !gameEnded) {
      // Reset for new game
      resetBoard();
    }
  }, [disabled]);

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
          {currentTurn === "player" ? "Your turn" : "Opponent's turn"}
        </p>
        <p className="text-3xl mt-1">
          {currentTurn === "player" ? playerSymbol : opponentSymbol}
        </p>
      </motion.div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-primary/10 backdrop-blur-sm border-2 border-secondary/40 shadow-lg">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!cell || gameEnded || disabled}
            whileHover={!cell && !gameEnded && !disabled ? { scale: 1.05 } : {}}
            whileTap={!cell && !gameEnded && !disabled ? { scale: 0.95 } : {}}
            className={`
              h-20 w-20 sm:h-24 sm:w-24 rounded-xl text-4xl sm:text-5xl
              flex items-center justify-center
              transition-all duration-200
              ${winningLine?.includes(index) 
                ? "bg-secondary/30 border-secondary shadow-gold" 
                : "bg-card/80 border-border/50 hover:border-secondary/50"
              }
              border-2
              ${!cell && !gameEnded && !disabled ? "cursor-pointer hover:bg-muted/50" : "cursor-default"}
              disabled:opacity-100
            `}
          >
            {cell && (
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

      {/* Winner Animation Overlay */}
      {winningLine && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="text-6xl animate-bounce">
            {board[winningLine[0]] === playerSymbol ? "🎉" : "😅"}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TicTacToeBoard;
