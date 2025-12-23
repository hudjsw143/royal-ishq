// Advanced Prompt Weighting and Selection Algorithms
// Provides multi-layer anti-repetition and intelligent prompt selection

import { TruthDarePrompt, PromptType, IntensityLevel } from '@/data/truthDareContent';

// Storage keys
const SHORT_TERM_KEY = 'royalIshq_shortTermHistory';
const LONG_TERM_KEY = 'royalIshq_longTermHistory';
const CATEGORY_KEY = 'royalIshq_categoryHistory';
const USAGE_MAP_KEY = 'royalIshq_usageMap';
const SHUFFLED_DECK_KEY = 'royalIshq_shuffledDeck';
const DECK_CONFIG_KEY = 'royalIshq_deckConfig';

// Constants
const SHORT_TERM_LIMIT = 100;
const LONG_TERM_LIMIT = 500;
const CATEGORY_HISTORY_LIMIT = 5;

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Storage helpers
export function getShortTermHistory(): string[] {
  try {
    const stored = localStorage.getItem(SHORT_TERM_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveShortTermHistory(history: string[]): void {
  try {
    localStorage.setItem(SHORT_TERM_KEY, JSON.stringify(history.slice(-SHORT_TERM_LIMIT)));
  } catch {
    // Silent fail
  }
}

export function getLongTermHistory(): string[] {
  try {
    const stored = localStorage.getItem(LONG_TERM_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLongTermHistory(history: string[]): void {
  try {
    localStorage.setItem(LONG_TERM_KEY, JSON.stringify(history.slice(-LONG_TERM_LIMIT)));
  } catch {
    // Silent fail
  }
}

export function getCategoryHistory(): string[] {
  try {
    const stored = localStorage.getItem(CATEGORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCategoryHistory(history: string[]): void {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(history.slice(-CATEGORY_HISTORY_LIMIT)));
  } catch {
    // Silent fail
  }
}

export function getUsageMap(): Record<string, number> {
  try {
    const stored = localStorage.getItem(USAGE_MAP_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveUsageMap(map: Record<string, number>): void {
  try {
    localStorage.setItem(USAGE_MAP_KEY, JSON.stringify(map));
  } catch {
    // Silent fail
  }
}

interface DeckConfig {
  mode: string;
  mood: string;
  status: string;
  lastShuffleTime: number;
}

export function getShuffledDeck(): TruthDarePrompt[] {
  try {
    const stored = localStorage.getItem(SHUFFLED_DECK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveShuffledDeck(deck: TruthDarePrompt[]): void {
  try {
    localStorage.setItem(SHUFFLED_DECK_KEY, JSON.stringify(deck));
  } catch {
    // Silent fail
  }
}

export function getDeckConfig(): DeckConfig | null {
  try {
    const stored = localStorage.getItem(DECK_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveDeckConfig(config: DeckConfig): void {
  try {
    localStorage.setItem(DECK_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Silent fail
  }
}

// Calculate weight for a prompt based on usage history
// Higher weight = more likely to be selected
export function calculatePromptWeight(
  promptId: string,
  shortTermHistory: string[],
  longTermHistory: string[],
  usageMap: Record<string, number>
): number {
  // Base weight
  let weight = 100;
  
  // Check short-term history (recent usage = very low weight)
  const shortTermIndex = shortTermHistory.indexOf(promptId);
  if (shortTermIndex !== -1) {
    const recency = shortTermHistory.length - shortTermIndex;
    // If used in last 20 prompts, drastically reduce weight
    if (recency <= 20) {
      weight = 0; // Block completely if very recent
    } else if (recency <= 50) {
      weight = Math.floor((recency - 20) * 1.5); // Gradual recovery
    } else {
      weight = Math.floor(50 + (recency - 50)); // Slower recovery after 50
    }
  }
  
  // Check long-term history for additional penalty
  const longTermIndex = longTermHistory.indexOf(promptId);
  if (longTermIndex !== -1) {
    const longTermRecency = longTermHistory.length - longTermIndex;
    // Apply diminishing penalty based on long-term position
    if (longTermRecency <= 100 && weight > 0) {
      weight = Math.floor(weight * 0.7); // 30% penalty for recent long-term
    } else if (longTermRecency <= 200 && weight > 0) {
      weight = Math.floor(weight * 0.85); // 15% penalty
    }
  }
  
  // Apply usage count penalty (heavily used prompts get deprioritized)
  const usageCount = usageMap[promptId] || 0;
  if (usageCount > 0) {
    // Logarithmic decay based on usage count
    const usagePenalty = Math.log2(usageCount + 1) * 10;
    weight = Math.max(0, weight - usagePenalty);
  }
  
  // Add small random factor to prevent predictable patterns
  weight += Math.floor(Math.random() * 10);
  
  return Math.max(0, weight);
}

// Filter prompts to avoid recent categories
export function filterByCategory(
  prompts: TruthDarePrompt[],
  categoryHistory: string[]
): TruthDarePrompt[] {
  if (categoryHistory.length === 0) return prompts;
  
  // Get last 3 categories used
  const recentCategories = categoryHistory.slice(-3);
  
  // Try to filter out recent categories
  const filtered = prompts.filter(p => !recentCategories.includes(p.category));
  
  // If filtering leaves us with too few options, relax the constraint
  if (filtered.length >= 3) {
    return filtered;
  }
  
  // Fallback: only avoid the most recent category
  const lastCategory = categoryHistory[categoryHistory.length - 1];
  const relaxedFilter = prompts.filter(p => p.category !== lastCategory);
  
  return relaxedFilter.length > 0 ? relaxedFilter : prompts;
}

// Weighted random selection from array
export function weightedRandomSelect(
  prompts: TruthDarePrompt[],
  shortTermHistory: string[],
  longTermHistory: string[],
  usageMap: Record<string, number>
): TruthDarePrompt | null {
  if (prompts.length === 0) return null;
  
  // Calculate weights for all prompts
  const weightsMap = prompts.map(prompt => ({
    prompt,
    weight: calculatePromptWeight(prompt.id, shortTermHistory, longTermHistory, usageMap)
  }));
  
  // Filter out zero-weight prompts if possible
  const nonZeroWeight = weightsMap.filter(w => w.weight > 0);
  const candidates = nonZeroWeight.length > 0 ? nonZeroWeight : weightsMap;
  
  // If all weights are zero, assign equal weights
  if (candidates.every(c => c.weight === 0)) {
    candidates.forEach(c => c.weight = 1);
  }
  
  // Calculate total weight
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  
  // Random selection based on weight
  let random = Math.random() * totalWeight;
  
  for (const candidate of candidates) {
    random -= candidate.weight;
    if (random <= 0) {
      return candidate.prompt;
    }
  }
  
  // Fallback to last candidate
  return candidates[candidates.length - 1].prompt;
}

// Record prompt usage
export function recordPromptUsage(promptId: string, category: string): void {
  // Update short-term history
  const shortTerm = getShortTermHistory();
  shortTerm.push(promptId);
  saveShortTermHistory(shortTerm);
  
  // Update long-term history
  const longTerm = getLongTermHistory();
  longTerm.push(promptId);
  saveLongTermHistory(longTerm);
  
  // Update category history
  const categoryHist = getCategoryHistory();
  categoryHist.push(category);
  saveCategoryHistory(categoryHist);
  
  // Update usage map
  const usageMap = getUsageMap();
  usageMap[promptId] = (usageMap[promptId] || 0) + 1;
  saveUsageMap(usageMap);
}

// Clear all history (for testing or reset)
export function clearAllHistory(): void {
  localStorage.removeItem(SHORT_TERM_KEY);
  localStorage.removeItem(LONG_TERM_KEY);
  localStorage.removeItem(CATEGORY_KEY);
  localStorage.removeItem(USAGE_MAP_KEY);
  localStorage.removeItem(SHUFFLED_DECK_KEY);
  localStorage.removeItem(DECK_CONFIG_KEY);
}

// Get stats for debugging
export function getHistoryStats(): {
  shortTermCount: number;
  longTermCount: number;
  categoryCount: number;
  uniquePromptsUsed: number;
  totalUsage: number;
} {
  const usageMap = getUsageMap();
  const totalUsage = Object.values(usageMap).reduce((sum, count) => sum + count, 0);
  
  return {
    shortTermCount: getShortTermHistory().length,
    longTermCount: getLongTermHistory().length,
    categoryCount: getCategoryHistory().length,
    uniquePromptsUsed: Object.keys(usageMap).length,
    totalUsage
  };
}
