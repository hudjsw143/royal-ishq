export const loveQuotes = [
  "In all the world, there is no heart for me like yours.",
  "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
  "The best thing to hold onto in life is each other.",
  "I have found the one whom my soul loves.",
  "You are my today and all of my tomorrows.",
  "In your eyes, I have found my home.",
  "A successful marriage requires falling in love many times, always with the same person.",
  "Whatever our souls are made of, his and mine are the same.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "Two souls with but a single thought, two hearts that beat as one.",
  "Love is composed of a single soul inhabiting two bodies.",
  "The greatest thing you'll ever learn is just to love and be loved in return.",
  "Where there is love, there is life.",
  "To love and be loved is to feel the sun from both sides.",
  "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
  "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
  "Love is when the other person's happiness is more important than your own.",
  "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.",
  "Ishq mein hum tumhein kya batayein, kya sitam hai.",
  "Mohabbat bhi Zindagi ki tarah hoti hai, har mod aasan nahi hota, har mod pe saath zaroori hai.",
];

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * loveQuotes.length);
  return loveQuotes[randomIndex];
};