import { motion } from "framer-motion";
import { Play, Pause, Star, ArrowLeft } from "lucide-react";
import { audioTracks } from "@/data/audioLibrary";
import { useAudio } from "@/contexts/AudioContext";

interface AudioLibraryProps {
  onBack: () => void;
}

const AudioLibrary = ({ onBack }: AudioLibraryProps) => {
  const { currentTrack, isPlaying, defaultTrackId, play, pause, setDefaultTrack } = useAudio();

  const handlePlayPause = (trackId: string) => {
    if (currentTrack?.id === trackId && isPlaying) {
      pause();
    } else {
      play(trackId);
    }
  };

  const handleSetDefault = (trackId: string) => {
    if (defaultTrackId === trackId) {
      setDefaultTrack(null); // Remove default
    } else {
      setDefaultTrack(trackId);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-gradient-to-b from-card to-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-display text-xl font-semibold text-foreground">Audio Library</h2>
      </div>

      {/* Track Grid */}
      <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 73px)" }}>
        <div className="grid grid-cols-2 gap-4">
          {audioTracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrentTrack && isPlaying;
            const isDefault = defaultTrackId === track.id;

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-xl overflow-hidden bg-muted/30 transition-all ${
                  isTrackPlaying ? "ring-2 ring-secondary shadow-lg shadow-secondary/20" : ""
                }`}
              >
                {/* Playing indicator glow */}
                {isTrackPlaying && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent pointer-events-none"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Cover Image */}
                <div className="relative aspect-square">
                  <img
                    src={track.coverUrl}
                    alt={track.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  
                  {/* Default Badge */}
                  {isDefault && (
                    <div className="absolute top-2 right-2 bg-secondary/90 text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                      Default
                    </div>
                  )}

                  {/* Play/Pause Overlay Button */}
                  <button
                    onClick={() => handlePlayPause(track.id)}
                    className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                      {isTrackPlaying ? (
                        <Pause className="h-6 w-6 text-secondary-foreground" />
                      ) : (
                        <Play className="h-6 w-6 text-secondary-foreground ml-1" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Track Info & Controls */}
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate mb-2">
                    {track.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => handlePlayPause(track.id)}
                      className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                        isTrackPlaying
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {isTrackPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </button>

                    {/* Set as Default Button */}
                    <button
                      onClick={() => handleSetDefault(track.id)}
                      className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                        isDefault
                          ? "bg-secondary/20 text-secondary"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-secondary"
                      }`}
                      title={isDefault ? "Remove as default" : "Set as default"}
                    >
                      <Star
                        className={`h-4 w-4 ${isDefault ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Text */}
        <p className="mt-4 text-center text-xs text-muted-foreground px-4">
          Tap the star to set a track as default. It will loop on startup.
          {!defaultTrackId && " With no default, all tracks will loop in sequence."}
        </p>
      </div>
    </motion.div>
  );
};

export default AudioLibrary;
