import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

interface VoiceMessageProps {
  audioUrl: string;
  duration: number;
  isMe: boolean;
  senderName?: string;
  timestamp: number;
}

const VoiceMessage = ({ audioUrl, duration, isMe, senderName, timestamp }: VoiceMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { pause: pauseBgMusic, togglePlay: resumeBgMusic, isPlaying: bgMusicPlaying } = useAudio();
  const wasBgPlayingRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      // Resume BG music if it was playing
      if (wasBgPlayingRef.current) {
        resumeBgMusic();
      }
    });
    
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl, resumeBgMusic]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      // Resume BG music if it was playing
      if (wasBgPlayingRef.current) {
        resumeBgMusic();
      }
    } else {
      // Pause BG music before playing voice note
      wasBgPlayingRef.current = bgMusicPlaying;
      if (bgMusicPlaying) {
        pauseBgMusic();
      }
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (ts: number) => {
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 px-3 py-2 rounded-2xl min-w-[180px] max-w-[240px] ${
          isMe
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            isMe
              ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
              : "bg-foreground/10 hover:bg-foreground/20"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>

        {/* Waveform / Progress */}
        <div className="flex-1">
          {!isMe && senderName && (
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {senderName}
            </p>
          )}
          
          {/* Waveform bars */}
          <div className="flex items-center gap-0.5 h-4">
            {Array.from({ length: 20 }).map((_, i) => {
              const barProgress = (i / 20) * 100;
              const isActive = barProgress <= progress;
              const barHeight = Math.sin((i / 20) * Math.PI) * 0.6 + 0.4;
              
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-colors ${
                    isActive
                      ? isMe
                        ? "bg-primary-foreground"
                        : "bg-primary"
                      : isMe
                        ? "bg-primary-foreground/30"
                        : "bg-foreground/20"
                  }`}
                  style={{ height: `${barHeight * 100}%` }}
                />
              );
            })}
          </div>
          
          {/* Duration */}
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {isPlaying ? formatTime(currentTime) : formatTime(duration)}
            </span>
            <span className={`text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {formatTimestamp(timestamp)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceMessage;
