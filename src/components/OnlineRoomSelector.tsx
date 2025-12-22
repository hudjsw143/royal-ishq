import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Users, Copy, Share2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OnlineRoomSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomCode: string) => void;
  onCreateRoom: () => void;
}

const OnlineRoomSelector = ({
  isOpen,
  onClose,
  onJoinRoom,
  onCreateRoom,
}: OnlineRoomSelectorProps) => {
  const [mode, setMode] = useState<"select" | "join" | "created">("select");
  const [roomCode, setRoomCode] = useState("");
  const [createdRoomCode] = useState("ROYAL" + Math.random().toString(36).substring(2, 6).toUpperCase());

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    toast.success("Room code copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Royal Ishq!",
          text: `Join my game room with code: ${createdRoomCode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleCopyCode();
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.length >= 6) {
      onJoinRoom(roomCode);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        >
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

            {mode === "select" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Online Mode
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Play with your partner remotely
                  </p>
                </div>

                <div className="grid gap-4">
                  <Button
                    variant="gold"
                    size="xl"
                    className="w-full justify-start gap-4"
                    onClick={() => setMode("created")}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-foreground/20">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Create Room</div>
                      <div className="text-sm opacity-80">
                        Get a code to share
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full justify-start gap-4"
                    onClick={() => setMode("join")}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Join Room</div>
                      <div className="text-sm text-muted-foreground">
                        Enter a room code
                      </div>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === "created" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Room Created! 🎉
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Share this code with your partner
                  </p>
                </div>

                {/* Room Code Display */}
                <div className="mb-6 rounded-2xl bg-muted/50 p-6 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Room Code</p>
                  <p className="font-display text-4xl font-bold tracking-widest text-secondary">
                    {createdRoomCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={handleCopyCode}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Waiting for your partner to join...
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full text-muted-foreground"
                  onClick={() => setMode("select")}
                >
                  ← Back
                </Button>
              </motion.div>
            )}

            {mode === "join" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Join Room
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Enter the code shared by your partner
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="text-center text-2xl tracking-widest border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal focus:border-secondary uppercase"
                    maxLength={10}
                  />

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={handleJoinRoom}
                    disabled={roomCode.length < 6}
                  >
                    Join Game
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => setMode("select")}
                  >
                    ← Back
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnlineRoomSelector;