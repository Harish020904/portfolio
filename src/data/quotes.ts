// ── Random quotes for motd command ──

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
  },
  {
    text: 'The best way to predict the future is to implement it.',
    author: 'David Heinemeier Hansson',
  },
  {
    text: 'A homelab is never finished, only abandoned temporarily.',
    author: 'Every Homelabber Ever',
  },
  {
    text: 'In a world without fences and walls, who needs Gates and Windows?',
    author: 'Linux Community Proverb',
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
  },
];

export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
