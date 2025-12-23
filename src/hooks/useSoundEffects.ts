import { useCallback, useRef, useEffect } from "react";
import { GAME_SOUNDS, SoundType } from "@/data/gameSounds";

const SFX_VOLUME = 0.8; // 80% volume for sound effects

export const useSoundEffects = () => {
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const isEnabledRef = useRef(true);

  // Preload common sounds
  useEffect(() => {
    const preloadSounds: SoundType[] = ["buttonClick", "move", "win", "lose"];
    
    preloadSounds.forEach((soundName) => {
      const url = GAME_SOUNDS[soundName];
      if (!audioCache.current.has(url)) {
        const audio = new Audio(url);
        audio.preload = "auto";
        audio.volume = SFX_VOLUME;
        audioCache.current.set(url, audio);
      }
    });
  }, []);

  const playSound = useCallback((soundName: SoundType) => {
    if (!isEnabledRef.current) return;

    const url = GAME_SOUNDS[soundName];
    if (!url) return;

    try {
      // Check cache first
      let audio = audioCache.current.get(url);
      
      if (audio) {
        // Reset and play cached audio
        audio.currentTime = 0;
        audio.volume = SFX_VOLUME;
        audio.play().catch(console.error);
      } else {
        // Create new audio element
        audio = new Audio(url);
        audio.volume = SFX_VOLUME;
        audioCache.current.set(url, audio);
        audio.play().catch(console.error);
      }
    } catch (err) {
      console.error("Error playing sound:", err);
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  return { playSound, setEnabled };
};

// Singleton instance for components that don't use hooks
let globalAudioCache: Map<string, HTMLAudioElement> | null = null;

export const playSoundEffect = (soundName: SoundType) => {
  const url = GAME_SOUNDS[soundName];
  if (!url) return;

  try {
    if (!globalAudioCache) {
      globalAudioCache = new Map();
    }

    let audio = globalAudioCache.get(url);
    
    if (audio) {
      audio.currentTime = 0;
      audio.volume = SFX_VOLUME;
      audio.play().catch(console.error);
    } else {
      audio = new Audio(url);
      audio.volume = SFX_VOLUME;
      globalAudioCache.set(url, audio);
      audio.play().catch(console.error);
    }
  } catch (err) {
    console.error("Error playing sound:", err);
  }
};
