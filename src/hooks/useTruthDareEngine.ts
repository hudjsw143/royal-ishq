import { useState, useCallback, useRef } from 'react';
import { 
  ALL_PROMPTS, 
  TruthDarePrompt, 
  GameMode, 
  Mood, 
  RelationshipStatus, 
  IntensityLevel,
  PromptType 
} from '@/data/truthDareContent';

interface EngineConfig {
  mode: GameMode;
  mood: Mood;
  status: RelationshipStatus;
}

interface EngineState {
  currentIntensity: IntensityLevel;
  sessionHistory: Set<string>;
  consecutiveSkips: number;
  roundsPlayed: number;
  winStreak: number;
}

// Long-term storage key for cross-session history
const LONG_TERM_HISTORY_KEY = 'royal_ishq_prompt_history';
const MAX_LONG_TERM_HISTORY = 200;

// Get long-term history from localStorage
const getLongTermHistory = (): string[] => {
  try {
    const stored = localStorage.getItem(LONG_TERM_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save to long-term history
const saveLongTermHistory = (history: string[]) => {
  try {
    // Keep only the most recent prompts
    const trimmed = history.slice(-MAX_LONG_TERM_HISTORY);
    localStorage.setItem(LONG_TERM_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Silent fail for localStorage issues
  }
};

export function useTruthDareEngine(config: EngineConfig) {
  const { mode, mood, status } = config;
  
  const [state, setState] = useState<EngineState>({
    currentIntensity: 1,
    sessionHistory: new Set<string>(),
    consecutiveSkips: 0,
    roundsPlayed: 0,
    winStreak: 0,
  });

  const longTermHistoryRef = useRef<string[]>(getLongTermHistory());

  // Filter prompts based on all four mandatory filters
  const getFilteredPrompts = useCallback((type: PromptType, intensity: IntensityLevel): TruthDarePrompt[] => {
    return ALL_PROMPTS.filter(prompt => 
      prompt.type === type &&
      prompt.mode === mode &&
      prompt.mood === mood &&
      prompt.status === status &&
      prompt.intensity <= intensity // Allow prompts at or below current intensity
    );
  }, [mode, mood, status]);

  // Anti-repetition: Check if prompt was used recently
  const isPromptAvailable = useCallback((promptId: string): boolean => {
    // Check session history (no repeats within session)
    if (state.sessionHistory.has(promptId)) {
      return false;
    }
    
    // Check long-term history (rare repeats after many sessions)
    const longTermIndex = longTermHistoryRef.current.indexOf(promptId);
    if (longTermIndex !== -1) {
      // Allow if it's been at least 50 prompts since last use
      return longTermHistoryRef.current.length - longTermIndex > 50;
    }
    
    return true;
  }, [state.sessionHistory]);

  // Get a random prompt with anti-repetition
  const getPrompt = useCallback((type: PromptType): TruthDarePrompt | null => {
    const intensity = state.currentIntensity;
    
    // Try to find an available prompt, starting from current intensity and going down
    for (let i = intensity; i >= 1; i--) {
      const filtered = getFilteredPrompts(type, i as IntensityLevel);
      const available = filtered.filter(p => isPromptAvailable(p.id));
      
      if (available.length > 0) {
        // Random selection from available prompts
        const randomIndex = Math.floor(Math.random() * available.length);
        const selected = available[randomIndex];
        
        // Update session history
        setState(prev => ({
          ...prev,
          sessionHistory: new Set([...prev.sessionHistory, selected.id]),
          roundsPlayed: prev.roundsPlayed + 1,
        }));
        
        // Update long-term history
        longTermHistoryRef.current.push(selected.id);
        saveLongTermHistory(longTermHistoryRef.current);
        
        return selected;
      }
    }
    
    // If no available prompts (all used), reset session history and try again
    if (state.sessionHistory.size > 0) {
      setState(prev => ({
        ...prev,
        sessionHistory: new Set<string>(),
      }));
      
      const filtered = getFilteredPrompts(type, intensity);
      if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        return filtered[randomIndex];
      }
    }
    
    return null;
  }, [state.currentIntensity, state.sessionHistory, getFilteredPrompts, isPromptAvailable]);

  // Handle user completing a prompt (increases intensity over time)
  const onPromptCompleted = useCallback(() => {
    setState(prev => {
      const newRounds = prev.roundsPlayed;
      const newWinStreak = prev.winStreak + 1;
      
      // Natural intensity progression based on gameplay duration and win streaks
      let newIntensity = prev.currentIntensity;
      
      // Increase intensity every 3-5 completed prompts
      if (newWinStreak % 4 === 0 && newIntensity < 5) {
        newIntensity = (newIntensity + 1) as IntensityLevel;
      }
      
      return {
        ...prev,
        currentIntensity: newIntensity,
        winStreak: newWinStreak,
        consecutiveSkips: 0,
      };
    });
  }, []);

  // Handle user skipping a prompt (decreases intensity if too many skips)
  const onPromptSkipped = useCallback(() => {
    setState(prev => {
      const newSkips = prev.consecutiveSkips + 1;
      
      // Downgrade intensity after 2 consecutive skips (shows discomfort)
      let newIntensity = prev.currentIntensity;
      if (newSkips >= 2 && newIntensity > 1) {
        newIntensity = (newIntensity - 1) as IntensityLevel;
      }
      
      return {
        ...prev,
        consecutiveSkips: newSkips,
        currentIntensity: newIntensity,
        winStreak: 0, // Reset win streak on skip
      };
    });
  }, []);

  // Handle user hesitating (mild intensity adjustment)
  const onPromptHesitation = useCallback(() => {
    setState(prev => ({
      ...prev,
      // Don't decrease immediately, but prevent increase
      winStreak: Math.max(0, prev.winStreak - 2),
    }));
  }, []);

  // Reset engine state for new game
  const resetEngine = useCallback(() => {
    setState({
      currentIntensity: 1,
      sessionHistory: new Set<string>(),
      consecutiveSkips: 0,
      roundsPlayed: 0,
      winStreak: 0,
    });
  }, []);

  // Get current intensity level (for UI display if needed)
  const getIntensityLabel = useCallback((): string => {
    const labels = {
      1: 'Light & Playful',
      2: 'Getting Warmer',
      3: 'Deeper Connection',
      4: 'Intimate',
      5: 'Soul Deep',
    };
    return labels[state.currentIntensity];
  }, [state.currentIntensity]);

  return {
    getPrompt,
    onPromptCompleted,
    onPromptSkipped,
    onPromptHesitation,
    resetEngine,
    currentIntensity: state.currentIntensity,
    getIntensityLabel,
    roundsPlayed: state.roundsPlayed,
    sessionHistorySize: state.sessionHistory.size,
  };
}
