import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Smile, SkipForward, Check, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";
import { useTruthDareEngine } from "@/hooks/useTruthDareEngine";
import { TruthDarePrompt, GameMode, Mood, RelationshipStatus } from "@/data/truthDareContent";
import TicTacToeBoard, { checkWinner, checkDraw, getAIMove } from "./TicTacToeBoard";

interface PlayerInfo {
  name: string;
  photo: string | null;
  isAI?: boolean;
}

interface GameBoardProps {
  mode: "offline" | "ai" | "online";
  mood?: "casual" | "intimate";
  relationshipStatus?: "relationship" | "married";
  currentPlayer: PlayerInfo;
  opponent: PlayerInfo;
  onBack: () => void;
}

type CellValue = "X" | "O" | null;
type GamePhase = "tic-tac-toe" | "reveal-loser" | "truth-dare" | "round-complete";

const GameBoard = ({
  mode,
  mood = "casual",
  relationshipStatus = "relationship",
  currentPlayer,
  opponent,
  onBack,
}: GameBoardProps) => {
  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("tic-tac-toe");
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [loser, setLoser] = useState<"player" | "opponent" | null>(null);
  
  // Scores
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  
  // Truth or Dare state
  const [currentCard, setCurrentCard] = useState<TruthDarePrompt | null>(null);
  const [cardRevealed, setCardRevealed] = useState(false);

  // Player symbols: Player is always X (👑), Opponent is O (❤️)
  const playerSymbol: "X" | "O" = "X";
  const opponentSymbol: "X" | "O" = "O";

  // Initialize the Truth & Dare engine
  const engine = useTruthDareEngine({
    mode: mode as GameMode,
    mood: mood as Mood,
    status: relationshipStatus as RelationshipStatus,
  });

  // Handle cell click in Tic Tac Toe
  const handleCellClick = useCallback((index: number) => {
    if (board[index] || winner || gamePhase !== "tic-tac-toe") return;

    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);

    // Check for winner
    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Determine loser
      if (result.winner === playerSymbol) {
        setLoser("opponent");
        setPlayerScore((prev) => prev + 1);
      } else {
        setLoser("player");
        setOpponentScore((prev) => prev + 1);
      }
      
      // Transition to reveal loser phase
      setTimeout(() => setGamePhase("reveal-loser"), 1500);
    } else if (checkDraw(newBoard)) {
      setWinner("draw");
      setTimeout(() => {
        // On draw, randomly pick who gets the challenge
        const randomLoser = Math.random() > 0.5 ? "player" : "opponent";
        setLoser(randomLoser);
        setGamePhase("reveal-loser");
      }, 1500);
    } else {
      // Switch turns
      setCurrentTurn(currentTurn === "X" ? "O" : "X");
    }
  }, [board, currentTurn, winner, gamePhase, playerSymbol]);

  // AI Move Logic
  useEffect(() => {
    if (
      mode === "ai" &&
      currentTurn === opponentSymbol &&
      gamePhase === "tic-tac-toe" &&
      !winner
    ) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, opponentSymbol);
        if (aiMove !== -1) {
          handleCellClick(aiMove);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [mode, currentTurn, gamePhase, board, winner, opponentSymbol, handleCellClick]);

  // Handle proceeding to Truth or Dare
  const handleProceedToChallenge = () => {
    const isTruth = Math.random() > 0.5;
    const prompt = engine.getPrompt(isTruth ? "truth" : "dare");
    
    if (prompt) {
      setCurrentCard(prompt);
      setCardRevealed(false);
      setGamePhase("truth-dare");
    }
  };

  // Handle card tap to reveal
  const handleCardTap = () => {
    if (!cardRevealed) {
      setCardRevealed(true);
    }
  };

  // Handle challenge completion
  const handleComplete = () => {
    engine.onPromptCompleted();
    setGamePhase("round-complete");
  };

  // Handle challenge skip
  const handleSkip = () => {
    engine.onPromptSkipped();
    setGamePhase("round-complete");
  };

  // Start new round
  const handleNextRound = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setWinningLine(null);
    setWinner(null);
    setLoser(null);
    setCurrentCard(null);
    setCardRevealed(false);
    setRoundNumber((prev) => prev + 1);
    setGamePhase("tic-tac-toe");
  };

  // Get current turn display name
  const getCurrentTurnName = () => {
    if (currentTurn === playerSymbol) return currentPlayer.name;
    return opponent.name;
  };

  // Get loser info
  const getLoserInfo = () => {
    if (loser === "player") return currentPlayer;
    return opponent;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-40 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${romanticBg})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Score Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
              <span className="text-sm font-medium text-foreground">{currentPlayer.name.split(' ')[0]}</span>
              <span className="text-secondary font-bold">{playerScore}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-primary font-bold">{opponentScore}</span>
              <span className="text-sm font-medium text-foreground">{opponent.name.split(' ')[0]}</span>
            </div>
          </div>

          {/* Round Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span className="text-xs text-muted-foreground">Round {roundNumber}</span>
          </div>
        </header>

        {/* Game Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {/* TIC TAC TOE PHASE */}
            {gamePhase === "tic-tac-toe" && (
              <motion.div
                key="tictactoe"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                {/* Turn Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-center"
                >
                  <p className="text-muted-foreground text-sm mb-1">
                    {winner ? (winner === "draw" ? "It's a draw!" : `${winner === playerSymbol ? currentPlayer.name : opponent.name} wins!`) : "Current Turn"}
                  </p>
                  <p className="font-display text-xl text-foreground">
                    {!winner && (
                      <>
                        <span className="text-2xl mr-2">{currentTurn === "X" ? "👑" : "❤️"}</span>
                        {getCurrentTurnName()}
                      </>
                    )}
                  </p>
                </motion.div>

                {/* Board */}
                <TicTacToeBoard
                  currentPlayer={currentTurn}
                  isPlayerTurn={currentTurn === playerSymbol}
                  onCellClick={handleCellClick}
                  board={board}
                  winningLine={winningLine}
                  disabled={!!winner || (mode === "ai" && currentTurn === opponentSymbol)}
                />

                {/* Legend */}
                <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <span>{currentPlayer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">❤️</span>
                    <span>{opponent.name}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVEAL LOSER PHASE */}
            {gamePhase === "reveal-loser" && loser && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-center"
              >
                {winner === "draw" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🤝
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Trophy className="h-16 w-16 text-secondary mb-4" />
                  </motion.div>
                )}

                <h2 className="font-display text-2xl text-foreground mb-2">
                  {winner === "draw" ? "It's a Draw!" : `${winner === playerSymbol ? currentPlayer.name : opponent.name} Wins!`}
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <p className="text-muted-foreground mb-2">
                    {winner === "draw" ? "Fate has chosen..." : "The loser must face their destiny..."}
                  </p>
                  
                  {/* Loser Avatar */}
                  <div className="flex flex-col items-center mt-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.8 }}
                      className="relative"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-primary shadow-lg">
                        {getLoserInfo().photo ? (
                          <img
                            src={getLoserInfo().photo!}
                            alt={getLoserInfo().name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-semibold text-muted-foreground">
                            {getLoserInfo().isAI ? "🤖" : getLoserInfo().name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-2 -right-2 text-2xl"
                      >
                        🎯
                      </motion.div>
                    </motion.div>
                    
                    <p className="mt-3 font-display text-lg text-foreground">
                      {getLoserInfo().name}
                    </p>
                    <p className="text-sm text-primary">Must complete the challenge!</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8"
                >
                  <Button variant="gold" size="lg" onClick={handleProceedToChallenge}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Reveal Challenge
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* TRUTH OR DARE PHASE */}
            {gamePhase === "truth-dare" && currentCard && (
              <motion.div
                key="truthdare"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: cardRevealed ? 0 : 180, opacity: 1 }}
                transition={{ duration: 0.6 }}
                onClick={handleCardTap}
                className="perspective-1000 cursor-pointer"
              >
                <div className="glass-card relative h-96 w-72 overflow-hidden rounded-3xl p-6 shadow-2xl">
                  {!cardRevealed ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="text-6xl mb-4">🎴</div>
                      <p className="text-muted-foreground">Tap to reveal</p>
                      <p className="text-sm text-secondary mt-2">
                        Challenge for {getLoserInfo().name}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full flex-col"
                    >
                      {/* Card Type Badge */}
                      <div className={`mx-auto mb-4 rounded-full px-4 py-1 text-sm font-semibold ${
                        currentCard.type === "truth" 
                          ? "bg-secondary/20 text-secondary" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        {currentCard.type === "truth" ? "💭 TRUTH" : "🔥 DARE"}
                      </div>

                      {/* For whom */}
                      <p className="text-center text-xs text-muted-foreground mb-3">
                        Challenge for <span className="text-secondary">{getLoserInfo().name}</span>
                      </p>

                      {/* Intensity Level Dots */}
                      <div className="flex justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                              level <= (currentCard.intensity || 1)
                                ? "bg-secondary"
                                : "bg-border/30"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-1 items-center justify-center text-center px-2">
                        <p className="font-display text-lg text-foreground leading-relaxed">
                          {currentCard.content}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="glass"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkip();
                          }}
                        >
                          <SkipForward className="h-4 w-4 mr-1" />
                          Skip
                        </Button>
                        <Button
                          variant="gold"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete();
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ROUND COMPLETE PHASE */}
            {gamePhase === "round-complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>

                <h2 className="font-display text-2xl text-foreground mb-2">
                  Round {roundNumber} Complete!
                </h2>

                <p className="text-muted-foreground mb-6">
                  Ready for the next round?
                </p>

                {/* Score Summary */}
                <div className="flex items-center gap-6 mb-8 px-6 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{currentPlayer.name}</p>
                    <p className="text-3xl font-bold text-secondary">{playerScore}</p>
                  </div>
                  <div className="text-2xl text-muted-foreground">vs</div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{opponent.name}</p>
                    <p className="text-3xl font-bold text-primary">{opponentScore}</p>
                  </div>
                </div>

                <Button variant="gold" size="lg" onClick={handleNextRound}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer - Player Info & Controls */}
        <footer className="p-4">
          <div className="flex items-center justify-between">
            {/* Current Player Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/30">
                {currentPlayer.photo ? (
                  <img
                    src={currentPlayer.photo}
                    alt={currentPlayer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                    {currentPlayer.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{currentPlayer.name}</p>
                <p className="text-xs text-muted-foreground">👑 You</p>
              </div>
            </div>

            {/* Intensity Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
              <Sparkles className="h-3 w-3 text-secondary" />
              <span className="text-xs text-muted-foreground">{engine.getIntensityLabel()}</span>
            </div>

            {/* Opponent Info */}
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-foreground text-right">{opponent.name}</p>
                <p className="text-xs text-muted-foreground text-right">❤️ {opponent.isAI ? "AI" : "Opponent"}</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/30">
                {opponent.photo ? (
                  <img
                    src={opponent.photo}
                    alt={opponent.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                    {opponent.isAI ? "🤖" : opponent.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default GameBoard;
