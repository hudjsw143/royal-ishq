import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Users, Copy, Share2, ArrowRight, Loader2, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOnlineGame } from "@/hooks/useOnlineGame";

interface OnlineRoomSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomReady: (roomCode: string, isHost: boolean) => void;
  playerName: string;
  playerPhoto: string | null;
  mood?: "casual" | "intimate";
  status?: "relationship" | "married";
}

const OnlineRoomSelector = ({
  isOpen,
  onClose,
  onRoomReady,
  playerName,
  playerPhoto,
  mood = "casual",
  status = "relationship",
}: OnlineRoomSelectorProps) => {
  const [mode, setMode] = useState<"select" | "join" | "created">("select");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  
  const {
    roomCode,
    roomData,
    isHost,
    opponentConnected,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
  } = useOnlineGame();

  // When opponent joins (for host), trigger onRoomReady
  useEffect(() => {
    if (isHost && opponentConnected && roomCode) {
      toast.success("Partner joined! Starting game...");
      setTimeout(() => {
        onRoomReady(roomCode, true);
      }, 500);
    }
  }, [isHost, opponentConnected, roomCode, onRoomReady]);

  // When guest successfully joins
  useEffect(() => {
    if (!isHost && roomData?.gameState.gamePhase === "tic-tac-toe" && roomCode) {
      onRoomReady(roomCode, false);
    }
  }, [isHost, roomData, roomCode, onRoomReady]);

  const handleCreateRoom = async () => {
    const code = await createRoom(playerName, playerPhoto, mood, status);
    if (code) {
      setMode("created");
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied!");
    }
  };

  const handleShare = async () => {
    if (!roomCode) return;
    
    const shareUrl = `${window.location.origin}?room=${roomCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Royal Ishq!",
          text: `Join my game room with code: ${roomCode}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
        handleCopyCode();
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    }
  };

  const handleJoinRoom = async () => {
    if (roomCodeInput.length >= 6) {
      const success = await joinRoom(roomCodeInput.toUpperCase(), playerName, playerPhoto);
      if (success) {
        // Room joined, effect will handle transition
      }
    }
  };

  const handleBack = () => {
    if (roomCode) {
      leaveRoom();
    }
    setMode("select");
    setRoomCodeInput("");
  };

  const handleClose = () => {
    if (roomCode) {
      leaveRoom();
    }
    setMode("select");
    setRoomCodeInput("");
    onClose();
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
              onClick={handleClose}
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
                    onClick={handleCreateRoom}
                    disabled={loading}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-foreground/20">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
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
                    disabled={loading}
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
                    {roomCode}
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
                    Share Link
                  </Button>
                </div>

                {/* Waiting Status */}
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30">
                  {opponentConnected ? (
                    <>
                      <Wifi className="h-5 w-5 text-green-500 animate-pulse" />
                      <span className="text-green-500 font-medium">Partner connected!</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Waiting for your partner...</span>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full text-muted-foreground"
                  onClick={handleBack}
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
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    className="text-center text-2xl tracking-widest border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal focus:border-secondary uppercase"
                    maxLength={10}
                    disabled={loading}
                  />

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    onClick={handleJoinRoom}
                    disabled={roomCodeInput.length < 6 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Game
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={handleBack}
                    disabled={loading}
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
