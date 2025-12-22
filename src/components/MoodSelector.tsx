import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Laugh, Heart, X } from "lucide-react";

interface MoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSelectMood: (mood: "casual" | "intimate") => void;
}

const MoodSelector = ({
  isOpen,
  onClose,
  userName,
  onSelectMood,
}: MoodSelectorProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary"
                >
                  <Heart className="h-8 w-8 text-foreground" />
                </motion.div>

                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Hey {userName}! 💕
                </h2>
                <p className="mt-2 text-muted-foreground">
                  What's the mood for today?
                </p>
              </div>

              {/* Mood Options */}
              <div className="mt-8 grid gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full justify-start gap-4 h-auto py-4"
                    onClick={() => onSelectMood("casual")}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                      <Laugh className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Funny & Casual</div>
                      <div className="text-sm text-muted-foreground">
                        Light-hearted fun and laughter
                      </div>
                    </div>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full justify-start gap-4 h-auto py-4"
                    onClick={() => onSelectMood("intimate")}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Playful & Intimate</div>
                      <div className="text-sm text-muted-foreground">
                        Deeper connection and romance
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoodSelector;