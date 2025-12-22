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
  board: string[];
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
  // New: Track who is ready for the next round
  readyForNextRound?: {
    host: boolean;
    guest: boolean;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "emoji";
  timestamp: number;
}

export interface RoomData {
  roomCode: string;
  host: OnlinePlayer;
  guest: OnlinePlayer | null;
  gameState: GameState;
  messages?: ChatMessage[];
  createdAt: number;
  mood: "casual" | "intimate";
  status: "relationship" | "married";
}

export type ConnectionState = "connected" | "reconnecting" | "disconnected";

interface UseOnlineGameReturn {
  roomCode: string | null;
  roomData: RoomData | null;
  isHost: boolean;
  isConnected: boolean;
  opponentConnected: boolean;
  connectionState: ConnectionState;
  reconnectAttempts: number;
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
  toggleReadyForNextRound: () => Promise<void>;
  subscribeToExistingRoom: (code: string, host: boolean) => void;
  manualReconnect: () => Promise<void>;
  sendMessage: (content: string, type: "text" | "emoji") => Promise<void>;
}

const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ROYAL";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Reconnection configuration
const RECONNECT_CONFIG = {
  maxAttempts: 5,
  baseDelay: 1000, // 1 second
  maxDelay: 16000, // 16 seconds max
  heartbeatInterval: 10000, // 10 seconds
  disconnectDebounce: 2000, // 2 seconds before showing disconnect toast
};

export const useOnlineGame = (): UseOnlineGameReturn => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const roomRef = useRef<ReturnType<typeof ref> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionListenerRef = useRef<(() => void) | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const disconnectDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastRoomCodeRef = useRef<string | null>(null);
  const lastIsHostRef = useRef<boolean>(false);
  const isReconnectingRef = useRef<boolean>(false);
  const lastToastTimeRef = useRef<number>(0);

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback((attempt: number): number => {
    const delay = RECONNECT_CONFIG.baseDelay * Math.pow(2, attempt);
    return Math.min(delay, RECONNECT_CONFIG.maxDelay);
  }, []);

  // Debounced toast to prevent spam
  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    const now = Date.now();
    if (now - lastToastTimeRef.current > 1000) {
      lastToastTimeRef.current = now;
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);
      else toast.info(message);
    }
  }, []);

  // Update heartbeat (lastSeen timestamp)
  const updateHeartbeat = useCallback(async () => {
    const code = lastRoomCodeRef.current;
    const host = lastIsHostRef.current;
    
    if (!code || !auth.currentUser?.uid) return;
    
    try {
      const playerPath = host ? "host" : "guest";
      const playerRef = ref(database, `rooms/${code}/${playerPath}`);
      
      await update(playerRef, {
        lastSeen: Date.now(),
        isConnected: true,
      });
      console.log("[Heartbeat] Updated lastSeen timestamp");
    } catch (err) {
      console.error("[Heartbeat] Failed to update:", err);
    }
  }, []);

  // Subscribe to room updates - MUST be defined before attemptReconnect
  const subscribeToRoom = useCallback((code: string) => {
    // Clean up existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const roomReference = ref(database, `rooms/${code}`);
    roomRef.current = roomReference;

    const unsubscribe = onValue(roomReference, (snapshot) => {
      const data = snapshot.val() as RoomData | null;
      
      if (!data) {
        setRoomData(null);
        setIsConnected(false);
        setOpponentConnected(false);
        setConnectionState("disconnected");
        return;
      }

      setRoomData(data);
      setIsConnected(true);
      setConnectionState("connected");

      // Check opponent connection
      const userId = auth.currentUser?.uid;
      if (data.host?.id === userId) {
        setOpponentConnected(data.guest?.isConnected || false);
      } else if (data.guest?.id === userId) {
        setOpponentConnected(data.host?.isConnected || false);
      }
    }, (err) => {
      console.error("[Room Subscription] Error:", err);
      setError("Failed to sync with room");
      setIsConnected(false);
      setConnectionState("disconnected");
    });

    unsubscribeRef.current = unsubscribe;
  }, []);

  // Core reconnection logic with exponential backoff
  const attemptReconnect = useCallback(async (): Promise<boolean> => {
    const code = lastRoomCodeRef.current;
    const host = lastIsHostRef.current;
    
    if (!code || !auth.currentUser?.uid || isReconnectingRef.current) {
      return false;
    }
    
    isReconnectingRef.current = true;
    setConnectionState("reconnecting");
    
    let attempt = 0;
    
    while (attempt < RECONNECT_CONFIG.maxAttempts) {
      setReconnectAttempts(attempt + 1);
      console.log(`[Reconnect] Attempt ${attempt + 1}/${RECONNECT_CONFIG.maxAttempts}`);
      
      try {
        const roomSnapshot = await get(ref(database, `rooms/${code}`));
        
        if (!roomSnapshot.exists()) {
          console.log("[Reconnect] Room no longer exists");
          showToast("error", "Room no longer exists");
          lastRoomCodeRef.current = null;
          setRoomCode(null);
          setRoomData(null);
          setConnectionState("disconnected");
          isReconnectingRef.current = false;
          return false;
        }
        
        const data = roomSnapshot.val() as RoomData;
        const userId = auth.currentUser?.uid;
        
        // Verify we're still part of this room
        if ((host && data.host?.id === userId) || (!host && data.guest?.id === userId)) {
          const playerPath = host ? "host" : "guest";
          const playerRef = ref(database, `rooms/${code}/${playerPath}`);
          
          // Update connection status
          await update(playerRef, {
            isConnected: true,
            lastSeen: Date.now(),
          });
          
          // Set up disconnect handler again
          const disconnectRef = ref(database, `rooms/${code}/${playerPath}/isConnected`);
          await onDisconnect(disconnectRef).set(false);
          
          // Re-subscribe to room updates
          subscribeToRoom(code);
          
          setConnectionState("connected");
          setIsConnected(true);
          setReconnectAttempts(0);
          isReconnectingRef.current = false;
          showToast("success", "Reconnected to game!");
          console.log("[Reconnect] Successfully reconnected");
          return true;
        } else {
          // We're no longer part of this room
          console.log("[Reconnect] Removed from room");
          showToast("error", "You were removed from the room");
          lastRoomCodeRef.current = null;
          setRoomCode(null);
          setRoomData(null);
          setConnectionState("disconnected");
          isReconnectingRef.current = false;
          return false;
        }
      } catch (err) {
        console.error(`[Reconnect] Attempt ${attempt + 1} failed:`, err);
        attempt++;
        
        if (attempt < RECONNECT_CONFIG.maxAttempts) {
          const delay = getReconnectDelay(attempt);
          console.log(`[Reconnect] Waiting ${delay}ms before next attempt`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All attempts failed
    console.log("[Reconnect] All attempts exhausted");
    showToast("error", "Failed to reconnect. Please try manually.");
    setConnectionState("disconnected");
    isReconnectingRef.current = false;
    return false;
  }, [getReconnectDelay, showToast, subscribeToRoom]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionListenerRef.current) {
        connectionListenerRef.current();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (disconnectDebounceRef.current) {
        clearTimeout(disconnectDebounceRef.current);
      }
    };
  }, []);

  // Keep track of current room for reconnection
  useEffect(() => {
    lastRoomCodeRef.current = roomCode;
    lastIsHostRef.current = isHost;
  }, [roomCode, isHost]);

  // Heartbeat system - periodically update lastSeen
  useEffect(() => {
    if (roomCode && isConnected) {
      // Clear any existing interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // Initial heartbeat
      updateHeartbeat();
      
      // Set up periodic heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        updateHeartbeat();
      }, RECONNECT_CONFIG.heartbeatInterval);
      
      console.log("[Heartbeat] Started heartbeat interval");
    }
    
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [roomCode, isConnected, updateHeartbeat]);

  // Visibility change handler - check connection when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && lastRoomCodeRef.current) {
        console.log("[Visibility] Tab became visible, checking connection...");
        
        // Force a connection check
        try {
          const roomSnapshot = await get(ref(database, `rooms/${lastRoomCodeRef.current}`));
          
          if (roomSnapshot.exists()) {
            const data = roomSnapshot.val() as RoomData;
            const userId = auth.currentUser?.uid;
            const host = lastIsHostRef.current;
            
            // Verify we're still part of this room
            if ((host && data.host?.id === userId) || (!host && data.guest?.id === userId)) {
              // Update our connection status
              await updateHeartbeat();
              
              // Re-subscribe to ensure we have latest data
              subscribeToRoom(lastRoomCodeRef.current!);
              setConnectionState("connected");
              console.log("[Visibility] Connection verified");
            } else {
              console.log("[Visibility] No longer in room");
              setConnectionState("disconnected");
              lastRoomCodeRef.current = null;
              setRoomCode(null);
              setRoomData(null);
              showToast("error", "You were removed from the room");
            }
          } else {
            console.log("[Visibility] Room no longer exists");
            setConnectionState("disconnected");
            lastRoomCodeRef.current = null;
            setRoomCode(null);
            setRoomData(null);
            showToast("error", "Room no longer exists");
          }
        } catch (err) {
          console.error("[Visibility] Connection check failed:", err);
          // Attempt reconnection
          attemptReconnect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateHeartbeat, subscribeToRoom, showToast, attemptReconnect]);

  // Monitor Firebase connection state
  useEffect(() => {
    const connectedRef = ref(database, ".info/connected");
    
    const unsubscribe = onValue(connectedRef, async (snapshot) => {
      const connected = snapshot.val() === true;
      const code = lastRoomCodeRef.current;
      
      if (connected && code) {
        // Connection restored
        console.log("[Firebase] Connection restored");
        
        // Clear disconnect debounce
        if (disconnectDebounceRef.current) {
          clearTimeout(disconnectDebounceRef.current);
          disconnectDebounceRef.current = null;
        }
        
        // If we were reconnecting or disconnected, attempt to rejoin
        if (connectionState !== "connected" || !isConnected) {
          attemptReconnect();
        }
      } else if (!connected && code) {
        // Connection lost - debounce before showing toast
        console.log("[Firebase] Connection lost, debouncing...");
        
        if (disconnectDebounceRef.current) {
          clearTimeout(disconnectDebounceRef.current);
        }
        
        disconnectDebounceRef.current = setTimeout(() => {
          if (!isReconnectingRef.current) {
            setConnectionState("reconnecting");
            setIsConnected(false);
            showToast("error", "Connection lost. Reconnecting...");
          }
        }, RECONNECT_CONFIG.disconnectDebounce);
      }
    });

    connectionListenerRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [connectionState, isConnected, attemptReconnect, showToast]);

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
        board: Array(9).fill(""),
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
      setConnectionState("connected");
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
      setConnectionState("connected");
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
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      setRoomCode(null);
      setRoomData(null);
      setIsHost(false);
      setIsConnected(false);
      setOpponentConnected(false);
      setConnectionState("disconnected");
      setReconnectAttempts(0);
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
      } else if (newBoard.every(cell => cell !== "")) {
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

  // Start new round (only called when both players are ready)
  const startNewRound = useCallback(async () => {
    if (!roomCode || !roomData) return;

    try {
      const nextStarter = roomData.gameState.roundsPlayed % 2 === 0 ? "guest" : "host";
      
      await update(ref(database, `rooms/${roomCode}/gameState`), {
        board: Array(9).fill(""),
        currentTurn: nextStarter,
        winner: null,
        gamePhase: "tic-tac-toe",
        loser: null,
        currentCard: null,
        readyForNextRound: { host: false, guest: false },
      });
    } catch (err) {
      console.error("Start new round error:", err);
    }
  }, [roomCode, roomData]);

  // Toggle ready state for next round
  const toggleReadyForNextRound = useCallback(async () => {
    if (!roomCode || !roomData) return;

    try {
      const currentReady = roomData.gameState.readyForNextRound || { host: false, guest: false };
      const playerKey = isHost ? "host" : "guest";
      const newReadyState = {
        ...currentReady,
        [playerKey]: !currentReady[playerKey],
      };

      await update(ref(database, `rooms/${roomCode}/gameState`), {
        readyForNextRound: newReadyState,
      });

      // If both players are now ready, auto-start the new round
      if (newReadyState.host && newReadyState.guest) {
        setTimeout(() => {
          startNewRound();
        }, 500);
      }
    } catch (err) {
      console.error("Toggle ready error:", err);
    }
  }, [roomCode, roomData, isHost, startNewRound]);

  // Manual reconnect function
  const manualReconnect = useCallback(async () => {
    if (!lastRoomCodeRef.current) {
      showToast("error", "No room to reconnect to");
      return;
    }
    
    setReconnectAttempts(0);
    isReconnectingRef.current = false;
    await attemptReconnect();
  }, [attemptReconnect, showToast]);

  // Subscribe to an existing room (for reconnection)
  const subscribeToExistingRoom = useCallback((code: string, host: boolean) => {
    setRoomCode(code);
    setIsHost(host);
    subscribeToRoom(code);
  }, [subscribeToRoom]);

  // Send chat message
  const sendMessage = useCallback(async (content: string, type: "text" | "emoji") => {
    if (!roomCode || !roomData) return;
    
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    const playerName = isHost ? roomData.host.name : (roomData.guest?.name || "Guest");
    
    const newMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: userId,
      senderName: playerName,
      content: content.trim(),
      type,
      timestamp: Date.now(),
    };
    
    try {
      // Get current messages and limit to last 49 + new one = 50
      const currentMessages = roomData.messages || [];
      const updatedMessages = [...currentMessages, newMessage].slice(-50);
      
      await update(ref(database, `rooms/${roomCode}`), {
        messages: updatedMessages,
      });
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message");
    }
  }, [roomCode, roomData, isHost]);

  return {
    roomCode,
    roomData,
    isHost,
    isConnected,
    opponentConnected,
    connectionState,
    reconnectAttempts,
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
    toggleReadyForNextRound,
    subscribeToExistingRoom,
    manualReconnect,
    sendMessage,
  };
};

// Helper function to check winner
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: string[]): { winner: string | null; line: number[] | null } {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combination };
    }
  }
  return { winner: null, line: null };
}

export default useOnlineGame;
