// Game sound effects definitions
// Using free sounds from GitHub/CDN

export const GAME_SOUNDS = {
  // UI Sounds
  buttonClick: "https://cdn.pixabay.com/audio/2022/03/24/audio_52aa61c8d9.mp3", // Short click
  
  // Game Events
  gameStart: "https://cdn.pixabay.com/audio/2022/03/15/audio_86aaabb9c3.mp3", // Game start jingle
  move: "https://cdn.pixabay.com/audio/2022/03/10/audio_cf4e777add.mp3", // Piece placed
  
  // Win/Lose
  win: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3", // Victory sound
  lose: "https://cdn.pixabay.com/audio/2022/03/24/audio_68cc0c3c34.mp3", // Lose sound
  
  // Card sounds
  cardFlip: "https://cdn.pixabay.com/audio/2022/03/15/audio_7b4a80d0f8.mp3", // Whoosh/flip
  wheelSpin: "https://cdn.pixabay.com/audio/2022/10/30/audio_2ad5b540c5.mp3", // Spinning
  
  // Chat sounds
  messageSent: "https://cdn.pixabay.com/audio/2022/03/24/audio_c3f3e1279a.mp3", // Message sent
  messageReceived: "https://cdn.pixabay.com/audio/2022/01/18/audio_8db1f1b5a0.mp3", // Message received
} as const;

export type SoundType = keyof typeof GAME_SOUNDS;
