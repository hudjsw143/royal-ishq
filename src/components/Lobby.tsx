import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Bot, Globe, Sparkles } from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import { useState } from "react";
import romanticBg from "@/assets/romantic-bg.jpg";

interface UserDetails {
  name: string;
  gender: "male" | "female" | null;
  age: string;
  status: "relationship" | "married" | null;
  partnerName: string;
  profilePhoto: string | null;
}

interface LobbyProps {
  userDetails: UserDetails;
  onStartGame: (mode: "offline" | "ai" | "online") => void;
  onEditProfile: () => void;
}

const Lobby = ({ userDetails, onStartGame, onEditProfile }: LobbyProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const gameModes = [
    {
      id: "offline" as const,
      title: "Offline Mode",
      subtitle: "Play together in person",
      icon: Users,
      description: "Perfect for couples spending quality time together",
      gradient: "from-primary to-royal-burgundy-light",
    },
    {
      id: "ai" as const,
      title: "Destiny AI",
      subtitle: "Play against AI",
      icon: Bot,
      description: "Challenge our intelligent AI opponent",
      gradient: "from-secondary to-royal-gold-light",
    },
    {
      id: "online" as const,
      title: "Online Mode",
      subtitle: "Connect with your partner",
      icon: Globe,
      description: "Play together even when apart",
      gradient: "from-royal-rose to-primary",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-30 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${romanticBg})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h1 className="font-display text-xl font-semibold">
              <span className="text-gradient-gold">Royal</span>{" "}
              <span className="text-foreground">Ishq</span>
            </h1>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="group relative"
          >
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-secondary/50 transition-all group-hover:border-secondary group-hover:shadow-gold">
              {userDetails.profilePhoto ? (
                <img
                  src={userDetails.profilePhoto}
                  alt={userDetails.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-semibold text-muted-foreground">
                  {userDetails.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
          </button>
        </motion.header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Welcome back,{" "}
              <span className="text-gradient-gold">{userDetails.name}</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Choose a game mode to play with {userDetails.partnerName}
            </p>
          </motion.div>

          {/* Game Modes */}
          <div className="grid w-full max-w-lg gap-4">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <button
                  onClick={() => onStartGame(mode.id)}
                  className="glass-card group relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all hover:border-secondary/50 hover:shadow-gold"
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${mode.gradient} opacity-0 transition-opacity group-hover:opacity-10`}
                  />

                  <div className="relative flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${mode.gradient} shadow-lg`}
                    >
                      <mode.icon className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {mode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {mode.subtitle}
                      </p>
                    </div>
                    <div className="text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </div>
                  </div>
                  <p className="relative mt-3 text-sm text-muted-foreground/70">
                    {mode.description}
                  </p>
                </button>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userDetails={userDetails}
        onEditProfile={onEditProfile}
      />
    </motion.div>
  );
};

export default Lobby;