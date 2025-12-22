import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Trophy, RotateCcw, SkipForward, Check, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";
import { useOnlineGame, RoomData } from "@/hooks/useOnlineGame";
import OnlineTicTacToeBoard from "./OnlineTicTacToeBoard";
import { ALL_PROMPTS, TruthDarePrompt } from "@/data/truthDareContent";
import { toast } from "sonner";

interface PlayerInfo {
  name: string;
  photo: string | null;
}

interface OnlineGameBoardProps {
  roomCode: string;
  isHost: boolean;
  currentPlayer: PlayerInfo;
  onBack: () => void;
}

const OnlineGameBoard = ({
  roomCode,
  isHost,
  currentPlayer,
  onBack,
}: OnlineGameBoardProps) => {
  const {
    roomData,
    opponentConnected,
    makeMove,
    updateGamePhase,
    setCurrentCard,
    updateScores,
    startNewRound,
    leaveRoom,
  } = useOnlineGame();

  const [showCard, setShowCard] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [disconnectWarning, setDisconnectWarning] = useState(false);

  // Reconnect to room on mount
  useEffect(() => {
    // The hook manages subscription based on roomCode
  }, [roomCode]);

  // Show disconnect warning
  useEffect(() => {
    if (!opponentConnected && roomData?.gameState.gamePhase !== "waiting") {
      setDisconnectWarning(true);
      toast.warning("Your partner disconnected");
    } else {
      setDisconnectWarning(false);
    }
  }, [opponentConnected, roomData]);

  const handleBack = async () => {
    await leaveRoom();
    onBack();
  };

  if (!roomData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    );
  }

  const gamePhase = roomData.gameState.gamePhase;
  const scores = roomData.gameState.scores;
  const opponentInfo = isHost ? roomData.guest : roomData.host;

  const getLoserName = () => {
    const loser = roomData.gameState.loser;
    if (!loser) return "";
    if (loser === "host") return roomData.host.name;
    return roomData.guest?.name || "Partner";
  };

  const getWinnerName = () => {
    const winner = roomData.gameState.winner;
    if (winner === "draw") return "Nobody";
    if (winner === "host") return roomData.host.name;
    return roomData.guest?.name || "Partner";
  };

  const amILoser = () => {
    const loser = roomData.gameState.loser;
    return (isHost && loser === "host") || (!isHost && loser === "guest");
  };

  const handleProceedToChallenge = async () => {
    // Update scores based on winner
    const winner = roomData.gameState.winner;
    if (winner && winner !== "draw") {
      await updateScores(winner);
    }
    await updateGamePhase("truth-dare");
  };

  const handleSpinWheel = async () => {
    setIsSpinning(true);
    
    setTimeout(async () => {
      const isTruth = Math.random() > 0.5;
      const type = isTruth ? "truth" : "dare";
      
      // Get random prompt
      const mood = roomData.mood || "casual";
      const status = roomData.status || "relationship";
      
      const filteredPrompts = ALL_PROMPTS.filter(
        p => p.type === type && p.mood === mood && p.status === status
      );
      
      const randomPrompt = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
      
      if (randomPrompt) {
        await setCurrentCard({
          type: randomPrompt.type,
          content: randomPrompt.content,
          intensity: randomPrompt.intensity,
        });
        setShowCard(true);
        setCardRevealed(false);
      }
      setIsSpinning(false);
    }, 800);
  };

  const handleCardTap = () => {
    if (!cardRevealed) {
      setCardRevealed(true);
    }
  };

  const handleComplete = async () => {
    await updateGamePhase("round-complete");
    setShowCard(false);
    setCardRevealed(false);
  };

  const handleSkip = async () => {
    await updateGamePhase("round-complete");
    setShowCard(false);
    setCardRevealed(false);
  };

  const handleNewRound = async () => {
    await startNewRound();
    setShowCard(false);
    setCardRevealed(false);
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
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Score Display */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{roomData.host.name}</p>
              <p className="text-lg font-bold text-secondary">{scores.host}</p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{roomData.guest?.name || "Partner"}</p>
              <p className="text-lg font-bold text-primary">{scores.guest}</p>
            </div>
          </div>

          {/* Opponent Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-foreground">{opponentInfo?.name || "Partner"}</p>
              <div className="flex items-center justify-end gap-1 text-xs">
                {opponentConnected ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">Offline</span>
                  </>
                )}
              </div>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/30">
              {opponentInfo?.photo ? (
                <img
                  src={opponentInfo.photo}
                  alt={opponentInfo.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                  {opponentInfo?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Round Indicator */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span className="text-xs text-muted-foreground">Round {roomData.gameState.roundsPlayed + 1}</span>
          </div>
        </div>

        {/* Disconnect Warning */}
        {disconnectWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 text-destructive">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Partner disconnected - waiting for reconnection...</span>
            </div>
          </motion.div>
        )}

        {/* Game Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {/* Phase 1: Tic Tac Toe */}
            {gamePhase === "tic-tac-toe" && (
              <motion.div
                key="tic-tac-toe"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <OnlineTicTacToeBoard
                  roomData={roomData}
                  isHost={isHost}
                  onMove={makeMove}
                  disabled={disconnectWarning}
                />
              </motion.div>
            )}

            {/* Phase 2: Reveal Loser */}
            {gamePhase === "reveal-loser" && (
              <motion.div
                key="reveal-loser"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {roomData.gameState.winner === "draw" ? (
                  <>
                    <div className="text-6xl mb-4">🤝</div>
                    <h2 className="font-display text-2xl text-foreground mb-2">It's a Draw!</h2>
                    <p className="text-muted-foreground mb-6">
                      <span className="text-secondary font-medium">{getLoserName()}</span> was randomly chosen for the challenge
                    </p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      <Trophy className="h-16 w-16 mx-auto text-secondary" />
                    </motion.div>
                    <h2 className="font-display text-2xl text-foreground mb-2">
                      <span className="text-gradient-gold">{getWinnerName()}</span> Wins!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      <span className="text-primary font-medium">{getLoserName()}</span> must face a challenge
                    </p>
                  </>
                )}
                
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleProceedToChallenge}
                  className="mt-4"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Reveal Challenge
                </Button>
              </motion.div>
            )}

            {/* Phase 3: Truth or Dare */}
            {gamePhase === "truth-dare" && (
              <motion.div
                key="truth-dare"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <p className="mb-2 text-muted-foreground">
                  Challenge for <span className="text-secondary font-medium">{getLoserName()}</span>
                  {amILoser() && <span className="text-primary ml-1">(You!)</span>}
                </p>

                {!showCard && !roomData.gameState.currentCard ? (
                  <div className="flex flex-col items-center">
                    {/* Only the loser can spin */}
                    {amILoser() ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSpinWheel}
                          disabled={isSpinning}
                          className="relative h-40 w-40 rounded-full bg-gradient-to-br from-primary via-secondary to-primary shadow-2xl disabled:opacity-70"
                        >
                          <motion.div 
                            className="absolute inset-2 flex items-center justify-center rounded-full bg-card"
                            animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                            transition={isSpinning ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                          >
                            <span className="font-display text-xl font-bold text-foreground">
                              {isSpinning ? "..." : "SPIN"}
                            </span>
                          </motion.div>
                        </motion.button>
                        <p className="mt-6 text-sm text-muted-foreground">
                          Tap to reveal your fate
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4 animate-pulse">⏳</div>
                        <p className="text-muted-foreground">
                          Waiting for {getLoserName()} to spin...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: cardRevealed || roomData.gameState.currentCard ? 0 : 180, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    onClick={handleCardTap}
                    className="perspective-1000 cursor-pointer"
                  >
                    <div className="glass-card relative h-96 w-72 overflow-hidden rounded-3xl p-6 shadow-2xl">
                      {!cardRevealed && !roomData.gameState.currentCard ? (
                        <div className="flex h-full flex-col items-center justify-center">
                          <div className="text-6xl mb-4">🎴</div>
                          <p className="text-muted-foreground">Tap to reveal</p>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex h-full flex-col"
                        >
                          {/* Card Type Badge */}
                          <div className={`mx-auto mb-4 rounded-full px-4 py-1 text-sm font-semibold ${
                            roomData.gameState.currentCard?.type === "truth" 
                              ? "bg-secondary/20 text-secondary" 
                              : "bg-primary/20 text-primary"
                          }`}>
                            {roomData.gameState.currentCard?.type === "truth" ? "💭 TRUTH" : "🔥 DARE"}
                          </div>

                          {/* Intensity Level Dots */}
                          <div className="flex justify-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                  level <= (roomData.gameState.currentCard?.intensity || 1)
                                    ? "bg-secondary"
                                    : "bg-border/30"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Card Content */}
                          <div className="flex flex-1 items-center justify-center text-center px-2">
                            <p className="font-display text-lg text-foreground leading-relaxed">
                              {roomData.gameState.currentCard?.content}
                            </p>
                          </div>

                          {/* Action Buttons - Only loser can complete/skip */}
                          {amILoser() && (
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
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Phase 4: Round Complete */}
            {gamePhase === "round-complete" && (
              <motion.div
                key="round-complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">✨</div>
                <h2 className="font-display text-2xl text-foreground mb-2">Challenge Complete!</h2>
                <p className="text-muted-foreground mb-6">Ready for the next round?</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center px-6 py-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-xs text-muted-foreground">{roomData.host.name}</p>
                    <p className="text-2xl font-bold text-secondary">{scores.host}</p>
                  </div>
                  <span className="text-muted-foreground">vs</span>
                  <div className="text-center px-6 py-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-xs text-muted-foreground">{roomData.guest?.name || "Partner"}</p>
                    <p className="text-2xl font-bold text-primary">{scores.guest}</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Leave Game
                  </Button>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleNewRound}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Round
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/50">
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
                <p className="text-xs text-muted-foreground">
                  You are {isHost ? "👑" : "❤️"}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default OnlineGameBoard;
