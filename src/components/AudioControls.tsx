import { Volume2, VolumeX, Music, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/contexts/AudioContext";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { motion } from "framer-motion";

interface AudioControlsProps {
  compact?: boolean;
}

const AudioControls = ({ compact = false }: AudioControlsProps) => {
  const { isPlaying, togglePlay } = useAudio();
  const { isMuted: sfxMuted, toggleMute: toggleSfxMute } = useSoundEffects();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* BG Music Toggle */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={isPlaying ? "Mute background music" : "Unmute background music"}
          >
            {isPlaying ? (
              <Music className="h-4 w-4 text-secondary" />
            ) : (
              <Music2 className="h-4 w-4 opacity-50" />
            )}
          </Button>
        </motion.div>

        {/* SFX Toggle */}
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSfxMute}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={sfxMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {sfxMuted ? (
              <VolumeX className="h-4 w-4 opacity-50" />
            ) : (
              <Volume2 className="h-4 w-4 text-primary" />
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
      {/* BG Music Toggle */}
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={isPlaying ? "Mute background music" : "Unmute background music"}
        >
          {isPlaying ? (
            <Music className="h-4 w-4 text-secondary" />
          ) : (
            <Music2 className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </motion.div>

      <div className="h-4 w-px bg-border/50" />

      {/* SFX Toggle */}
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSfxMute}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={sfxMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {sfxMuted ? (
            <VolumeX className="h-4 w-4 opacity-50" />
          ) : (
            <Volume2 className="h-4 w-4 text-primary" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default AudioControls;
