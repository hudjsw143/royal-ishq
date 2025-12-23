import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SkipForward, Check, Sparkles, Heart, Flame } from "lucide-react";
import { TruthDarePrompt } from "@/data/truthDareContent";

interface TruthDareCardProps {
  card: TruthDarePrompt | null;
  isRevealed: boolean;
  onTap: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

const TruthDareCard = ({ card, isRevealed, onTap, onComplete, onSkip }: TruthDareCardProps) => {
  const isTruth = card?.type === "truth";

  return (
    <div 
      className="perspective-1000 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={!isRevealed ? onTap : undefined}
    >
      <motion.div
        className="relative w-72 h-96"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face - Tap to Reveal */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative h-full w-full bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-3xl shadow-2xl">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-secondary/50 rounded-full" />
              <div className="absolute top-8 left-8 w-8 h-8 border border-primary/50 rounded-full" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-primary/50 rounded-full" />
              <div className="absolute bottom-8 right-8 w-8 h-8 border border-secondary/50 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-border/30 rounded-full" />
            </div>

            {/* Center Content */}
            <div className="relative flex h-full flex-col items-center justify-center p-6">
              {/* Card Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full" />
                  <div className="relative text-7xl">🎴</div>
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="font-display text-xl text-foreground mb-2">Mystery Awaits</h3>
              
              {/* Tap instruction */}
              <motion.p 
                className="text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Tap to reveal your fate
              </motion.p>

              {/* Decorative sparkles */}
              <div className="absolute top-6 right-6">
                <Sparkles className="h-5 w-5 text-secondary/40" />
              </div>
              <div className="absolute bottom-6 left-6">
                <Sparkles className="h-5 w-5 text-primary/40" />
              </div>
            </div>

            {/* Bottom gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          </div>
        </div>

        {/* Back Face - Truth/Dare Content */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className={`relative h-full w-full rounded-3xl shadow-2xl overflow-hidden ${
            isTruth 
              ? "bg-gradient-to-br from-secondary/20 via-card to-card" 
              : "bg-gradient-to-br from-primary/20 via-card to-card"
          }`}>
            {/* Top accent bar */}
            <div className={`h-2 w-full ${
              isTruth 
                ? "bg-gradient-to-r from-secondary/60 via-secondary to-secondary/60" 
                : "bg-gradient-to-r from-primary/60 via-primary to-primary/60"
            }`} />

            {/* Card content */}
            <div className="flex h-full flex-col p-6 pt-4">
              {/* Type Badge */}
              <div className="flex justify-center mb-3">
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                  isTruth 
                    ? "bg-secondary/15 border border-secondary/30" 
                    : "bg-primary/15 border border-primary/30"
                }`}>
                  {isTruth ? (
                    <Heart className="h-4 w-4 text-secondary" />
                  ) : (
                    <Flame className="h-4 w-4 text-primary" />
                  )}
                  <span className={`text-sm font-bold tracking-wider ${
                    isTruth ? "text-secondary" : "text-primary"
                  }`}>
                    {isTruth ? "TRUTH" : "DARE"}
                  </span>
                </div>
              </div>

              {/* Intensity Level */}
              <div className="flex justify-center gap-1.5 mb-4">
                {[1, 2, 3, 4, 5].map(level => (
                  <motion.div 
                    key={level}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + level * 0.1 }}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      level <= (card?.intensity || 1) 
                        ? isTruth ? "bg-secondary" : "bg-primary"
                        : "bg-border/40"
                    }`} 
                  />
                ))}
              </div>

              {/* Main Content */}
              <div className="flex flex-1 items-center justify-center">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-display text-lg text-foreground leading-relaxed text-center px-2"
                >
                  {card?.content}
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3 mt-4"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-border/50 hover:bg-muted/50" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSkip();
                  }}
                >
                  <SkipForward className="h-4 w-4 mr-1.5" />
                  Skip
                </Button>
                <Button 
                  variant={isTruth ? "secondary" : "destructive"}
                  size="sm" 
                  className="flex-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Done
                </Button>
              </motion.div>
            </div>

            {/* Decorative corners */}
            <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg ${
              isTruth ? "border-secondary/30" : "border-primary/30"
            }`} />
            <div className={`absolute bottom-16 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg ${
              isTruth ? "border-secondary/30" : "border-primary/30"
            }`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TruthDareCard;
