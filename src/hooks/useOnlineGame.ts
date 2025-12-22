import { useState, useEffect, useCallback, useRef } from "react";
import { ref, set, get, onValue, onDisconnect, remove, update, serverTimestamp } from "firebase/database";
import { database, auth } from "@/lib/firebase";
import { toast } from "sonner";

export interface OnlinePlayer {
  id: string;
  name: string;
  photo: string | null;
  isHost: boolean;
  isConnected: boolean;
  lastSeen: number;
}

export interface GameState {
  board: (string | null)[];
  currentTurn: "host" | "guest";
  winner: "host" | "guest" | "draw" | null;
  gamePhase: "waiting" | "tic-tac-toe" | "reveal-loser" | "truth-dare" | "round-complete";
  loser: "host" | "guest" | null;
  currentCard: {
    type: "truth" | "dare";
    content: string;
    intensity: number;
  } | null;
  scores: {
    host: number;
    guest: number;
  };
  roundsPlayed: number;
}

export interface RoomData {
  roomCode: string;
  host: OnlinePlayer;
  guest: OnlinePlayer | null;
  gameState: GameState;
  createdAt: number;
  mood: "casual" | "intimate";
  status: "relationship" | "married";
}

interface UseOnlineGameReturn {
  roomCode: string | null;
  roomData: RoomData | null;
  isHost: boolean;
  isConnected: boolean;
  opponentConnected: boolean;
  loading: boolean;
  error: string | null;
  createRoom: (playerName: string, playerPhoto: string | null, mood: "casual" | "intimate", status: "relationship" | "married") => Promise<string | null>;
  joinRoom: (code: string, playerName: string, playerPhoto: string | null) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  makeMove: (index: number) => Promise<void>;
  updateGamePhase: (phase: GameState["gamePhase"]) => Promise<void>;
  setCurrentCard: (card: GameState["currentCard"]) => Promise<void>;
  updateScores: (winner: "host" | "guest") => Promise<void>;
  startNewRound: () => Promise<void>;
  subscribeToExistingRoom: (code: string, host: boolean) => void;
}

const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ROYAL";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useOnlineGame = (): UseOnlineGameReturn => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const roomRef = useRef<ReturnType<typeof ref> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Subscribe to room updates
  const subscribeToRoom = useCallback((code: string) => {
    const roomReference = ref(database, `rooms/${code}`);
    roomRef.current = roomReference;

    const unsubscribe = onValue(roomReference, (snapshot) => {
      const data = snapshot.val() as RoomData | null;
      
      if (!data) {
        setRoomData(null);
        setIsConnected(false);
        setOpponentConnected(false);
        return;
      }

      setRoomData(data);
      setIsConnected(true);

      // Check opponent connection
      const userId = auth.currentUser?.uid;
      if (data.host?.id === userId) {
        setOpponentConnected(data.guest?.isConnected || false);
      } else if (data.guest?.id === userId) {
        setOpponentConnected(data.host?.isConnected || false);
      }
    }, (err) => {
      console.error("Room subscription error:", err);
      setError("Failed to sync with room");
    });

    unsubscribeRef.current = unsubscribe;
  }, []);

  // Create a new room
  const createRoom = useCallback(async (
    playerName: string,
    playerPhoto: string | null,
    mood: "casual" | "intimate",
    status: "relationship" | "married"
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      let code = generateRoomCode();
      let attempts = 0;
      
      // Ensure unique room code
      while (attempts < 5) {
        const existingRoom = await get(ref(database, `rooms/${code}`));
        if (!existingRoom.exists()) break;
        code = generateRoomCode();
        attempts++;
      }

      const initialGameState: GameState = {
        board: Array(9).fill(null),
        currentTurn: "host",
        winner: null,
        gamePhase: "waiting",
        loser: null,
        currentCard: null,
        scores: { host: 0, guest: 0 },
        roundsPlayed: 0,
      };

      const roomData: RoomData = {
        roomCode: code,
        host: {
          id: userId,
          name: playerName,
          photo: playerPhoto,
          isHost: true,
          isConnected: true,
          lastSeen: Date.now(),
        },
        guest: null,
        gameState: initialGameState,
        createdAt: Date.now(),
        mood,
        status,
      };

      const roomReference = ref(database, `rooms/${code}`);
      await set(roomReference, roomData);

      // Set up disconnect handler
      const hostRef = ref(database, `rooms/${code}/host/isConnected`);
      await onDisconnect(hostRef).set(false);

      setRoomCode(code);
      setIsHost(true);
      subscribeToRoom(code);

      return code;
    } catch (err: any) {
      console.error("Create room error:", err);
      setError(err.message || "Failed to create room");
      toast.error("Failed to create room");
      return null;
    } finally {
      setLoading(false);
    }
  }, [subscribeToRoom]);

  // Join an existing room
  const joinRoom = useCallback(async (
    code: string,
    playerName: string,
    playerPhoto: string | null
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      const roomReference = ref(database, `rooms/${code}`);
      const snapshot = await get(roomReference);

      if (!snapshot.exists()) {
        throw new Error("Room not found");
      }

      const data = snapshot.val() as RoomData;

      if (data.guest && data.guest.id !== userId) {
        throw new Error("Room is full");
      }

      // Check if trying to join own room
      if (data.host.id === userId) {
        throw new Error("Cannot join your own room");
      }

      const guestData: OnlinePlayer = {
        id: userId,
        name: playerName,
        photo: playerPhoto,
        isHost: false,
        isConnected: true,
        lastSeen: Date.now(),
      };

      await update(roomReference, {
        guest: guestData,
        "gameState/gamePhase": "tic-tac-toe",
      });

      // Set up disconnect handler
      const guestRef = ref(database, `rooms/${code}/guest/isConnected`);
      await onDisconnect(guestRef).set(false);

      setRoomCode(code);
      setIsHost(false);
      subscribeToRoom(code);

      toast.success("Joined room successfully!");
      return true;
    } catch (err: any) {
      console.error("Join room error:", err);
      setError(err.message || "Failed to join room");
      toast.error(err.message || "Failed to join room");
      return false;
    } finally {
      setLoading(false);
    }
  }, [subscribeToRoom]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!roomCode) return;

    try {
      const userId = auth.currentUser?.uid;
      const roomReference = ref(database, `rooms/${roomCode}`);

      if (isHost) {
        // Host leaving deletes the room
        await remove(roomReference);
      } else {
        // Guest leaving just removes guest data
        await update(roomReference, {
          guest: null,
          "gameState/gamePhase": "waiting",
        });
      }

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      setRoomCode(null);
      setRoomData(null);
      setIsHost(false);
      setIsConnected(false);
      setOpponentConnected(false);
    } catch (err) {
      console.error("Leave room error:", err);
    }
  }, [roomCode, isHost]);

  // Make a move on the board
  const makeMove = useCallback(async (index: number) => {
    if (!roomCode || !roomData) return;

    try {
      const newBoard = [...roomData.gameState.board];
      const symbol = roomData.gameState.currentTurn === "host" ? "👑" : "❤️";
      newBoard[index] = symbol;

      const nextTurn = roomData.gameState.currentTurn === "host" ? "guest" : "host";

      // Check for winner
      const winResult = checkWinner(newBoard);
      
      let updates: Partial<GameState> = {
        board: newBoard,
        currentTurn: nextTurn,
      };

      if (winResult.winner) {
        const gameWinner = winResult.winner === "👑" ? "host" : "guest";
        const gameLoser = gameWinner === "host" ? "guest" : "host";
        updates = {
          ...updates,
          winner: gameWinner,
          loser: gameLoser,
          gamePhase: "reveal-loser",
        };
      } else if (newBoard.every(cell => cell !== null)) {
        // Draw - random loser
        const randomLoser = Math.random() > 0.5 ? "host" : "guest";
        updates = {
          ...updates,
          winner: "draw",
          loser: randomLoser,
          gamePhase: "reveal-loser",
        };
      }

      await update(ref(database, `rooms/${roomCode}/gameState`), updates);
    } catch (err) {
      console.error("Make move error:", err);
      toast.error("Failed to make move");
    }
  }, [roomCode, roomData]);

  // Update game phase
  const updateGamePhase = useCallback(async (phase: GameState["gamePhase"]) => {
    if (!roomCode) return;

    try {
      await update(ref(database, `rooms/${roomCode}/gameState`), {
        gamePhase: phase,
      });
    } catch (err) {
      console.error("Update phase error:", err);
    }
  }, [roomCode]);

  // Set current card
  const setCurrentCard = useCallback(async (card: GameState["currentCard"]) => {
    if (!roomCode) return;

    try {
      await update(ref(database, `rooms/${roomCode}/gameState`), {
        currentCard: card,
      });
    } catch (err) {
      console.error("Set card error:", err);
    }
  }, [roomCode]);

  // Update scores
  const updateScores = useCallback(async (winner: "host" | "guest") => {
    if (!roomCode || !roomData) return;

    try {
      const newScores = { ...roomData.gameState.scores };
      newScores[winner] += 1;

      await update(ref(database, `rooms/${roomCode}/gameState`), {
        scores: newScores,
        roundsPlayed: roomData.gameState.roundsPlayed + 1,
      });
    } catch (err) {
      console.error("Update scores error:", err);
    }
  }, [roomCode, roomData]);

  // Start new round
  const startNewRound = useCallback(async () => {
    if (!roomCode || !roomData) return;

    try {
      const nextStarter = roomData.gameState.roundsPlayed % 2 === 0 ? "guest" : "host";
      
      await update(ref(database, `rooms/${roomCode}/gameState`), {
        board: Array(9).fill(null),
        currentTurn: nextStarter,
        winner: null,
        gamePhase: "tic-tac-toe",
        loser: null,
        currentCard: null,
      });
    } catch (err) {
      console.error("Start new round error:", err);
    }
  }, [roomCode, roomData]);

  // Subscribe to an existing room (for reconnection)
  const subscribeToExistingRoom = useCallback((code: string, host: boolean) => {
    setRoomCode(code);
    setIsHost(host);
    subscribeToRoom(code);
  }, [subscribeToRoom]);

  return {
    roomCode,
    roomData,
    isHost,
    isConnected,
    opponentConnected,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    updateGamePhase,
    setCurrentCard,
    updateScores,
    startNewRound,
    subscribeToExistingRoom,
  };
};

// Helper function to check winner
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: (string | null)[]): { winner: string | null; line: number[] | null } {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combination };
    }
  }
  return { winner: null, line: null };
}

export default useOnlineGame;
