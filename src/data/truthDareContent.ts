// Truth & Dare Content Database
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
  // Intensity 1 - Light observation
  { type: 'truth', content: "What's the first thing you noticed about me when we met?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's my most adorable habit that makes you smile?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "If you could describe our relationship in one movie title, what would it be?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What song reminds you of us?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's your favorite memory of us so far?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'memory' },
  
  // Intensity 2 - Feelings
  { type: 'truth', content: "When did you first realize you had feelings for me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's something I do that makes your heart skip a beat?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What were you thinking during our first date?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "What's the sweetest thing I've ever done for you without knowing?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "If you had to pick one moment to relive with me, which would it be?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  
  // Intensity 3 - Vulnerability
  { type: 'truth', content: "What's something you've never told me but always wanted to?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "What's your biggest fear about our relationship?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "Is there something about me you wish you could change?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "What do you think is the biggest challenge we'll face together?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'vulnerability' },
  
  // Intensity 4-5 - Future
  { type: 'truth', content: "Where do you see us in five years?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'truth', content: "What's your dream date with me that we haven't done yet?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'future' },
  { type: 'truth', content: "If we could travel anywhere together, where would you take me?", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'future' },
];

const offlineCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1
  { type: 'dare', content: "Hold my hand and look into my eyes for 30 seconds without laughing.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'connection' },
  { type: 'dare', content: "Give me your best impression of how I walk.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Describe me using only hand gestures.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Show me your goofiest dance move right now.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Make the funniest face you can and hold it for 10 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  
  // Intensity 2
  { type: 'dare', content: "Give me a forehead kiss and whisper something sweet.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Recreate our first meeting the way you remember it.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'memory' },
  { type: 'dare', content: "Play with my hair for one minute while telling me what you love about me.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  { type: 'dare', content: "Give me a back hug and hold for 20 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 2, category: 'affection' },
  
  // Intensity 3
  { type: 'dare', content: "Write 'I love you' on my palm with your finger, slowly.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'dare', content: "Slow dance with me without any music for 30 seconds.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'dare', content: "Give me a gentle nose-to-nose touch and maintain eye contact.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 3, category: 'romantic' },
  
  // Intensity 4-5
  { type: 'dare', content: "Whisper your favorite thing about us in my ear.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 4, category: 'intimate' },
  { type: 'dare', content: "Hold both my hands and tell me three things you admire about me.", mode: 'offline', mood: 'casual', status: 'relationship', intensity: 5, category: 'intimate' },
];

const offlineIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  // Intensity 1-2
  { type: 'truth', content: "What's the most romantic thing you've ever dreamed about us doing?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'romantic' },
  { type: 'truth', content: "What about me makes you feel most safe?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 1, category: 'feeling' },
  { type: 'truth', content: "What's the most loved you've ever felt with me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "When you think about our future, what excites you most?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'future' },
  
  // Intensity 3-4
  { type: 'truth', content: "What's something about our connection that you can't explain to anyone else?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'vulnerability' },
  { type: 'truth', content: "When do you feel most connected to me?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'connection' },
  { type: 'truth', content: "What's a way I could make you feel even more loved?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What's your deepest wish for us?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'future' },
  
  // Intensity 5
  { type: 'truth', content: "What does forever with me look like in your heart?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'future' },
  { type: 'truth', content: "What's the most vulnerable thing you want to share with me right now?", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'vulnerability' },
];

const offlineIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Cup my face gently and look into my eyes while breathing slowly together.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'connection' },
  { type: 'dare', content: "Trace your fingers slowly along my palm while telling me what you feel.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 2, category: 'sensory' },
  { type: 'dare', content: "Give me a slow, meaningful forehead kiss that lasts 10 seconds.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'affection' },
  { type: 'dare', content: "Hold me close and whisper something you've never said before.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 3, category: 'emotional' },
  { type: 'dare', content: "Gently stroke my hair while telling me why you chose me.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'affection' },
  { type: 'dare', content: "Embrace me and synchronize our breathing for one minute.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 4, category: 'connection' },
  { type: 'dare', content: "Place your hand over my heart and tell me what it means to you.", mode: 'offline', mood: 'intimate', status: 'relationship', intensity: 5, category: 'emotional' },
];

// Married versions - appreciation and memory focused
const offlineCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's your favorite memory from our wedding day?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What made you fall in love with me all over again recently?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'appreciation' },
  { type: 'truth', content: "What's the funniest argument we've ever had?", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What do you think is our greatest strength as a couple?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  { type: 'truth', content: "What's something I do that still surprises you after all this time?", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'observation' },
  { type: 'truth', content: "If we could renew our vows, what would you add?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'future' },
  { type: 'truth', content: "What's your favorite tradition we've created together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What adventure do you still want us to have together?", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'future' },
];

const offlineCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Recreate our first dance together, right here.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'dare', content: "Do your best impression of me on our wedding day.", mode: 'offline', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Give me a spontaneous compliment that you haven't given in a while.", mode: 'offline', mood: 'casual', status: 'married', intensity: 2, category: 'appreciation' },
  { type: 'dare', content: "Hold my hands and tell me three reasons you'd marry me again.", mode: 'offline', mood: 'casual', status: 'married', intensity: 3, category: 'appreciation' },
  { type: 'dare', content: "Give me a long, heartfelt hug like it's our wedding day.", mode: 'offline', mood: 'casual', status: 'married', intensity: 4, category: 'affection' },
];

const offlineIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's the most romantic moment we've shared in our marriage?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "How has your love for me changed since we got married?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's something you wish we did more often?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'desire' },
  { type: 'truth', content: "What's the deepest thing marriage has taught you about love?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'growth' },
  { type: 'truth', content: "What promise would you make to me for the rest of our lives?", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'future' },
];

const offlineIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Renew one of our wedding vows right now, from the heart.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 2, category: 'romantic' },
  { type: 'dare', content: "Hold me like you did on our honeymoon.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 3, category: 'affection' },
  { type: 'dare', content: "Whisper something you've always felt but never said.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 4, category: 'emotional' },
  { type: 'dare', content: "Create a new private tradition between us, just for this moment.", mode: 'offline', mood: 'intimate', status: 'married', intensity: 5, category: 'connection' },
];

// ============================================
// AI MODE - Psychological and prank-style
// ============================================

const aiCasualRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's a secret crush you had before meeting your partner?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the most embarrassing thing you've done to impress someone?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's your partner's habit that secretly annoys you?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'observation' },
  { type: 'truth', content: "Have you ever pretended to like something just to make your partner happy?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'honesty' },
  { type: 'truth', content: "What's the weirdest thing you've googled about relationships?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'fun' },
  { type: 'truth', content: "What's something you've always wanted to tell your partner but were too shy?", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'vulnerability' },
];

const aiCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Send your partner a voice note right now saying something sweet.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'action' },
  { type: 'dare', content: "Do your best impression of your partner when they're angry.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Call your partner and compliment them without laughing.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'action' },
  { type: 'dare', content: "Text your partner a romantic poem you make up on the spot.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Post something sweet about your partner on social media right now.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 3, category: 'public' },
  { type: 'dare', content: "Record a 30-second video telling your partner why they're amazing.", mode: 'ai', mood: 'casual', status: 'relationship', intensity: 4, category: 'creative' },
];

const aiIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's your deepest fantasy about your relationship's future?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'future' },
  { type: 'truth', content: "What's the most romantic dream you've had about your partner?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'romantic' },
  { type: 'truth', content: "What do you find most attractive about your partner's personality?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'attraction' },
  { type: 'truth', content: "What moment made you realize this person was 'the one'?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'realization' },
  { type: 'truth', content: "What's something you want to experience with your partner that you've never told them?", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'desire' },
];

const aiIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Write a love letter to your partner and read it out loud.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 2, category: 'romantic' },
  { type: 'dare', content: "Send your partner a heartfelt voice message right now.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 3, category: 'action' },
  { type: 'dare', content: "Create a playlist for your partner with songs that remind you of them.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 4, category: 'creative' },
  { type: 'dare', content: "Plan a surprise date for your partner within the next week.", mode: 'ai', mood: 'intimate', status: 'relationship', intensity: 5, category: 'action' },
];

// AI Married
const aiCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's a funny habit your spouse has that you've never mentioned?", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'observation' },
  { type: 'truth', content: "What's the most ridiculous argument you've won in your marriage?", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
  { type: 'truth', content: "Have you ever hidden a purchase from your spouse?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'honesty' },
  { type: 'truth', content: "What's something about married life that surprised you?", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'reflection' },
];

const aiCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Do an impression of your spouse when they're stressed.", mode: 'ai', mood: 'casual', status: 'married', intensity: 1, category: 'fun' },
  { type: 'dare', content: "Text your spouse a random 'I love you' without context.", mode: 'ai', mood: 'casual', status: 'married', intensity: 2, category: 'action' },
  { type: 'dare', content: "Plan a surprise breakfast in bed for your spouse this week.", mode: 'ai', mood: 'casual', status: 'married', intensity: 3, category: 'action' },
];

const aiIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's changed most about how you love your spouse since marriage?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'growth' },
  { type: 'truth', content: "What's your favorite 'married couple' moment?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What's your dream retirement life with your spouse?", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'future' },
];

const aiIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Write down three things you appreciate about your marriage today.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 2, category: 'gratitude' },
  { type: 'dare', content: "Call your spouse and tell them exactly what they mean to you.", mode: 'ai', mood: 'intimate', status: 'married', intensity: 4, category: 'emotional' },
];

// ============================================
// ONLINE MODE - Distance-friendly
// ============================================

const onlineCasualRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's the last photo of me you looked at?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's the cutest nickname you secretly call me in your head?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'fun' },
  { type: 'truth', content: "What's something silly you do when you miss me?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'feeling' },
  { type: 'truth', content: "If I was there right now, what would you want to do together?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'desire' },
  { type: 'truth', content: "What's the funniest thing about our long-distance moments?", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'memory' },
];

const onlineCasualRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Send me your best selfie right now, no retakes!", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Send me a voice note singing our favorite song.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'voice' },
  { type: 'dare', content: "Type three things you love about me using only emojis.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 1, category: 'text' },
  { type: 'dare', content: "Send me a 10-second video of your best dance move.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'video' },
  { type: 'dare', content: "Draw a picture of us together and send it within 2 minutes.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 2, category: 'creative' },
  { type: 'dare', content: "Leave me a voice note pretending to be a movie narrator describing our love story.", mode: 'online', mood: 'casual', status: 'relationship', intensity: 3, category: 'voice' },
];

const onlineIntimateRelationshipTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What do you miss most about being close to me?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'longing' },
  { type: 'truth', content: "What's the first thing you want to do when we meet again?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'desire' },
  { type: 'truth', content: "What's the most romantic message I've ever sent you?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'memory' },
  { type: 'truth', content: "What's something you want to tell me but haven't had the courage to?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'vulnerability' },
  { type: 'truth', content: "What does my love mean to you when we're apart?", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'depth' },
];

const onlineIntimateRelationshipDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Send me a voice note whispering how much you miss me.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 2, category: 'voice' },
  { type: 'dare', content: "Write me a short love poem and send it as a text.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'text' },
  { type: 'dare', content: "Send a video telling me your favorite thing about us.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 3, category: 'video' },
  { type: 'dare', content: "Record a voice note describing what you'd do if I was there right now.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 4, category: 'voice' },
  { type: 'dare', content: "Send me a countdown timer for when we'll see each other next.", mode: 'online', mood: 'intimate', status: 'relationship', intensity: 5, category: 'romantic' },
];

// Online Married
const onlineCasualMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What's your favorite memory of us from this week?", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'memory' },
  { type: 'truth', content: "What household chore do you secretly hope I forget about?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'fun' },
  { type: 'truth', content: "What's the silliest thing you've ever done because you missed me?", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'memory' },
];

const onlineCasualMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Send me a photo of what you're doing right now.", mode: 'online', mood: 'casual', status: 'married', intensity: 1, category: 'photo' },
  { type: 'dare', content: "Type out your best 'married couple' joke.", mode: 'online', mood: 'casual', status: 'married', intensity: 2, category: 'text' },
  { type: 'dare', content: "Record yourself making my favorite meal and send the video.", mode: 'online', mood: 'casual', status: 'married', intensity: 3, category: 'video' },
];

const onlineIntimateMarriedTruths: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'truth', content: "What do you miss most about sleeping next to me?", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'longing' },
  { type: 'truth', content: "What's the first thing you want to do when we're reunited?", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'desire' },
  { type: 'truth', content: "What's the most romantic thing you want us to do together?", mode: 'online', mood: 'intimate', status: 'married', intensity: 4, category: 'desire' },
];

const onlineIntimateMarriedDares: Omit<TruthDarePrompt, 'id'>[] = [
  { type: 'dare', content: "Send me a voice note telling me what you love about our marriage.", mode: 'online', mood: 'intimate', status: 'married', intensity: 2, category: 'voice' },
  { type: 'dare', content: "Plan a virtual date night for us this week.", mode: 'online', mood: 'intimate', status: 'married', intensity: 3, category: 'action' },
  { type: 'dare', content: "Send me a heartfelt video message as if we just got married.", mode: 'online', mood: 'intimate', status: 'married', intensity: 5, category: 'video' },
];

// Combine all and add IDs
function addIds(prompts: Omit<TruthDarePrompt, 'id'>[], prefix: string): TruthDarePrompt[] {
  return prompts.map((p, i) => ({ ...p, id: generateId(prefix, i) }));
}

export const ALL_PROMPTS: TruthDarePrompt[] = [
  ...addIds(offlineCasualRelationshipTruths, 'ocrt'),
  ...addIds(offlineCasualRelationshipDares, 'ocrd'),
  ...addIds(offlineIntimateRelationshipTruths, 'oirt'),
  ...addIds(offlineIntimateRelationshipDares, 'oird'),
  ...addIds(offlineCasualMarriedTruths, 'ocmt'),
  ...addIds(offlineCasualMarriedDares, 'ocmd'),
  ...addIds(offlineIntimateMarriedTruths, 'oimt'),
  ...addIds(offlineIntimateMarriedDares, 'oimd'),
  ...addIds(aiCasualRelationshipTruths, 'acrt'),
  ...addIds(aiCasualRelationshipDares, 'acrd'),
  ...addIds(aiIntimateRelationshipTruths, 'airt'),
  ...addIds(aiIntimateRelationshipDares, 'aird'),
  ...addIds(aiCasualMarriedTruths, 'acmt'),
  ...addIds(aiCasualMarriedDares, 'acmd'),
  ...addIds(aiIntimateMarriedTruths, 'aimt'),
  ...addIds(aiIntimateMarriedDares, 'aimd'),
  ...addIds(onlineCasualRelationshipTruths, 'ncrt'),
  ...addIds(onlineCasualRelationshipDares, 'ncrd'),
  ...addIds(onlineIntimateRelationshipTruths, 'nirt'),
  ...addIds(onlineIntimateRelationshipDares, 'nird'),
  ...addIds(onlineCasualMarriedTruths, 'ncmt'),
  ...addIds(onlineCasualMarriedDares, 'ncmd'),
  ...addIds(onlineIntimateMarriedTruths, 'nimt'),
  ...addIds(onlineIntimateMarriedDares, 'nimd'),
];
