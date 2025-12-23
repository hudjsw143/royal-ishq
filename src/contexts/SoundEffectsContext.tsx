import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { playSoundEffect } from "@/hooks/useSoundEffects";
import { SoundType } from "@/data/gameSounds";

interface SoundEffectsContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundName: SoundType) => void;
}

const SoundEffectsContext = createContext<SoundEffectsContextType | undefined>(undefined);

export const SoundEffectsProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playSound = useCallback((soundName: SoundType) => {
    if (!isMuted) {
      playSoundEffect(soundName);
    }
  }, [isMuted]);

  return (
    <SoundEffectsContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundEffectsContext.Provider>
  );
};

export const useSoundEffects = () => {
  const context = useContext(SoundEffectsContext);
  if (!context) {
    throw new Error("useSoundEffects must be used within a SoundEffectsProvider");
  }
  return context;
};
