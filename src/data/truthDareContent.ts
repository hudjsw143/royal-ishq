// Truth & Dare Content Database - EXPANDED VERSION (500+ prompts)
// Organized by: GameMode -> Mood -> RelationshipStatus -> Intensity Level (1-5)

export type GameMode = 'offline' | 'ai' | 'online';
export type Mood = 'casual' | 'intimate';
export type RelationshipStatus = 'relationship' | 'married';
export type IntensityLevel = 1 | 2 | 3 | 4 | 5;
export type PromptType = 'truth' | 'dare';

export interface TruthDarePrompt {
  id: string;
  type: PromptType;
  content: string;
  mode: GameMode;
  mood: Mood;
  status: RelationshipStatus;
  intensity: IntensityLevel;
  category: string;
}

// Helper to generate unique IDs
const generateId = (prefix: string, index: number) => `${prefix}_${index}`;

// ============================================
// OFFLINE MODE - Physical presence based
// ============================================

const offlineCasualRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1 - Light & Fun
  { type: 'truth', content: "What's the first thing you noticed about me when we met?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's my most adorable habit that makes you smile?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "If you could describe our relationship in one movie title, what would it be?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What song reminds you of us?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's your favorite memory of us so far?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's the weirdest thing about me that you find cute?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "If we were cartoon characters, who would we be?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's your favorite outfit I wear?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What food reminds you of our relationship?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's my laugh like according to you?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  
  // Intensity 2 - Getting Warmer
  { type: 'truth', content: "When did you first realize you had feelings for me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's something I do that makes your heart skip a beat?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What were you thinking during our first date?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's the sweetest thing I've ever done for you without knowing?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'appreciation' },
  { type: 'truth', content: "If you had to pick one moment to relive with me, which would it be?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's your favorite way to spend time with me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'preference' },
  { type: 'truth', content: "What do you think I'm most passionate about?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'observation' },
  { type: 'truth', content: "What's something you noticed about me that I don't know you noticed?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'observation' },
  { type: 'truth', content: "What made you want to get to know me better?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's a small gesture of mine that means a lot to you?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'appreciation' },
  
  // Intensity 3 - Deeper Connection
  { type: 'truth', content: "What's something you've never told me but always wanted to?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "What's your biggest fear about our relationship?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "Is there something about me you wish you could change?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What do you think is the biggest challenge we'll face together?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'future' },
  { type: 'truth', content: "What's one thing about me that sometimes frustrates you?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's your love language and how do I fulfill it?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'truth', content: "What's something you want us to work on together?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'growth' },
  { type: 'truth', content: "Have you ever been jealous in our relationship? When?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's one insecurity you have about us?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "What's the most important lesson you've learned from our relationship?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'growth' },
  
  // Intensity 4 - Intimate
  { type: 'truth', content: "Where do you see us in five years?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'truth', content: "What's your dream date with me that we haven't done yet?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'desire' },
  { type: 'truth', content: "What makes our relationship different from any you've had before?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'reflection' },
  { type: 'truth', content: "What do you value most about having me in your life?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'appreciation' },
  { type: 'truth', content: "What's the hardest thing you've had to tell me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "If we had a song that described our journey, what would the lyrics say?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'creative' },
  { type: 'truth', content: "What do you need from me that you haven't asked for?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What's a fear about love that I helped you overcome?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'growth' },
  
  // Intensity 5 - Soul Deep
  { type: 'truth', content: "If we could travel anywhere together, where would you take me and why?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'truth', content: "What does forever with me look like in your heart?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'truth', content: "What's the most vulnerable you've ever felt with me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'vulnerability' },
  { type: 'truth', content: "What would you sacrifice for our relationship?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'commitment' },
  { type: 'truth', content: "What's your deepest hope for us?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'truth', content: "When did you first think 'this could be real love'?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'realization' },
];

const offlineCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1 - Light & Fun
  { type: 'dare', content: "Hold my hand and look into my eyes for 30 seconds without laughing.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'connection' },
  { type: 'dare', content: "Give me your best impression of how I walk.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Describe me using only hand gestures.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show me your goofiest dance move right now.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Make the funniest face you can and hold it for 10 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Do your best impression of me ordering food.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Give me a high-five and then try to do a secret handshake on the spot.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Tell me a joke that would make me laugh out loud.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Pretend to be a tour guide describing our relationship to tourists.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'creative' },
  { type: 'dare', content: "Make up a rap about us on the spot.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'creative' },
  
  // Intensity 2 - Getting Warmer
  { type: 'dare', content: "Give me a forehead kiss and whisper something sweet.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Recreate our first meeting the way you remember it.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'dare', content: "Play with my hair for one minute while telling me what you love about me.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Give me a back hug and hold for 20 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Compliment me in three different languages (or make them up!).", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Feed me something from your hand and vice versa.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'intimate' },
  { type: 'dare', content: "Give me a piggyback ride for 10 steps.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'fun' },
  { type: 'dare', content: "Serenade me with any song, no matter how badly.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Draw a heart on my hand with your finger.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Hold both my hands and sway with me for 30 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'connection' },
  
  // Intensity 3 - Deeper Connection
  { type: 'dare', content: "Write 'I love you' on my palm with your finger, slowly.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'dare', content: "Slow dance with me without any music for 30 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'dare', content: "Give me a gentle nose-to-nose touch and maintain eye contact.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'intimate' },
  { type: 'dare', content: "Trace the outline of my face gently with your fingertip.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'sensory' },
  { type: 'dare', content: "Whisper the sweetest thing you've ever thought about me in my ear.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'dare', content: "Hug me for one full minute without saying anything.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'dare', content: "Kiss my cheek and then my other cheek, slowly.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'affection' },
  { type: 'dare', content: "Create a new pet name for me on the spot and explain why.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'creative' },
  
  // Intensity 4 - Intimate
  { type: 'dare', content: "Whisper your favorite thing about us in my ear.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'intimate' },
  { type: 'dare', content: "Hold both my hands and tell me three things you admire about me.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'appreciation' },
  { type: 'dare', content: "Look into my eyes and tell me what you see there.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'connection' },
  { type: 'dare', content: "Give me the most heartfelt forehead kiss you can.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'affection' },
  { type: 'dare', content: "Hold me and describe our future together in whispers.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'romantic' },
  { type: 'dare', content: "Write a one-line love note and read it to me.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'creative' },
  
  // Intensity 5 - Soul Deep
  { type: 'dare', content: "Embrace me and tell me your most sincere promise.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'commitment' },
  { type: 'dare', content: "Cup my face and tell me exactly how you feel right now.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'emotional' },
  { type: 'dare', content: "Hold me close and whisper something you've never told anyone.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'vulnerability' },
  { type: 'dare', content: "Create a moment right now that you want us to always remember.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'romantic' },
];

const offlineIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's the most romantic thing you've ever dreamed about us doing?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'romantic' },
  { type: 'truth', content: "What about me makes you feel most safe?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'feeling' },
  { type: 'truth', content: "What makes you feel closest to me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'connection' },
  { type: 'truth', content: "What's your favorite way to show me you care?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'love' },
  { type: 'truth', content: "What's the most loved you've ever felt with me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "When you think about our future, what excites you most?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'future' },
  { type: 'truth', content: "What's a moment when you felt completely at peace with me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'peace' },
  { type: 'truth', content: "How do I make you feel when we're alone together?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's the most comforting thing about being with me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'comfort' },
  { type: 'truth', content: "What's a quiet moment with me you treasure?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'memory' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's something about our connection that you can't explain to anyone else?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'truth', content: "When do you feel most connected to me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'truth', content: "What's a way I make you feel special that's unique to us?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'special' },
  { type: 'truth', content: "What do you feel when I hold you?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'feeling' },
  { type: 'truth', content: "What's your favorite thing about our physical closeness?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'intimacy' },
  { type: 'truth', content: "What's a way I could make you feel even more loved?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'desire' },
  { type: 'truth', content: "What's your deepest wish for us?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'truth', content: "What makes our love different from anything else you've known?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'reflection' },
  { type: 'truth', content: "What's the most intimate non-physical moment we've shared?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'intimacy' },
  { type: 'truth', content: "What do you need from me in our quiet moments?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'need' },
  
  // Intensity 5
  { type: 'truth', content: "What does forever with me look like in your heart?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'truth', content: "What's the most vulnerable thing you want to share with me right now?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'vulnerability' },
  { type: 'truth', content: "What's a feeling you have for me that words can't quite capture?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What would you whisper to me if these were our last moments?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What part of your soul have you given to me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
];

const offlineIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Hold my hands and take a deep breath together.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'connection' },
  { type: 'dare', content: "Gently brush the hair from my face while looking at me.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'tenderness' },
  { type: 'dare', content: "Cup my face gently and look into my eyes while breathing slowly together.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'connection' },
  { type: 'dare', content: "Trace your fingers slowly along my palm while telling me what you feel.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'sensory' },
  { type: 'dare', content: "Press your forehead against mine and share a moment of silence.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'peace' },
  { type: 'dare', content: "Intertwine our fingers and describe what our hands represent.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'symbolic' },
  
  // Intensity 3-4
  { type: 'dare', content: "Give me a slow, meaningful forehead kiss that lasts 10 seconds.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'affection' },
  { type: 'dare', content: "Hold me close and whisper something you've never said before.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'emotional' },
  { type: 'dare', content: "Trace 'I love you' on my back with your finger.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'sensory' },
  { type: 'dare', content: "Hold me from behind and breathe with me for one minute.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'dare', content: "Gently stroke my hair while telling me why you chose me.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'affection' },
  { type: 'dare', content: "Embrace me and synchronize our breathing for one minute.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'connection' },
  { type: 'dare', content: "Whisper your deepest feeling for me into my ear.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'emotional' },
  { type: 'dare', content: "Hold my face gently and tell me what my eyes say to you.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'connection' },
  
  // Intensity 5
  { type: 'dare', content: "Place your hand over my heart and tell me what it means to you.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'emotional' },
  { type: 'dare', content: "Create a moment of absolute stillness with me - just us existing together.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'peace' },
  { type: 'dare', content: "Hold me and speak from your heart without thinking.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'vulnerability' },
  { type: 'dare', content: "Share a silent embrace and let our bodies communicate.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'intimacy' },
];

// Married versions - appreciation and memory focused
const offlineCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'truth', content: "What's your favorite memory from our wedding day?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What made you fall in love with me all over again recently?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'appreciation' },
  { type: 'truth', content: "What's the funniest argument we've ever had?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's the most ridiculous thing we've done as a married couple?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's your favorite 'us' thing that others might find boring?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the best meal we've ever shared together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What do I do that still makes you laugh after all this time?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's your favorite photo of us?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  
  // Intensity 2
  { type: 'truth', content: "What do you think is our greatest strength as a couple?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  { type: 'truth', content: "What's something I do that still surprises you after all this time?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'observation' },
  { type: 'truth', content: "What's the most adventurous thing we've done in our marriage?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What habit of mine have you grown to love?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's a silly thing that's become our tradition?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'tradition' },
  { type: 'truth', content: "When do you feel most proud to be married to me?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  
  // Intensity 3
  { type: 'truth', content: "If we could renew our vows, what would you add?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'future' },
  { type: 'truth', content: "What's your favorite tradition we've created together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'tradition' },
  { type: 'truth', content: "What's the hardest thing we've overcome together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'growth' },
  { type: 'truth', content: "What do you appreciate about our marriage that you didn't expect?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
  { type: 'truth', content: "What's a moment when you knew you'd made the right choice marrying me?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'realization' },
  { type: 'truth', content: "What's something about married life that surprised you?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
  
  // Intensity 4-5
  { type: 'truth', content: "What adventure do you still want us to have together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'future' },
  { type: 'truth', content: "How has your love for me changed since we got married?", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'growth' },
  { type: 'truth', content: "What's a dream you want us to chase together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'future' },
  { type: 'truth', content: "What does our marriage mean to you in one sentence?", mode: 'offline', mood: 'casual', status: 'married', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What would you write about us in your autobiography?", mode: 'offline', mood: 'casual', status: 'married', intensity: 5, category: 'reflection' },
];

const offlineCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Recreate our first dance together, right here.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Do your best impression of me on our wedding day.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show me how you looked when you saw me at the altar.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Act out how you proposed/reacted to the proposal.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Do a victory dance celebrating our marriage.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Give me a high-five and then a dramatic bow for being the best spouse.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'dare', content: "Give me a spontaneous compliment that you haven't given in a while.", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  { type: 'dare', content: "Recreate our honeymoon moment (the appropriate one!).", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'dare', content: "Feed me dessert like we're newlyweds at our reception.", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'dare', content: "Give me a kiss like it's our wedding day all over again.", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Serenade me with our wedding song (or try to!).", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'creative' },
  
  // Intensity 3-4
  { type: 'dare', content: "Hold my hands and tell me three reasons you'd marry me again.", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'appreciation' },
  { type: 'dare', content: "Write a new vow to me right now and share it.", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'commitment' },
  { type: 'dare', content: "Describe our marriage as if you're telling our grandchildren about it.", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'storytelling' },
  { type: 'dare', content: "Give me a long, heartfelt hug like it's our wedding day.", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'affection' },
  { type: 'dare', content: "Create a toast to us and deliver it dramatically.", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'creative' },
  
  // Intensity 5
  { type: 'dare', content: "Hold me and tell me why you'd choose this life with me again.", mode: 'offline', mood: 'casual', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'dare', content: "Renew one of our wedding vows right now, from the heart.", mode: 'offline', mood: 'casual', status: 'married', intensity: 5, category: 'commitment' },
];

const offlineIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's the most romantic moment we've shared in our marriage?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What makes our marriage feel like home to you?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'feeling' },
  { type: 'truth', content: "When do you feel most at peace in our marriage?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'peace' },
  { type: 'truth', content: "What's your favorite way we spend quiet time together?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'comfort' },
  { type: 'truth', content: "How has your love for me changed since we got married?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's a moment of tenderness between us that you treasure?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What does waking up next to me feel like?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's the most comforting thing about being married to me?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'comfort' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's something you wish we did more often?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'desire' },
  { type: 'truth', content: "What's a quiet moment in our marriage that meant everything?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What's a way I love you that no one else sees?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'intimacy' },
  { type: 'truth', content: "What's something I do that makes you feel completely loved?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'love' },
  { type: 'truth', content: "What's the deepest thing marriage has taught you about love?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'growth' },
  { type: 'truth', content: "What do you cherish most about our intimate life together?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'intimacy' },
  { type: 'truth', content: "What's a need of yours that I fulfill without knowing?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'awareness' },
  { type: 'truth', content: "What's a feeling you have when we're alone that you can't explain?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'depth' },
  
  // Intensity 5
  { type: 'truth', content: "What promise would you make to me for the rest of our lives?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'truth', content: "What does growing old with me look like in your heart?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'future' },
  { type: 'truth', content: "What's the deepest connection you feel to me?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What part of your soul belongs only to us?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'depth' },
];

const offlineIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Hold my hands and breathe together for one minute.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'connection' },
  { type: 'dare', content: "Gently trace the lines on my face and describe what you see.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'tenderness' },
  { type: 'dare', content: "Renew one of our wedding vows right now, from the heart.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'commitment' },
  { type: 'dare', content: "Hold me and tell me what you're grateful for today.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'gratitude' },
  { type: 'dare', content: "Kiss my forehead slowly while whispering something meaningful.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'affection' },
  
  // Intensity 3-4
  { type: 'dare', content: "Hold me like you did on our honeymoon.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'affection' },
  { type: 'dare', content: "Place your hand on my heart and tell me what it holds.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'emotional' },
  { type: 'dare', content: "Whisper what you love about our life together in my ear.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'appreciation' },
  { type: 'dare', content: "Embrace me and describe what home means to you.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'connection' },
  { type: 'dare', content: "Whisper something you've always felt but never said.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'vulnerability' },
  { type: 'dare', content: "Hold my face and look into my eyes while sharing your heart.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'emotional' },
  { type: 'dare', content: "Create a moment of complete stillness together.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'peace' },
  
  // Intensity 5
  { type: 'dare', content: "Create a new private tradition between us, just for this moment.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'connection' },
  { type: 'dare', content: "Hold me and speak from the deepest part of your heart.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'vulnerability' },
  { type: 'dare', content: "Let our souls speak through an embrace without words.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'intimacy' },
];

// ============================================
// AI MODE - Psychological and prank-style
// ============================================

const aiCasualRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'truth', content: "What's a secret crush you had before meeting your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the most embarrassing thing you've done to impress someone?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the weirdest first date you've ever been on?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's a cringy pickup line you've actually used?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the most awkward date you've ever had?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's a guilty pleasure you hide from your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'secret' },
  { type: 'truth', content: "What's the most embarrassing thing on your phone?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's a romantic movie that secretly made you cry?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'truth', content: "What's your partner's habit that secretly annoys you?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'observation' },
  { type: 'truth', content: "Have you ever pretended to like something just to make your partner happy?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's the longest you've gone without telling your partner something important?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's something your partner does that you find oddly attractive?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'attraction' },
  { type: 'truth', content: "Have you ever lied about where you were to surprise your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's the most expensive thing you've ever bought for a relationship?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's a habit you picked up from your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's the biggest white lie you've told in your relationship?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'honesty' },
  
  // Intensity 3
  { type: 'truth', content: "What's the weirdest thing you've googled about relationships?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'fun' },
  { type: 'truth', content: "Have you ever checked your partner's phone without permission?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's something about your past that you haven't told your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'secret' },
  { type: 'truth', content: "What's the pettiest reason you've ever been mad at your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "Have you ever compared your relationship to others on social media?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'reflection' },
  { type: 'truth', content: "What's the most dramatic reaction you've had in your relationship?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'memory' },
  
  // Intensity 4-5
  { type: 'truth', content: "What's something you've always wanted to tell your partner but were too shy?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What's the scariest thought you've ever had about your relationship?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'fear' },
  { type: 'truth', content: "What's an insecurity about yourself that affects your relationship?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What's the deepest secret you haven't shared with your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 5, category: 'secret' },
  { type: 'truth', content: "What's a fear about love that you've never admitted?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 5, category: 'vulnerability' },
];

const aiCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Send your partner a voice note right now saying something sweet.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'action' },
  { type: 'dare', content: "Do your best impression of your partner when they're angry.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Do a dramatic reading of your last text to your partner.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show the most embarrassing photo of yourself on your phone.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Do your partner's signature dance move.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Act out how you looked when you first met your partner.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Make up a song about your relationship on the spot.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'creative' },
  { type: 'dare', content: "Do your best impression of your partner's morning routine.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'dare', content: "Call your partner and compliment them without laughing.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'action' },
  { type: 'dare', content: "Text your partner a romantic poem you make up on the spot.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Change your phone wallpaper to a silly photo of your partner.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'action' },
  { type: 'dare', content: "Write a haiku about your partner and read it aloud.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Send your partner an emoji-only message confessing your love.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Take a selfie making your partner's favorite face and send it.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'action' },
  
  // Intensity 3
  { type: 'dare', content: "Post something sweet about your partner on social media right now.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'public' },
  { type: 'dare', content: "Call your partner and tell them your most embarrassing secret.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'dare', content: "Change your status to something romantic for 24 hours.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'public' },
  { type: 'dare', content: "Write a 'Why I love you' list with at least 10 things and share it.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Send your partner a voice note singing their favorite song.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'creative' },
  
  // Intensity 4-5
  { type: 'dare', content: "Record a 30-second video telling your partner why they're amazing.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'creative' },
  { type: 'dare', content: "Call your partner and apologize for something you never said sorry for.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'dare', content: "Write and send a heartfelt letter to your partner right now.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 5, category: 'emotional' },
  { type: 'dare', content: "Plan a surprise for your partner and commit to doing it this week.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 5, category: 'commitment' },
];

const aiIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's a romantic gesture you've always wanted but never received?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 1, category: 'desire' },
  { type: 'truth', content: "What's the most romantic movie scene you wish could happen to you?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 1, category: 'fantasy' },
  { type: 'truth', content: "What makes you feel most beautiful/handsome in your relationship?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 1, category: 'confidence' },
  { type: 'truth', content: "What's your deepest fantasy about your relationship's future?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'future' },
  { type: 'truth', content: "What's the most romantic dream you've had about your partner?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'romantic' },
  { type: 'truth', content: "What's a way your partner makes you feel special without trying?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'appreciation' },
  { type: 'truth', content: "What's the most romantic thing you've ever done secretly?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'memory' },
  
  // Intensity 3-4
  { type: 'truth', content: "What do you find most attractive about your partner's personality?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'attraction' },
  { type: 'truth', content: "What's a love letter you've written in your head but never sent?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'unspoken' },
  { type: 'truth', content: "What's the most emotionally intimate moment you've shared?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'intimacy' },
  { type: 'truth', content: "What's a way you want to be loved that you've never asked for?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'desire' },
  { type: 'truth', content: "What moment made you realize this person was 'the one'?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'realization' },
  { type: 'truth', content: "What's the deepest thing you've felt for your partner but couldn't say?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'depth' },
  { type: 'truth', content: "What's a promise you've made to yourself about your relationship?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'commitment' },
  
  // Intensity 5
  { type: 'truth', content: "What's something you want to experience with your partner that you've never told them?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'desire' },
  { type: 'truth', content: "What's the deepest fear about love that your partner has helped heal?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'healing' },
  { type: 'truth', content: "What does unconditional love mean to you in this relationship?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
];

const aiIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Look at a photo of your partner and describe what you see in their eyes.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 1, category: 'reflection' },
  { type: 'dare', content: "Write down three things you're grateful for about your partner.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 1, category: 'gratitude' },
  { type: 'dare', content: "Write a love letter to your partner and read it out loud.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'romantic' },
  { type: 'dare', content: "Send your partner a heartfelt voice message right now.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'action' },
  { type: 'dare', content: "Describe your perfect day with your partner in detail.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'fantasy' },
  
  // Intensity 3-4
  { type: 'dare', content: "Create a playlist for your partner with songs that remind you of them.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Write a poem about your love and share it.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Text your partner something you've been wanting to say but haven't.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'dare', content: "Record a video message for your partner about your future together.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'commitment' },
  { type: 'dare', content: "Write down a promise you want to make to your partner and commit to it.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'commitment' },
  
  // Intensity 5
  { type: 'dare', content: "Plan a surprise date for your partner within the next week.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'action' },
  { type: 'dare', content: "Create a 'reasons I love you' jar and start with 10 reasons.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'creative' },
];

// AI Married
const aiCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'truth', content: "What's a funny habit your spouse has that you've never mentioned?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's the funniest thing your spouse does in their sleep?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's a song that your spouse loves but you secretly hate?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's your spouse's most endearing quirk?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's something your spouse thinks they're good at but aren't?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the most random thing you know about your spouse?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  
  // Intensity 2
  { type: 'truth', content: "What's the most ridiculous argument you've won in your marriage?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's a household chore you pretend you don't know how to do?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's the pettiest thing you've been upset about in your marriage?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's a tradition your spouse loves that you only tolerate?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'observation' },
  { type: 'truth', content: "What's the longest you've held a grudge against your spouse?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'honesty' },
  
  // Intensity 3-4
  { type: 'truth', content: "Have you ever hidden a purchase from your spouse?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's something about married life that surprised you?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
  { type: 'truth', content: "What's a fear about marriage that came true but was okay?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
  { type: 'truth', content: "What's the biggest compromise you've made in your marriage?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'growth' },
  { type: 'truth', content: "What's something you miss about life before marriage?", mode: 'ai', mood: 'casual', status: 'married', intensity: 4, category: 'reflection' },
  { type: 'truth', content: "What's an expectation about marriage that reality changed?", mode: 'ai', mood: 'casual', status: 'married', intensity: 4, category: 'growth' },
  
  // Intensity 5
  { type: 'truth', content: "What's a sacrifice you made for your marriage that was worth it?", mode: 'ai', mood: 'casual', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'truth', content: "What's the hardest thing about being married that you didn't expect?", mode: 'ai', mood: 'casual', status: 'married', intensity: 5, category: 'vulnerability' },
];

const aiCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Do an impression of your spouse when they're stressed.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Demonstrate your spouse's 'I'm right' face.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Do your spouse's morning routine in fast-forward.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show how your spouse reacts when they're hungry.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Imitate your spouse ordering at a restaurant.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'dare', content: "Text your spouse a random 'I love you' without context.", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'action' },
  { type: 'dare', content: "Call your spouse and tell them something you appreciate about them.", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  { type: 'dare', content: "Change your phone background to a funny photo of your spouse.", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'action' },
  { type: 'dare', content: "Send your spouse a meme that describes your marriage.", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  
  // Intensity 3-4
  { type: 'dare', content: "Plan a surprise breakfast in bed for your spouse this week.", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'action' },
  { type: 'dare', content: "Post a throwback wedding photo with a sweet caption.", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'public' },
  { type: 'dare', content: "Write a 'thank you' note to your spouse for something specific.", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'gratitude' },
  { type: 'dare', content: "Plan a date night and handle all the details yourself.", mode: 'ai', mood: 'casual', status: 'married', intensity: 4, category: 'action' },
  { type: 'dare', content: "Create a scrapbook page about your favorite marriage memory.", mode: 'ai', mood: 'casual', status: 'married', intensity: 4, category: 'creative' },
  
  // Intensity 5
  { type: 'dare', content: "Write and deliver renewed vows to your spouse.", mode: 'ai', mood: 'casual', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'dare', content: "Plan a second honeymoon and present the idea tonight.", mode: 'ai', mood: 'casual', status: 'married', intensity: 5, category: 'action' },
];

const aiIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's the most romantic gesture your spouse has ever made?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What makes you fall in love with your spouse all over again?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 1, category: 'feeling' },
  { type: 'truth', content: "What's a small thing your spouse does that means everything?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 1, category: 'appreciation' },
  { type: 'truth', content: "What's changed most about how you love your spouse since marriage?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's a way your spouse loves you that others don't see?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'intimacy' },
  { type: 'truth', content: "What's the most tender moment in your marriage?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'memory' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's your favorite 'married couple' moment?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What's a deeper connection you've found since getting married?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'growth' },
  { type: 'truth', content: "What's a way your marriage has healed you?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'healing' },
  { type: 'truth', content: "What's your dream retirement life with your spouse?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'future' },
  { type: 'truth', content: "What's the deepest thing marriage has taught you about yourself?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'growth' },
  { type: 'truth', content: "What's a feeling in your marriage that you couldn't have imagined before?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'discovery' },
  
  // Intensity 5
  { type: 'truth', content: "What does forever with your spouse really mean to you?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What's the most sacred part of your marriage?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 5, category: 'depth' },
];

const aiIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Write down three things you're grateful for about your marriage today.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 1, category: 'gratitude' },
  { type: 'dare', content: "Look at your wedding photos and share your favorite memory.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Write a letter to your future self about your marriage.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Create a vision board for your marriage's future.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'creative' },
  
  // Intensity 3-4
  { type: 'dare', content: "Write a new vow that captures where you are now.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'commitment' },
  { type: 'dare', content: "Create a jar of reasons you love your spouse.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Call your spouse and tell them exactly what they mean to you.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'emotional' },
  { type: 'dare', content: "Write your spouse a letter to be opened on your anniversary.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'creative' },
  
  // Intensity 5
  { type: 'dare', content: "Create a ceremony to renew your commitment to each other.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'dare', content: "Plan a 'remember why we fell in love' day.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 5, category: 'action' },
];

// ============================================
// ONLINE MODE - Distance-friendly
// ============================================

const onlineCasualRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'truth', content: "What's the last photo of me you looked at?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the cutest nickname you secretly call me in your head?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the last thing you said about me to someone else?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the most recent thing that reminded you of me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What emoji best describes how you feel about me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's your favorite message I've ever sent you?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's a song you listen to when you think of me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'music' },
  { type: 'truth', content: "What's the goofiest face you've made thinking about me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'truth', content: "What's something silly you do when you miss me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "If I was there right now, what would you want to do together?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'desire' },
  { type: 'truth', content: "What's your screen wallpaper story if it's me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What do you do right after we end a call?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'observation' },
  { type: 'truth', content: "What's a video of me you watch when you miss me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's the best surprise you've planned for me online?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What time zone struggle annoys you the most?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'fun' },
  
  // Intensity 3
  { type: 'truth', content: "What's the funniest thing about our long-distance moments?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What's the hardest part about not being physically together?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "Have you ever cried during or after our calls?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's a moment when you really wished I was there?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'longing' },
  { type: 'truth', content: "What keeps you going when the distance feels too much?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'strength' },
  
  // Intensity 4-5
  { type: 'truth', content: "What's the first thing you'll do when we're finally together?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'truth', content: "What fear about distance have we already conquered?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 4, category: 'growth' },
  { type: 'truth', content: "What has distance taught you about us?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 5, category: 'reflection' },
  { type: 'truth', content: "What makes our connection strong despite the miles?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 5, category: 'depth' },
];

const onlineCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Send me your best selfie right now, no retakes!", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Send me a voice note singing our favorite song.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'voice' },
  { type: 'dare', content: "Type three things you love about me using only emojis.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'text' },
  { type: 'dare', content: "Show me what your face looks like right now, no filter.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Send me a photo of where you are right now.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Make a funny face and send it immediately.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Send me a voice note saying 'I love you' in three languages.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'voice' },
  { type: 'dare', content: "Type a message using only song lyrics.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'creative' },
  
  // Intensity 2
  { type: 'dare', content: "Send me a 10-second video of your best dance move.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'video' },
  { type: 'dare', content: "Draw a picture of us together and send it within 2 minutes.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Send me a voice note doing your best movie narrator voice about us.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'voice' },
  { type: 'dare', content: "Show me your favorite thing of mine that you have.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'photo' },
  { type: 'dare', content: "Send a video tour of the place you wish I was at.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'video' },
  { type: 'dare', content: "Create a mini poem about us and voice note it.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Send me a 'goodnight/good morning' video right now.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'video' },
  
  // Intensity 3
  { type: 'dare', content: "Leave me a voice note pretending to be a movie narrator describing our love story.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Send a video showing me exactly what you wish we were doing together.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'video' },
  { type: 'dare', content: "Create a TikTok/reel style video about our relationship.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Send a voice note confessing something you've been shy about.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  
  // Intensity 4-5
  { type: 'dare', content: "Plan our next in-person date right now and share it.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'dare', content: "Create a countdown and share it for when we'll be together.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'dare', content: "Record a video message for our future selves to watch when together.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'dare', content: "Make a 'distance doesn't matter because...' list and share it.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 5, category: 'commitment' },
];

const onlineIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's the thing you miss most about being in my arms?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 1, category: 'longing' },
  { type: 'truth', content: "What do you think about when you're falling asleep?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 1, category: 'thought' },
  { type: 'truth', content: "What's the first thing you notice when you see me on video?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What do you miss most about being close to me?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'longing' },
  { type: 'truth', content: "What's the first thing you want to do when we meet again?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'desire' },
  { type: 'truth', content: "What part of me do you find yourself thinking about?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'attraction' },
  { type: 'truth', content: "What's a feeling you have that distance can't diminish?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'strength' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's the most romantic message I've ever sent you?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What do you imagine when you close your eyes and think of us?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'imagination' },
  { type: 'truth', content: "What's a way distance has deepened our connection?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'growth' },
  { type: 'truth', content: "What's a longing you have that words can't fully express?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'depth' },
  { type: 'truth', content: "What's something you want to tell me but haven't had the courage to?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What's the most intense emotion you've felt during our calls?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'feeling' },
  { type: 'truth', content: "What does my voice do to you when we're on a call?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'effect' },
  
  // Intensity 5
  { type: 'truth', content: "What does my love mean to you when we're apart?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What's the deepest thing you've felt during our time apart?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What would you whisper to me if I was there right now?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'desire' },
];

const onlineIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Send me a photo of yourself looking at the camera the way you'd look at me.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Record a voice note saying what you'd say if I was lying next to you.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 1, category: 'voice' },
  { type: 'dare', content: "Send me a voice note whispering how much you miss me.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'voice' },
  { type: 'dare', content: "Describe what you'd do first if I was there right now.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'imagination' },
  { type: 'dare', content: "Send me a voice note of you breathing slowly, as if I'm next to you.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'presence' },
  
  // Intensity 3-4
  { type: 'dare', content: "Write me a short love poem and send it as a text.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'creative' },
  { type: 'dare', content: "Send a video telling me your favorite thing about us.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'video' },
  { type: 'dare', content: "Describe our perfect reunion in vivid detail.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'imagination' },
  { type: 'dare', content: "Send a voice note speaking from your heart without thinking.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'dare', content: "Record a voice note describing what you'd do if I was there right now.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'voice' },
  { type: 'dare', content: "Send me a video of you in your 'I miss you' state.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'video' },
  { type: 'dare', content: "Write and send the most heartfelt message you've ever written.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'text' },
  
  // Intensity 5
  { type: 'dare', content: "Send me a countdown timer for when we'll see each other next.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'romantic' },
  { type: 'dare', content: "Record a video message of your deepest feelings for me.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'vulnerability' },
  { type: 'dare', content: "Create a voice note that I can listen to when I miss you most.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'keepsake' },
];

// Online Married
const onlineCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'truth', content: "What's your favorite memory of us from this week?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's the last thing you said to our photo?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's a habit of mine you miss when we're apart?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What funny thing reminded you of me today?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What's the first thing you'll cook for me when we're together?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'future' },
  
  // Intensity 2
  { type: 'truth', content: "What household chore do you secretly hope I forget about?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'truth', content: "What's the silliest thing you've ever done because you missed me?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What's a 'married people problem' we have that's actually funny?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'truth', content: "What's our funniest long-distance married moment?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What domestic thing do you find yourself missing most?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'longing' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's something about our marriage that distance revealed?", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
  { type: 'truth', content: "What's a challenge we've overcome that made us stronger?", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'growth' },
  { type: 'truth', content: "What surprised you about being married but apart?", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'discovery' },
  { type: 'truth', content: "What's a conversation we need to have but keep postponing?", mode: 'online', mood: 'casual', status: 'married', intensity: 4, category: 'honesty' },
  { type: 'truth', content: "What aspect of our marriage has grown during this distance?", mode: 'online', mood: 'casual', status: 'married', intensity: 4, category: 'growth' },
  
  // Intensity 5
  { type: 'truth', content: "What has being apart taught you about being together?", mode: 'online', mood: 'casual', status: 'married', intensity: 5, category: 'wisdom' },
  { type: 'truth', content: "What will we never take for granted again?", mode: 'online', mood: 'casual', status: 'married', intensity: 5, category: 'appreciation' },
];

const onlineCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Send me a photo of what you're doing right now.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Show me your current 'I miss my spouse' face.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Send a voice note with our inside joke.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show me your dinner/breakfast right now.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Send me your best 'I'm adulting without you' face.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'dare', content: "Type out your best 'married couple' joke.", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'dare', content: "Send a voice note imitating how I nag you.", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'dare', content: "Show me the mess I would complain about if I was there.", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'dare', content: "Take a photo pretending I'm next to you.", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'creative' },
  
  // Intensity 3-4
  { type: 'dare', content: "Record yourself making my favorite meal and send the video.", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'video' },
  { type: 'dare', content: "Create a mini video tour of 'our' space there.", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'video' },
  { type: 'dare', content: "Send a list of things you want to do together when reunited.", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'future' },
  { type: 'dare', content: "Plan our reunion day minute by minute and share it.", mode: 'online', mood: 'casual', status: 'married', intensity: 4, category: 'future' },
  
  // Intensity 5
  { type: 'dare', content: "Record a 'state of our marriage' update as if for a documentary.", mode: 'online', mood: 'casual', status: 'married', intensity: 5, category: 'creative' },
  { type: 'dare', content: "Create a 'why the distance is worth it' list.", mode: 'online', mood: 'casual', status: 'married', intensity: 5, category: 'commitment' },
];

const onlineIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What do you dream about when you think of our home?", mode: 'online', mood: 'intimate', status: 'married', intensity: 1, category: 'longing' },
  { type: 'truth', content: "What's the first thing you want to feel when we're together again?", mode: 'online', mood: 'intimate', status: 'married', intensity: 1, category: 'desire' },
  { type: 'truth', content: "What domestic moment do you miss the most?", mode: 'online', mood: 'intimate', status: 'married', intensity: 1, category: 'longing' },
  { type: 'truth', content: "What do you miss most about sleeping next to me?", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'longing' },
  { type: 'truth', content: "What's a quiet moment of ours that you replay in your mind?", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "What feeling of home do you miss most?", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'comfort' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's the first thing you want to do when we're reunited?", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'desire' },
  { type: 'truth', content: "What part of our daily life together do you ache for?", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'longing' },
  { type: 'truth', content: "What would you say if I was lying next to you right now?", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'depth' },
  { type: 'truth', content: "What's the most romantic thing you want us to do together?", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'desire' },
  { type: 'truth', content: "What part of my presence do you miss that you didn't expect?", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'discovery' },
  { type: 'truth', content: "What's the deepest longing you feel when we're apart?", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'depth' },
  
  // Intensity 5
  { type: 'truth', content: "What does our marriage mean to you in these moments apart?", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'depth' },
  { type: 'truth', content: "What promise holds you steady when the distance feels heavy?", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'commitment' },
];

const onlineIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'dare', content: "Send me a voice note telling me what you love about our marriage.", mode: 'online', mood: 'intimate', status: 'married', intensity: 1, category: 'voice' },
  { type: 'dare', content: "Describe the feeling of coming home to me in a message.", mode: 'online', mood: 'intimate', status: 'married', intensity: 1, category: 'reflection' },
  { type: 'dare', content: "Send a photo representing how you feel about us right now.", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Record a voice note of you saying goodnight as if I'm there.", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'presence' },
  { type: 'dare', content: "Write what you'd say if we were cuddling right now.", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'imagination' },
  
  // Intensity 3-4
  { type: 'dare', content: "Plan a virtual date night for us this week.", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'action' },
  { type: 'dare', content: "Send a voice note speaking directly to my heart.", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'emotional' },
  { type: 'dare', content: "Record our 'reunion moment' fantasy in a voice note.", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'imagination' },
  { type: 'dare', content: "Write a letter to read to me when we're finally together.", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'creative' },
  { type: 'dare', content: "Create a video message for me to watch when I miss you most.", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'keepsake' },
  
  // Intensity 5
  { type: 'dare', content: "Send me a heartfelt video message as if we just got married.", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'emotional' },
  { type: 'dare', content: "Record a vow renewal for when we're together again.", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'commitment' },
  { type: 'dare', content: "Create a 'distance made us stronger' testament.", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'reflection' },
];

// Combine all and add IDs
function addIds(prompts: Omit<TruthDarePrompt, 'id'>[], prefix: string): TruthDarePrompt[] {
  return prompts.map((p, i) => ({ ...p, id: generateId(prefix, i) }));
}

export const ALL_PROMPTS: TruthDarePrompt[] = [
  // Offline mode
  ...addIds(offlineCasualRelationshipTruths, 'ocrt'),
  ...addIds(offlineCasualRelationshipDares, 'ocrd'),
  ...addIds(offlineIntimateRelationshipTruths, 'oirt'),
  ...addIds(offlineIntimateRelationshipDares, 'oird'),
  ...addIds(offlineCasualMarriedTruths, 'ocmt'),
  ...addIds(offlineCasualMarriedDares, 'ocmd'),
  ...addIds(offlineIntimateMarriedTruths, 'oimt'),
  ...addIds(offlineIntimateMarriedDares, 'oimd'),
  // AI mode
  ...addIds(aiCasualRelationshipTruths, 'acrt'),
  ...addIds(aiCasualRelationshipDares, 'acrd'),
  ...addIds(aiIntimateRelationshipTruths, 'airt'),
  ...addIds(aiIntimateRelationshipDares, 'aird'),
  ...addIds(aiCasualMarriedTruths, 'acmt'),
  ...addIds(aiCasualMarriedDares, 'acmd'),
  ...addIds(aiIntimateMarriedTruths, 'aimt'),
  ...addIds(aiIntimateMarriedDares, 'aimd'),
  // Online mode
  ...addIds(onlineCasualRelationshipTruths, 'ncrt'),
  ...addIds(onlineCasualRelationshipDares, 'ncrd'),
  ...addIds(onlineIntimateRelationshipTruths, 'nirt'),
  ...addIds(onlineIntimateRelationshipDares, 'nird'),
  ...addIds(onlineCasualMarriedTruths, 'ncmt'),
  ...addIds(onlineCasualMarriedDares, 'ncmd'),
  ...addIds(onlineIntimateMarriedTruths, 'nimt'),
  ...addIds(onlineIntimateMarriedDares, 'nimd'),
];

// Export count for stats
export const PROMPT_COUNT = ALL_PROMPTS.length;
