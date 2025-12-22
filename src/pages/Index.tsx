import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import UserDetailsForm from "@/components/UserDetailsForm";
import Lobby from "@/components/Lobby";
import MoodSelector from "@/components/MoodSelector";
import OnlineRoomSelector from "@/components/OnlineRoomSelector";
import GameBoard from "@/components/GameBoard";
import OnlineGameBoard from "@/components/OnlineGameBoard";

type AppScreen = "boot" | "login" | "details" | "lobby" | "game" | "online-game";
type GameMode = "offline" | "ai" | "online";

interface UserDetails {
  name: string;
  gender: "male" | "female" | null;
  age: string;
  status: "relationship" | "married" | null;
  partnerName: string;
  profilePhoto: string | null;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("boot");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameMood, setGameMood] = useState<"casual" | "intimate" | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showOnlineSelector, setShowOnlineSelector] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [onlineRoomCode, setOnlineRoomCode] = useState<string | null>(null);
  const [isOnlineHost, setIsOnlineHost] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const savedDetails = localStorage.getItem("royalIshq_userDetails");
    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
    }
  }, []);

  // Check for room code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam && userDetails) {
      setOnlineRoomCode(roomParam);
      setShowOnlineSelector(true);
    }
  }, [userDetails]);

  const handleBootComplete = () => {
    if (userDetails) {
      setCurrentScreen("lobby");
    } else {
      setCurrentScreen("login");
    }
  };

  const handleLogin = () => {
    setCurrentScreen("details");
  };

  const handleDetailsComplete = (details: UserDetails) => {
    setUserDetails(details);
    localStorage.setItem("royalIshq_userDetails", JSON.stringify(details));
    setIsEditingProfile(false);
    setCurrentScreen("lobby");
  };

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    
    if (mode === "offline") {
      setShowMoodSelector(true);
    } else if (mode === "online") {
      setShowOnlineSelector(true);
    } else {
      // AI mode - start directly with casual mood
      setGameMood("casual");
      setCurrentScreen("game");
    }
  };

  const handleMoodSelect = (mood: "casual" | "intimate") => {
    setGameMood(mood);
    setShowMoodSelector(false);
    setCurrentScreen("game");
  };

  const handleOnlineRoomReady = (roomCode: string, isHost: boolean) => {
    setOnlineRoomCode(roomCode);
    setIsOnlineHost(isHost);
    setShowOnlineSelector(false);
    setCurrentScreen("online-game");
    // Clear URL params
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleBackToLobby = () => {
    setCurrentScreen("lobby");
    setGameMode(null);
    setGameMood(null);
    setOnlineRoomCode(null);
    setIsOnlineHost(false);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setCurrentScreen("details");
  };

  const handleLogout = () => {
    localStorage.removeItem("royalIshq_userDetails");
    setUserDetails(null);
    setGameMode(null);
    setGameMood(null);
    setOnlineRoomCode(null);
    setCurrentScreen("login");
  };

  const getOpponentInfo = () => {
    if (!userDetails) return { name: "Partner", photo: null };
    
    if (gameMode === "ai") {
      return { name: "Destiny AI", photo: null, isAI: true };
    }
    
    return { name: userDetails.partnerName, photo: null };
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentScreen === "boot" && (
          <BootScreen key="boot" onComplete={handleBootComplete} />
        )}

        {currentScreen === "login" && (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}

        {currentScreen === "details" && (
          <UserDetailsForm
            key="details"
            onComplete={handleDetailsComplete}
            initialDetails={isEditingProfile && userDetails ? userDetails : undefined}
          />
        )}

        {currentScreen === "lobby" && userDetails && (
          <Lobby
            key="lobby"
            userDetails={userDetails}
            onStartGame={handleStartGame}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === "game" && userDetails && gameMode && (
          <GameBoard
            key="game"
            mode={gameMode}
            mood={gameMood || "casual"}
            relationshipStatus={userDetails.status || "relationship"}
            currentPlayer={{
              name: userDetails.name,
              photo: userDetails.profilePhoto,
            }}
            opponent={getOpponentInfo()}
            onBack={handleBackToLobby}
          />
        )}

        {currentScreen === "online-game" && userDetails && onlineRoomCode && (
          <OnlineGameBoard
            key="online-game"
            roomCode={onlineRoomCode}
            isHost={isOnlineHost}
            currentPlayer={{
              name: userDetails.name,
              photo: userDetails.profilePhoto,
            }}
            onBack={handleBackToLobby}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <MoodSelector
        isOpen={showMoodSelector}
        onClose={() => setShowMoodSelector(false)}
        userName={userDetails?.name || ""}
        onSelectMood={handleMoodSelect}
      />

      {userDetails && (
        <OnlineRoomSelector
          isOpen={showOnlineSelector}
          onClose={() => {
            setShowOnlineSelector(false);
            setOnlineRoomCode(null);
          }}
          onRoomReady={handleOnlineRoomReady}
          playerName={userDetails.name}
          playerPhoto={userDetails.profilePhoto}
          mood={gameMood || "casual"}
          status={userDetails.status || "relationship"}
        />
      )}
    </div>
  );
};

export default Index;
