export interface Envelope {
  id: string;
  title: string;
  emoji: string;
  category: "sad" | "overthinking" | "sleep" | "happy" | "givingup" | "miss" | "messy";
  content: string;
}

export interface SmileItem {
  id: string;
  type: "meme" | "compliment" | "joke" | "gif" | "animation";
  content: string;
  meta?: string; // Optional context, author or description
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  emoji: string;
  imageUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string; // fallback audio url or simple synth visualizer style
  category: "Lofi" | "Rain" | "Nature" | "Happy";
}

export interface Polaroid {
  id: string;
  title: string;
  date: string;
  caption: string;
  rotation: string; // Tailwind rotation class, e.g. "rotate-3", "rotate-[-4deg]"
  color: string; // background color
  imageUrl: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  category: "visited" | "water" | "smiled" | "work" | "break";
}

export interface GardenFlower {
  id: string;
  type: "rose" | "tulip" | "sunflower" | "daisy" | "lavender";
  color: string;
  scale: number;
  bloomProgress: number; // 0 to 100
  x: number; // Position percentage x
  y: number; // Position percentage y
  plantedAt: string;
  note?: string;
}

export interface Bubble {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

export interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  rotation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
