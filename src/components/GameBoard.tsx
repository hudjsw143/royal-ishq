import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Home, MessageCircle, Smile } from "lucide-react";
import { useState } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";

interface PlayerInfo {
  name: string;
  photo: string | null;
  isAI?: boolean;
}

interface GameBoardProps {
  mode: "offline" | "ai" | "online";
  mood?: "casual" | "intimate";
  currentPlayer: PlayerInfo;
  opponent: PlayerInfo;
  onBack: () => void;
}

const GameBoard = ({
  mode,
  mood,
  currentPlayer,
  opponent,
  onBack,
}: GameBoardProps) => {
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent">("player");
  const [showCard, setShowCard] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [currentCard, setCurrentCard] = useState<{type: "truth" | "dare", content: string} | null>(null);

  const sampleTruths = mood === "intimate" ? [
    "What's the most romantic thing your partner has ever done for you?",
    "What moment made you realize you were truly in love?",
    "What's something you've never told your partner but want to?",
  ] : [
    "What's the funniest thing that happened on your first date?",
    "What's the weirdest thing you find attractive about your partner?",
    "What's the most embarrassing thing you've done to impress your partner?",
  ];

  const sampleDares = mood === "intimate" ? [
    "Give your partner a 30-second romantic compliment without laughing",
    "Look into your partner's eyes for 60 seconds without speaking",
    "Write a love note to your partner right now",
  ] : [
    "Do your best impression of your partner",
    "Show the last photo you took of your partner",
    "Sing your partner's favorite song dramatically",
  ];

  const handleSpinWheel = () => {
    const isTruth = Math.random() > 0.5;
    const contents = isTruth ? sampleTruths : sampleDares;
    const randomContent = contents[Math.floor(Math.random() * contents.length)];
    
    setCurrentCard({
      type: isTruth ? "truth" : "dare",
      content: randomContent,
    });
    setShowCard(true);
    setCardRevealed(false);
  };

  const handleCardTap = () => {
    if (!cardRevealed) {
      setCardRevealed(true);
    }
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
                className="relative h-40 w-40 rounded-full bg-gradient-to-br from-primary via-secondary to-primary shadow-2xl"
              >
                <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card">
                  <span className="font-display text-xl font-bold text-foreground">
                    SPIN
                  </span>
                </div>
              </motion.button>

              <p className="mt-6 text-sm text-muted-foreground">
                Tap to reveal your fate
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
              <div className="glass-card relative h-80 w-64 overflow-hidden rounded-3xl p-6 shadow-2xl">
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
                      {currentCard?.type === "truth" ? "TRUTH" : "DARE"}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 items-center justify-center text-center">
                      <p className="font-display text-lg text-foreground leading-relaxed">
                        {currentCard?.content}
                      </p>
                    </div>

                    {/* Complete Button */}
                    <Button
                      variant="gold"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextTurn();
                      }}
                    >
                      Complete & Next Turn
                    </Button>
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