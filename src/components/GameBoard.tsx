import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Smile, SkipForward, Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";
import { useTruthDareEngine } from "@/hooks/useTruthDareEngine";
import { TruthDarePrompt, GameMode, Mood, RelationshipStatus } from "@/data/truthDareContent";

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

const GameBoard = ({
  mode,
  mood = "casual",
  relationshipStatus = "relationship",
  currentPlayer,
  opponent,
  onBack,
}: GameBoardProps) => {
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent">("player");
  const [showCard, setShowCard] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [currentCard, setCurrentCard] = useState<TruthDarePrompt | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Initialize the Truth & Dare engine with game configuration
  const engine = useTruthDareEngine({
    mode: mode as GameMode,
    mood: mood as Mood,
    status: relationshipStatus as RelationshipStatus,
  });

  // Reset engine when game mode/mood changes
  useEffect(() => {
    engine.resetEngine();
  }, [mode, mood, relationshipStatus]);

  const handleSpinWheel = () => {
    setIsSpinning(true);
    
    // Simulate spinning animation delay
    setTimeout(() => {
      // Randomly choose between truth and dare
      const isTruth = Math.random() > 0.5;
      const prompt = engine.getPrompt(isTruth ? "truth" : "dare");
      
      if (prompt) {
        setCurrentCard(prompt);
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
    handleNextTurn();
  };

  const handleSkip = () => {
    engine.onPromptSkipped();
    handleNextTurn();
  };

  const handleNextTurn = () => {
    setShowCard(false);
    setCurrentCard(null);
    setCurrentTurn(currentTurn === "player" ? "opponent" : "player");
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

          {/* Opponent Info (Top Right) */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-foreground">{opponent.name}</p>
              <p className="text-xs text-muted-foreground">
                {opponent.isAI ? "AI Player" : "Opponent"}
              </p>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-secondary/30">
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
        </header>

        {/* Intensity Indicator */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span className="text-xs text-muted-foreground">{engine.getIntensityLabel()}</span>
          </div>
        </div>

        {/* Game Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          {!showCard ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="mb-4 text-muted-foreground">
                {currentTurn === "player" ? "Your turn" : `${opponent.name}'s turn`}
              </p>
              
              {/* Spin Button */}
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
              
              {/* Rounds Played Counter */}
              <p className="mt-2 text-xs text-muted-foreground/60">
                Round {engine.roundsPlayed + 1}
              </p>
            </motion.div>
          ) : (
            <motion.div
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
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col"
                  >
                    {/* Card Type Badge */}
                    <div className={`mx-auto mb-4 rounded-full px-4 py-1 text-sm font-semibold ${
                      currentCard?.type === "truth" 
                        ? "bg-secondary/20 text-secondary" 
                        : "bg-primary/20 text-primary"
                    }`}>
                      {currentCard?.type === "truth" ? "💭 TRUTH" : "🔥 DARE"}
                    </div>

                    {/* Intensity Level Dots */}
                    <div className="flex justify-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            level <= (currentCard?.intensity || 1)
                              ? "bg-secondary"
                              : "bg-border/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 items-center justify-center text-center px-2">
                      <p className="font-display text-lg text-foreground leading-relaxed">
                        {currentCard?.content}
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
                <p className="text-xs text-muted-foreground">You</p>
              </div>
            </div>

            {/* Online Mode: Quick Messages */}
            {mode === "online" && (
              <div className="flex gap-2">
                <Button variant="glass" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default GameBoard;