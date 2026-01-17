// JIŽ50 Game Types

export interface GameState {
  running: boolean;
  paused: boolean;
  distance: number;
  energy: number;
  speed: number;
  maxSpeed: number;
  baseSpeed: number;
  time: number;
  correctChoices: number;
  totalStations: number;
  currentStation: number;
  speedBoost: number;
  gameOver: boolean;
  phase: 'start' | 'pre' | 'race' | 'station' | 'finish' | 'results';
  finishMode: boolean;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  lane: number; // 0 = left, 1 = center, 2 = right
  pushing: boolean;
  pushFrame: number;
  animFrame: number;
}

export interface Tree {
  x: number;
  y: number;
  size: number;
  type: number;
}

export interface Station {
  km: number;
  triggered: boolean;
  phase: string;
}

export interface CompetitorColor {
  body: string;
  helmet: string;
}

export interface Competitor {
  lane: number;
  y: number;
  speed: number;
  color: CompetitorColor;
  active: boolean;
  passed: boolean;
}

export interface Track {
  offset: number;
  trees: Tree[];
  stations: Station[];
  obstacles: unknown[];
  competitors: Competitor[];
}

export interface NutritionProduct {
  id: string;
  name: string;
  desc: string;
  correct: boolean;
  boost: number;
  explanation: string;
  benefit: string;
}

export interface NutritionChoice {
  stationIndex: number;
  productId: string;
  productName: string;
  correct: boolean;
  explanation: string;
}

export interface Firework {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

export interface UserData {
  name: string;
  email: string;
  raffleConsent: boolean;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  timeMs: number;
  correctChoices: number;
  createdAt: string;
  rank?: number;
}
