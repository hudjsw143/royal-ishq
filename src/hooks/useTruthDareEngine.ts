import { useState, useCallback, useRef, useMemo } from 'react';
import { 
  ALL_PROMPTS, 
  TruthDarePrompt, 
  GameMode, 
  Mood, 
  RelationshipStatus, 
  IntensityLevel,
  PromptType,
  PROMPT_COUNT
} from '@/data/truthDareContent';
import {
  shuffleArray,
  getShortTermHistory,
  getLongTermHistory,
  getCategoryHistory,
  getUsageMap,
  getShuffledDeck,
  saveShuffledDeck,
  getDeckConfig,
  saveDeckConfig,
  filterByCategory,
  weightedRandomSelect,
  recordPromptUsage,
  getHistoryStats
} from '@/lib/promptWeighting';

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
  lifetimePromptsServed: number;
}

export function useTruthDareEngine(config: EngineConfig) {
  const { mode, mood, status } = config;
  
  const [state, setState] = useState<EngineState>(() => ({
    currentIntensity: 1,
    sessionHistory: new Set<string>(),
    consecutiveSkips: 0,
    roundsPlayed: 0,
    winStreak: 0,
    lifetimePromptsServed: 0,
  }));

  // Ref to track if deck needs reshuffling
  const deckConfigRef = useRef<{ mode: string; mood: string; status: string } | null>(null);

  // Filter prompts based on mode, mood, status (base filter)
  const baseFilteredPrompts = useMemo(() => {
    return ALL_PROMPTS.filter(prompt => 
      prompt.mode === mode &&
      prompt.mood === mood &&
      prompt.status === status
    );
  }, [mode, mood, status]);

  // Check if deck config changed and needs reshuffle
  const needsReshuffle = useCallback((): boolean => {
    const currentConfig = getDeckConfig();
    if (!currentConfig) return true;
    
    return (
      currentConfig.mode !== mode ||
      currentConfig.mood !== mood ||
      currentConfig.status !== status
    );
  }, [mode, mood, status]);

  // Create or get shuffled deck
  const getOrCreateDeck = useCallback((type: PromptType, intensity: IntensityLevel): TruthDarePrompt[] => {
    // If config changed, we need fresh filtering
    if (needsReshuffle()) {
      saveDeckConfig({
        mode,
        mood,
        status,
        lastShuffleTime: Date.now()
      });
      // Clear old deck since config changed
      saveShuffledDeck([]);
    }

    // Get existing deck
    let deck = getShuffledDeck();
    
    // Filter deck to match current type and intensity
    deck = deck.filter(p => 
      p.type === type && 
      p.intensity <= intensity &&
      !state.sessionHistory.has(p.id)
    );

    // If deck is empty or too small, reshuffle from base
    if (deck.length < 3) {
      const eligiblePrompts = baseFilteredPrompts.filter(p => 
        p.type === type && 
        p.intensity <= intensity &&
        !state.sessionHistory.has(p.id)
      );
      
      // Shuffle the eligible prompts
      deck = shuffleArray(eligiblePrompts);
      saveShuffledDeck(deck);
    }

    return deck;
  }, [mode, mood, status, baseFilteredPrompts, needsReshuffle, state.sessionHistory]);

  // Get a random prompt with multi-layer anti-repetition
  const getPrompt = useCallback((type: PromptType): TruthDarePrompt | null => {
    const intensity = state.currentIntensity;
    
    // Get or create shuffled deck
    const deck = getOrCreateDeck(type, intensity);
    
    if (deck.length === 0) {
      // Fallback: if even shuffled deck is empty, reset session and try again
      if (state.sessionHistory.size > 0) {
        setState(prev => ({
          ...prev,
          sessionHistory: new Set<string>(),
        }));
        
        // Get fresh deck with cleared session
        const freshPrompts = baseFilteredPrompts.filter(p => 
          p.type === type && p.intensity <= intensity
        );
        
        if (freshPrompts.length > 0) {
          const shuffled = shuffleArray(freshPrompts);
          const selected = shuffled[0];
          recordPromptUsage(selected.id, selected.category);
          saveShuffledDeck(shuffled.slice(1));
          
          setState(prev => ({
            ...prev,
            sessionHistory: new Set([selected.id]),
            roundsPlayed: prev.roundsPlayed + 1,
            lifetimePromptsServed: prev.lifetimePromptsServed + 1,
          }));
          
          return selected;
        }
      }
      return null;
    }

    // Apply category rotation filter
    const categoryHistory = getCategoryHistory();
    let filteredDeck = filterByCategory(deck, categoryHistory);
    
    // If category filter is too restrictive, use full deck
    if (filteredDeck.length === 0) {
      filteredDeck = deck;
    }

    // Apply weighted random selection for extra anti-repetition
    const shortTermHistory = getShortTermHistory();
    const longTermHistory = getLongTermHistory();
    const usageMap = getUsageMap();
    
    const selected = weightedRandomSelect(
      filteredDeck,
      shortTermHistory,
      longTermHistory,
      usageMap
    );

    if (!selected) {
      // Ultimate fallback: just take first from deck
      const fallback = deck[0];
      if (fallback) {
        recordPromptUsage(fallback.id, fallback.category);
        saveShuffledDeck(deck.slice(1));
        
        setState(prev => ({
          ...prev,
          sessionHistory: new Set([...prev.sessionHistory, fallback.id]),
          roundsPlayed: prev.roundsPlayed + 1,
          lifetimePromptsServed: prev.lifetimePromptsServed + 1,
        }));
        
        return fallback;
      }
      return null;
    }

    // Record usage in all history layers
    recordPromptUsage(selected.id, selected.category);
    
    // Remove selected from deck and save
    const remainingDeck = deck.filter(p => p.id !== selected.id);
    saveShuffledDeck(remainingDeck);

    // Update session state
    setState(prev => ({
      ...prev,
      sessionHistory: new Set([...prev.sessionHistory, selected.id]),
      roundsPlayed: prev.roundsPlayed + 1,
      lifetimePromptsServed: prev.lifetimePromptsServed + 1,
    }));

    return selected;
  }, [state.currentIntensity, state.sessionHistory, baseFilteredPrompts, getOrCreateDeck]);

  // Handle user completing a prompt (increases intensity over time)
  const onPromptCompleted = useCallback(() => {
    setState(prev => {
      const newWinStreak = prev.winStreak + 1;
      
      // Natural intensity progression based on gameplay duration and win streaks
      let newIntensity = prev.currentIntensity;
      
      // Increase intensity every 4 completed prompts (smooth progression)
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
      lifetimePromptsServed: 0,
    });
    // Don't clear localStorage histories - they persist across sessions
  }, []);

  // Get current intensity level (for UI display if needed)
  const getIntensityLabel = useCallback((): string => {
    const labels: Record<IntensityLevel, string> = {
      1: 'Light & Playful',
      2: 'Getting Warmer',
      3: 'Deeper Connection',
      4: 'Intimate',
      5: 'Soul Deep',
    };
    return labels[state.currentIntensity];
  }, [state.currentIntensity]);

  // Get engine stats for debugging/display
  const getEngineStats = useCallback(() => {
    const historyStats = getHistoryStats();
    return {
      totalPrompts: PROMPT_COUNT,
      filteredPrompts: baseFilteredPrompts.length,
      sessionHistorySize: state.sessionHistory.size,
      roundsPlayed: state.roundsPlayed,
      currentIntensity: state.currentIntensity,
      ...historyStats
    };
  }, [baseFilteredPrompts.length, state.sessionHistory.size, state.roundsPlayed, state.currentIntensity]);

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
    totalPrompts: PROMPT_COUNT,
    getEngineStats,
  };
}
