import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { audioTracks, AudioTrack } from "@/data/audioLibrary";

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  defaultTrackId: string | null;
  play: (trackId: string) => void;
  pause: () => void;
  togglePlay: () => void;
  setDefaultTrack: (trackId: string | null) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

const FADE_DURATION = 500; // ms
const STORAGE_KEY_DEFAULT = "audio_default_track";
const STORAGE_KEY_VISITED = "audio_has_visited";

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [defaultTrackId, setDefaultTrackIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_DEFAULT);
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // Clear any existing fade interval
  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  // Fade in effect
  const fadeIn = useCallback((audio: HTMLAudioElement, onComplete?: () => void) => {
    clearFadeInterval();
    audio.volume = 0;
    
    const steps = 20;
    const stepDuration = FADE_DURATION / steps;
    const volumeStep = 1 / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(currentStep * volumeStep, 1);
      
      if (currentStep >= steps) {
        clearFadeInterval();
        onComplete?.();
      }
    }, stepDuration);
  }, [clearFadeInterval]);

  // Fade out effect
  const fadeOut = useCallback((audio: HTMLAudioElement, onComplete?: () => void) => {
    clearFadeInterval();
    
    const steps = 20;
    const stepDuration = FADE_DURATION / steps;
    const volumeStep = audio.volume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(audio.volume - volumeStep, 0);
      
      if (currentStep >= steps) {
        clearFadeInterval();
        onComplete?.();
      }
    }, stepDuration);
  }, [clearFadeInterval]);

  // Play a specific track
  const playTrack = useCallback((trackId: string, withFadeIn = true) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (!track) return;

    const startNewTrack = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      
      setCurrentTrack(track);
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          if (withFadeIn) {
            fadeIn(audioRef.current!);
          } else {
            audioRef.current!.volume = 1;
          }
        })
        .catch(err => {
          console.error("Audio playback failed:", err);
          setIsPlaying(false);
        });
    };

    // If already playing, fade out first
    if (audioRef.current && isPlaying) {
      fadeOut(audioRef.current, () => {
        audioRef.current?.pause();
        startNewTrack();
      });
    } else {
      startNewTrack();
    }
  }, [isPlaying, fadeIn, fadeOut]);

  // Play next track (for playlist mode)
  const playNextTrack = useCallback(() => {
    if (!currentTrack) return;
    
    // If default is set, replay same track
    if (defaultTrackId) {
      playTrack(defaultTrackId);
      return;
    }
    
    // Otherwise, play next in playlist (loop all)
    const currentIndex = audioTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % audioTracks.length;
    playTrack(audioTracks[nextIndex].id);
  }, [currentTrack, defaultTrackId, playTrack]);

  // Handle track end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      fadeOut(audio, () => {
        playNextTrack();
      });
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNextTrack, fadeOut]);

  // Initialize on first visit
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const hasVisited = localStorage.getItem(STORAGE_KEY_VISITED);
    
    // Start playback after user interaction
    const startPlayback = () => {
      if (hasVisited) {
        // Returning user: play default or first track
        const trackToPlay = defaultTrackId || audioTracks[0].id;
        playTrack(trackToPlay);
      } else {
        // First visit: play random track
        localStorage.setItem(STORAGE_KEY_VISITED, "true");
        const randomIndex = Math.floor(Math.random() * audioTracks.length);
        playTrack(audioTracks[randomIndex].id);
      }
      
      // Remove listeners after first interaction
      document.removeEventListener("click", startPlayback);
      document.removeEventListener("touchstart", startPlayback);
    };

    // Wait for user interaction (browsers block autoplay)
    document.addEventListener("click", startPlayback, { once: true });
    document.addEventListener("touchstart", startPlayback, { once: true });

    return () => {
      document.removeEventListener("click", startPlayback);
      document.removeEventListener("touchstart", startPlayback);
    };
  }, [defaultTrackId, playTrack]);

  // Public play function
  const play = useCallback((trackId: string) => {
    playTrack(trackId);
  }, [playTrack]);

  // Pause with fade out
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      fadeOut(audioRef.current, () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
    }
  }, [isPlaying, fadeOut]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            fadeIn(audioRef.current!);
          })
          .catch(console.error);
      }
    } else {
      // No current track, start with default or random
      const trackId = defaultTrackId || audioTracks[Math.floor(Math.random() * audioTracks.length)].id;
      play(trackId);
    }
  }, [isPlaying, currentTrack, defaultTrackId, pause, play, fadeIn]);

  // Set default track
  const setDefaultTrack = useCallback((trackId: string | null) => {
    setDefaultTrackIdState(trackId);
    if (trackId) {
      localStorage.setItem(STORAGE_KEY_DEFAULT, trackId);
    } else {
      localStorage.removeItem(STORAGE_KEY_DEFAULT);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFadeInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFadeInterval]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        defaultTrackId,
        play,
        pause,
        togglePlay,
        setDefaultTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
