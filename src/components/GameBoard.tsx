import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Smile, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { useState } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";
import { useTruthDareEngine } from "@/hooks/useTruthDareEngine";
import { TruthDarePrompt, GameMode, Mood, RelationshipStatus } from "@/data/truthDareContent";
import TicTacToeBoard from "./TicTacToeBoard";
import TruthDareCard from "./TruthDareCard";
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
type GamePhase = "tic-tac-toe" | "reveal-loser" | "truth-dare" | "round-complete";
const GameBoard = ({
  mode,
  mood = "casual",
  relationshipStatus = "relationship",
  currentPlayer,
  opponent,
  onBack
}: GameBoardProps) => {
  // Game phase management
  const [gamePhase, setGamePhase] = useState<GamePhase>("tic-tac-toe");
  const [ticTacToeTurn, setTicTacToeTurn] = useState<"player" | "opponent">("player");
  const [gameWinner, setGameWinner] = useState<"player" | "opponent" | "draw" | null>(null);
  const [loser, setLoser] = useState<"player" | "opponent" | null>(null);

  // Score tracking
  const [scores, setScores] = useState({
    player: 0,
    opponent: 0
  });
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Truth/Dare state
  const [showCard, setShowCard] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [currentCard, setCurrentCard] = useState<TruthDarePrompt | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Key to force TicTacToeBoard remount
  const [boardKey, setBoardKey] = useState(0);

  // Initialize the Truth & Dare engine with game configuration
  const engine = useTruthDareEngine({
    mode: mode as GameMode,
    mood: mood as Mood,
    status: relationshipStatus as RelationshipStatus
  });

  // Handle Tic Tac Toe move
  const handleTicTacToeMove = () => {
    // Toggle turn after each move
    setTicTacToeTurn(prev => prev === "player" ? "opponent" : "player");
  };

  // Handle Tic Tac Toe game end
  const handleTicTacToeEnd = (winner: "player" | "opponent" | "draw") => {
    setGameWinner(winner);
    if (winner === "draw") {
      // On draw, randomly pick who gets the challenge
      const randomLoser = Math.random() > 0.5 ? "player" : "opponent";
      setLoser(randomLoser);
    } else {
      // Winner gets a point, loser gets the challenge
      if (winner === "player") {
        setScores(prev => ({
          ...prev,
          player: prev.player + 1
        }));
        setLoser("opponent");
      } else {
        setScores(prev => ({
          ...prev,
          opponent: prev.opponent + 1
        }));
        setLoser("player");
      }
    }
    setRoundsPlayed(prev => prev + 1);

    // Transition to reveal phase
    setTimeout(() => {
      setGamePhase("reveal-loser");
    }, 1000);
  };

  // Handle proceeding to Truth/Dare
  const handleProceedToChallenge = () => {
    setGamePhase("truth-dare");
    setShowCard(false);
    setCardRevealed(false);
    setCurrentCard(null);
  };

  // Handle spin wheel for Truth/Dare
  const handleSpinWheel = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const isTruth = Math.random() > 0.5;
      let prompt = engine.getPrompt(isTruth ? "truth" : "dare");

      // If no prompt found, try the other type
      if (!prompt) {
        prompt = engine.getPrompt(isTruth ? "dare" : "truth");
      }
      if (prompt) {
        setCurrentCard(prompt);
        setShowCard(true);
        setCardRevealed(false);
      } else {
        // Fallback: create a default prompt if none found
        const fallbackPrompt: TruthDarePrompt = {
          id: 'fallback_1',
          type: isTruth ? 'truth' : 'dare',
          content: isTruth ? "Share your favorite memory with your partner." : "Give your partner a heartfelt compliment.",
          mode: mode as GameMode,
          mood: mood as Mood,
          status: relationshipStatus as RelationshipStatus,
          intensity: 2,
          category: 'fallback'
        };
        setCurrentCard(fallbackPrompt);
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
  const handleComplete = () => {
    engine.onPromptCompleted();
    setGamePhase("round-complete");
  };
  const handleSkip = () => {
    engine.onPromptSkipped();
    setGamePhase("round-complete");
  };

  // Start new round
  const handleNewRound = () => {
    setGamePhase("tic-tac-toe");
    setGameWinner(null);
    setLoser(null);
    setShowCard(false);
    setCurrentCard(null);
    setCardRevealed(false);
    // Alternate who starts
    setTicTacToeTurn(roundsPlayed % 2 === 0 ? "opponent" : "player");
    // Force TicTacToeBoard remount
    setBoardKey(prev => prev + 1);
  };
  const getLoserName = () => {
    if (loser === "player") return currentPlayer.name;
    return opponent.name;
  };
  const getWinnerName = () => {
    if (gameWinner === "player") return currentPlayer.name;
    if (gameWinner === "opponent") return opponent.name;
    return "Nobody";
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} transition={{
    duration: 0.8
  }} className="fixed inset-0 z-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url(${romanticBg})`
    }}>
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Score Display */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{currentPlayer.name}</p>
              <p className="text-lg font-bold text-secondary">{scores.player}</p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{opponent.name}</p>
              <p className="text-lg font-bold text-primary">{scores.opponent}</p>
            </div>
          </div>

          {/* Opponent Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-foreground">{opponent.name}</p>
              <p className="text-xs text-muted-foreground">
                {opponent.isAI ? "AI Player" : "Opponent"}
              </p>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/30">
              {opponent.photo ? <img src={opponent.photo} alt={opponent.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                  {opponent.isAI ? "🤖" : opponent.name.charAt(0)}
                </div>}
            </div>
          </div>
        </header>

        {/* Round Indicator */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span className="text-xs text-muted-foreground">Round {roundsPlayed + 1}</span>
          </div>
        </div>

        {/* Game Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {/* Phase 1: Tic Tac Toe */}
            {gamePhase === "tic-tac-toe" && <motion.div key="tic-tac-toe" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.9
          }} className="flex flex-col items-center">
                <TicTacToeBoard key={boardKey} playerSymbol="👑" opponentSymbol="❤️" currentTurn={ticTacToeTurn} isAIOpponent={mode === "ai"} onMove={handleTicTacToeMove} onGameEnd={handleTicTacToeEnd} />
              </motion.div>}

            {/* Phase 2: Reveal Loser */}
            {gamePhase === "reveal-loser" && <motion.div key="reveal-loser" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="text-center">
                {gameWinner === "draw" ? <>
                    <div className="text-6xl mb-4">🤝</div>
                    <h2 className="font-display text-2xl text-foreground mb-2">It's a Draw!</h2>
                    <p className="text-muted-foreground mb-6">
                      <span className="text-secondary font-medium">{getLoserName()}</span> was randomly chosen for the challenge
                    </p>
                  </> : <>
                    <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                type: "spring",
                stiffness: 200
              }} className="text-6xl mb-4">
                      <Trophy className="h-16 w-16 mx-auto text-secondary" />
                    </motion.div>
                    <h2 className="font-display text-2xl text-foreground mb-2">
                      <span className="text-gradient-gold">{getWinnerName()}</span> Wins!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      <span className="text-primary font-medium">{getLoserName()}</span> must face a challenge
                    </p>
                  </>}
                
                <Button variant="gold" size="lg" onClick={handleProceedToChallenge} className="mt-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Reveal Challenge
                </Button>
              </motion.div>}

            {/* Phase 3: Truth or Dare */}
            {gamePhase === "truth-dare" && <motion.div key="truth-dare" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.9
          }} className="text-center">
                <p className="mb-2 text-muted-foreground">
                  Challenge for <span className="text-secondary font-medium">{getLoserName()}</span>
                </p>

                {!showCard ? <div className="flex flex-col items-center">
                    {/* Spin Button */}
                    <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} onClick={handleSpinWheel} disabled={isSpinning} className="relative h-40 w-40 rounded-full bg-gradient-to-br from-primary via-secondary to-primary shadow-2xl disabled:opacity-70">
                      <motion.div className="absolute inset-2 flex items-center justify-center rounded-full bg-card" animate={isSpinning ? {
                  rotate: 360
                } : {
                  rotate: 0
                }} transition={isSpinning ? {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear"
                } : {}}>
                        <span className="font-display text-xl font-bold text-foreground">
                          {isSpinning ? "..." : "SPIN"}
                        </span>
                      </motion.div>
                    </motion.button>
                    <p className="mt-6 text-sm text-muted-foreground">
                      Tap to reveal {getLoserName()}'s fate
                    </p>
                  </div> : <TruthDareCard
                    card={currentCard}
                    isRevealed={cardRevealed}
                    onTap={handleCardTap}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                  />}
              </motion.div>}

            {/* Phase 4: Round Complete */}
            {gamePhase === "round-complete" && <motion.div key="round-complete" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="font-display text-2xl text-foreground mb-2">Challenge Complete!</h2>
                <p className="text-muted-foreground mb-6">Ready for the next round?</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center px-6 py-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-xs text-muted-foreground">{currentPlayer.name}</p>
                    <p className="text-2xl font-bold text-secondary">{scores.player}</p>
                  </div>
                  <span className="text-muted-foreground">vs</span>
                  <div className="text-center px-6 py-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-xs text-muted-foreground">{opponent.name}</p>
                    <p className="text-2xl font-bold text-primary">{scores.opponent}</p>
                  </div>
                </div>

                <Button variant="gold" size="lg" onClick={handleNewRound}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Next Round
                </Button>
              </motion.div>}
          </AnimatePresence>
        </main>

        {/* Footer - Player Info & Controls */}
        <footer className="p-4">
          <div className="flex items-center justify-between">
            {/* Current Player Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/30">
                {currentPlayer.photo ? <img src={currentPlayer.photo} alt={currentPlayer.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-semibold text-muted-foreground">
                    {currentPlayer.name.charAt(0)}
                  </div>}
              </div>
              <div>
                <p className="font-medium text-foreground">{currentPlayer.name}</p>
                <p className="text-xs text-muted-foreground">You • 👑</p>
              </div>
            </div>

            {/* Online Mode: Quick Messages */}
            {mode === "online" && <div className="flex gap-2">
                <Button variant="glass" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>}
          </div>
        </footer>
      </div>
    </motion.div>;
};
export default GameBoard;