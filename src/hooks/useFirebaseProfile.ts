import { useState, useCallback } from "react";
import { ref, set, get, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "@/lib/firebase";

interface UserDetails {
  name: string;
  gender: "male" | "female" | null;
  age: string;
  status: "relationship" | "married" | null;
  partnerName: string;
  profilePhoto: string | null;
}

interface GameHistoryEntry {
  opponentId: string | null;
  opponentName: string;
  opponentPhoto: string | null;
  mode: "online" | "ai" | "offline";
  scores: { player: number; opponent: number };
  roundsPlayed: number;
  playedAt: number;
}

interface UseFirebaseProfileReturn {
  loading: boolean;
  error: string | null;
  uploadProfilePhoto: (file: File, userId: string) => Promise<string | null>;
  saveProfile: (userId: string, details: UserDetails) => Promise<void>;
  getProfile: (userId: string) => Promise<UserDetails | null>;
  saveGameHistory: (
    userId: string,
    opponentInfo: { id?: string; name: string; photo: string | null },
    mode: "online" | "ai" | "offline",
    scores: { player: number; opponent: number },
    roundsPlayed: number
  ) => Promise<void>;
  updateStats: (
    userId: string,
    won: boolean,
    challengesCompleted: number
  ) => Promise<void>;
}

export const useFirebaseProfile = (): UseFirebaseProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload profile photo to Firebase Storage
  const uploadProfilePhoto = useCallback(async (file: File, userId: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const photoRef = storageRef(storage, `profiles/${userId}/photo.jpg`);
      await uploadBytes(photoRef, file);
      const downloadUrl = await getDownloadURL(photoRef);
      
      return downloadUrl;
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      setError("Failed to upload profile photo");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save user profile to Firebase
  const saveProfile = useCallback(async (userId: string, details: UserDetails): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const profileRef = ref(database, `users/${userId}/profile`);
      await set(profileRef, {
        ...details,
        updatedAt: Date.now(),
        createdAt: (await get(profileRef)).val()?.createdAt || Date.now(),
      });
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user profile from Firebase
  const getProfile = useCallback(async (userId: string): Promise<UserDetails | null> => {
    try {
      setLoading(true);
      setError(null);

      const profileRef = ref(database, `users/${userId}/profile`);
      const snapshot = await get(profileRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as UserDetails;
      }
      return null;
    } catch (err) {
      console.error("Error getting profile:", err);
      setError("Failed to get profile");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save game history to Firebase
  const saveGameHistory = useCallback(async (
    userId: string,
    opponentInfo: { id?: string; name: string; photo: string | null },
    mode: "online" | "ai" | "offline",
    scores: { player: number; opponent: number },
    roundsPlayed: number
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const gameId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const historyRef = ref(database, `users/${userId}/gameHistory/${gameId}`);

      const entry: GameHistoryEntry = {
        opponentId: opponentInfo.id || null,
        opponentName: opponentInfo.name,
        opponentPhoto: opponentInfo.photo,
        mode,
        scores,
        roundsPlayed,
        playedAt: Date.now(),
      };

      await set(historyRef, entry);
    } catch (err) {
      console.error("Error saving game history:", err);
      setError("Failed to save game history");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user stats
  const updateStats = useCallback(async (
    userId: string,
    won: boolean,
    challengesCompleted: number
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const statsRef = ref(database, `users/${userId}/stats`);
      const snapshot = await get(statsRef);
      const currentStats = snapshot.exists() ? snapshot.val() : {
        totalGamesPlayed: 0,
        totalWins: 0,
        totalChallengesCompleted: 0,
      };

      await update(statsRef, {
        totalGamesPlayed: currentStats.totalGamesPlayed + 1,
        totalWins: currentStats.totalWins + (won ? 1 : 0),
        totalChallengesCompleted: currentStats.totalChallengesCompleted + challengesCompleted,
      });
    } catch (err) {
      console.error("Error updating stats:", err);
      setError("Failed to update stats");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadProfilePhoto,
    saveProfile,
    getProfile,
    saveGameHistory,
    updateStats,
  };
};
