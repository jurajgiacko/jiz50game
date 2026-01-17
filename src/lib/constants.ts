// JIŽ50 Game Constants

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;

// Game settings
export const MAX_SPEED = 12;
export const BASE_SPEED = 2.5;
export const PUSH_BOOST = 8;
export const PUSH_DURATION = 20; // frames

// Energy settings
export const INITIAL_ENERGY = 80;
export const ENERGY_DRAIN_RATE = 0.005;
export const CORRECT_CHOICE_ENERGY = 25;
export const WRONG_CHOICE_ENERGY_PENALTY = 15;

// Lane positions
export const LANE_X_START = 300;
export const LANE_WIDTH = 100;
export const LANE_COUNT = 3;

// Player position
export const PLAYER_Y = 350;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 60;

// Competitor settings
export const COMPETITOR_COUNT = 20;
export const COMPETITOR_COLORS = [
  { body: '#ff0000', helmet: '#cc0000' }, // Red
  { body: '#00aa00', helmet: '#008800' }, // Green
  { body: '#0066ff', helmet: '#0044cc' }, // Blue
  { body: '#ffff00', helmet: '#cccc00' }, // Yellow
  { body: '#ff00ff', helmet: '#cc00cc' }, // Pink
  { body: '#00ffff', helmet: '#00cccc' }, // Cyan
  { body: '#ffffff', helmet: '#cccccc' }, // White
  { body: '#333333', helmet: '#111111' }, // Black
];

// Tree settings
export const TREE_COUNT = 30;

// Station positions (km)
export const STATION_POSITIONS = [0, 8, 16, 25, 33, 42, 50];
export const STATION_PHASES = [
  'preStart',
  'station1',
  'station2',
  'station3',
  'station4',
  'station5',
  'postRace',
];

export const STATION_NAMES = [
  'PŘED STARTEM - Připrav se!',
  'KM 8 - První občerstvení',
  'KM 16 - Třetina závodu',
  'KM 25 - PŮLKA ZÁVODU!',
  'KM 33 - Poslední třetina',
  'KM 42 - Před cílem!',
  'CÍL! - Regenerace',
];

// Colors
export const COLORS = {
  enervitOrange: '#ff6600',
  jizerskaBlue: '#003399',
  sky: '#87ceeb',
  snow: '#f0f8ff',
  track: '#e0e8f0',
  mountain: '#a0a0c0',
  tree: '#004000',
  trunk: '#4a2800',
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
};

// Firework colors
export const FIREWORK_COLORS = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#ff00ff',
  '#ff6600',
  '#ffffff',
];

// Discount code
export const DISCOUNT_CODE = 'JIZERSKA10';
export const DISCOUNT_PERCENT = 10;
export const ENERVIT_SHOP_URL = 'https://www.enervit.cz';
