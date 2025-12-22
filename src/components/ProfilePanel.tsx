import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Edit3, Music, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface UserDetails {
  name: string;
  gender: "male" | "female" | null;
  age: string;
  status: "relationship" | "married" | null;
  partnerName: string;
  profilePhoto: string | null;
}

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserDetails;
  onEditProfile: () => void;
}

const ProfilePanel = ({
  isOpen,
  onClose,
  userDetails,
  onEditProfile,
}: ProfilePanelProps) => {
  const [isMuted, setIsMuted] = useState(false);

  const menuItems = [
    {
      id: "edit",
      label: "Edit Profile",
      icon: Edit3,
      onClick: onEditProfile,
    },
    {
      id: "audio",
      label: "Audio Library",
      icon: Music,
      onClick: () => console.log("Open audio library"),
    },
    {
      id: "messages",
      label: "Quick Messages & Emojis",
      icon: MessageCircle,
      onClick: () => console.log("Open messages"),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-gradient-to-b from-card to-background shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex h-full flex-col pt-20">
              {/* Profile Header */}
              <div className="flex flex-col items-center px-6 pb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative mb-4"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-secondary/30 shadow-gold">
                    {userDetails.profilePhoto ? (
                      <img
                        src={userDetails.profilePhoto}
                        alt={userDetails.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-3xl font-bold text-muted-foreground">
                        {userDetails.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="font-display text-2xl font-semibold text-foreground"
                >
                  {userDetails.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {userDetails.status === "married" ? "Married to" : "In love with"}{" "}
                  <span className="text-secondary">{userDetails.partnerName}</span>
                </motion.p>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-border/50" />

              {/* Menu Items */}
              <div className="flex-1 px-4 py-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    onClick={item.onClick}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Audio Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-t border-border/50 p-4"
              >
                <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Background Music
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="glass"
                    size="lg"
                    className="flex-1"
                    onClick={() => setIsMuted(false)}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                  <Button
                    variant="glass"
                    size="lg"
                    className="flex-1"
                    onClick={() => setIsMuted(true)}
                  >
                    <VolumeX className="mr-2 h-4 w-4" />
                    Mute
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;