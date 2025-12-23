import { useCallback, useRef, useEffect, useState } from "react";
import { GAME_SOUNDS, SoundType } from "@/data/gameSounds";

const SFX_VOLUME = 0.8; // 80% volume for sound effects
const SFX_MUTE_KEY = "sfx_muted";

export const useSoundEffects = () => {
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(SFX_MUTE_KEY) === "true";
  });

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
    if (isMuted) return;

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
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem(SFX_MUTE_KEY, String(newValue));
      return newValue;
    });
  }, []);

  return { playSound, isMuted, toggleMute };
};

// Singleton for global access
let globalMuted = localStorage.getItem(SFX_MUTE_KEY) === "true";
let globalAudioCache: Map<string, HTMLAudioElement> | null = null;

export const playSoundEffect = (soundName: SoundType) => {
  if (globalMuted) return;
  
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

export const setGlobalSfxMuted = (muted: boolean) => {
  globalMuted = muted;
};
