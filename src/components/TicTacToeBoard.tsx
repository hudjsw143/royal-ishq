import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type CellValue = "X" | "O" | null;
type BoardState = CellValue[];

interface TicTacToeBoardProps {
  currentPlayer: "X" | "O";
  isPlayerTurn: boolean;
  onCellClick: (index: number) => void;
  board: BoardState;
  winningLine: number[] | null;
  disabled?: boolean;
}

const TicTacToeBoard = ({
  currentPlayer,
  isPlayerTurn,
  onCellClick,
  board,
  winningLine,
  disabled = false,
}: TicTacToeBoardProps) => {
  const isWinningCell = (index: number) => winningLine?.includes(index);

  const getCellContent = (value: CellValue, index: number) => {
    if (!value) return null;

    const isWinner = isWinningCell(index);

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`flex h-full w-full items-center justify-center text-4xl sm:text-5xl font-bold ${
          value === "X" 
            ? isWinner ? "text-secondary animate-pulse" : "text-secondary" 
            : isWinner ? "text-primary animate-pulse" : "text-primary"
        }`}
      >
        {value === "X" ? "👑" : "❤️"}
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Board */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            whileHover={!cell && !disabled && isPlayerTurn ? { scale: 1.05 } : {}}
            whileTap={!cell && !disabled && isPlayerTurn ? { scale: 0.95 } : {}}
            onClick={() => !cell && !disabled && isPlayerTurn && onCellClick(index)}
            disabled={!!cell || disabled || !isPlayerTurn}
            className={`
              relative aspect-square w-20 sm:w-24 rounded-xl 
              transition-all duration-200
              ${isWinningCell(index) 
                ? "bg-secondary/20 border-2 border-secondary shadow-gold" 
                : "bg-muted/50 border border-border/50 hover:border-secondary/50"
              }
              ${!cell && !disabled && isPlayerTurn 
                ? "cursor-pointer hover:bg-muted" 
                : "cursor-default"
              }
            `}
          >
            {getCellContent(cell, index)}
            
            {/* Hover hint */}
            {!cell && !disabled && isPlayerTurn && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity">
                <span className="text-3xl">
                  {currentPlayer === "X" ? "👑" : "❤️"}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Winning line overlay */}
      {winningLine && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] rounded-2xl" />
        </motion.div>
      )}
    </div>
  );
};

// Utility functions for game logic
export const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

export const checkWinner = (board: BoardState): { winner: CellValue; line: number[] | null } => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combination };
    }
  }
  return { winner: null, line: null };
};

export const checkDraw = (board: BoardState): boolean => {
  return board.every((cell) => cell !== null) && !checkWinner(board).winner;
};

export const getAIMove = (board: BoardState, aiSymbol: "X" | "O"): number => {
  const playerSymbol = aiSymbol === "X" ? "O" : "X";
  const emptyCells = board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1);

  if (emptyCells.length === 0) return -1;

  // Try to win
  for (const index of emptyCells) {
    const testBoard = [...board];
    testBoard[index] = aiSymbol;
    if (checkWinner(testBoard).winner === aiSymbol) {
      return index;
    }
  }

  // Block player from winning
  for (const index of emptyCells) {
    const testBoard = [...board];
    testBoard[index] = playerSymbol;
    if (checkWinner(testBoard).winner === playerSymbol) {
      return index;
    }
  }

  // Take center if available
  if (board[4] === null) return 4;

  // Take a corner
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Take any available cell
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export default TicTacToeBoard;
