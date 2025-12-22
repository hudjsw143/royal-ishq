import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomQuote } from "@/data/loveQuotes";
import romanticBg from "@/assets/romantic-bg.jpg";

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [quote] = useState(getRandomQuote());
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start showing content after a brief delay
    const contentTimer = setTimeout(() => setShowContent(true), 300);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    // Complete boot after animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${romanticBg})` }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="font-display text-5xl font-bold tracking-wide sm:text-6xl md:text-7xl">
              <span className="text-gradient-gold">Royal</span>{" "}
              <span className="text-foreground">Ishq</span>
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={showContent ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mx-auto mt-4 h-0.5 w-32 bg-gradient-to-r from-transparent via-secondary to-transparent"
            />
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mb-12 max-w-md"
          >
            <p className="font-display text-lg italic text-muted-foreground sm:text-xl">
              "{quote}"
            </p>
          </motion.div>

          {/* Loading Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-64 sm:w-80"
          >
            <div className="relative h-2 overflow-hidden rounded-full bg-muted/50">
              {/* Progress fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer effect */}
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-secondary/30 to-transparent bg-[length:200%_100%]" />
            </div>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Loading your love story...
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 0.3 } : {}}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary blur-[100px]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;