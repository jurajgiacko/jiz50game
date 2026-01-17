// JIZ50 Game Store (Zustand)

import { create } from 'zustand';
import type {
  GameState,
  Player,
  Track,
  Tree,
  Station,
  Competitor,
  Firework,
  NutritionChoice,
  UserData,
} from '@/lib/types';
import {
  STATION_POSITIONS,
  STATION_PHASES,
  COMPETITOR_COUNT,
  COMPETITOR_COLORS,
  TREE_COUNT,
  INITIAL_ENERGY,
  BASE_SPEED,
  MAX_SPEED,
  PLAYER_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from '@/lib/constants';

interface GameStore {
  // Game state
  gameState: GameState;
  player: Player;
  track: Track;
  fireworks: Firework[];
  choices: NutritionChoice[];
  user: UserData | null;

  // Feedback
  feedbackText: string;
  feedbackColor: string;
  feedbackTimer: number;

  // Actions
  initGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (won: boolean) => void;

  // Player actions
  moveLeft: () => void;
  moveRight: () => void;
  startPush: () => void;

  // Game updates
  updateGame: (deltaTime: number) => void;
  updateFireworks: () => void;
  triggerStation: (stationIndex: number) => void;
  selectNutrition: (
    productId: string,
    productName: string,
    correct: boolean,
    boost: number,
    explanation: string,
    stationIndex: number
  ) => void;

  // Feedback
  showFeedback: (text: string, color: string) => void;

  // User
  setUser: (user: UserData) => void;

  // Phase
  setPhase: (phase: GameState['phase']) => void;
}

const initialGameState: GameState = {
  running: false,
  paused: false,
  distance: 0,
  energy: INITIAL_ENERGY,
  speed: 0,
  maxSpeed: MAX_SPEED,
  baseSpeed: BASE_SPEED,
  time: 0,
  correctChoices: 0,
  totalStations: 7,
  currentStation: 0,
  speedBoost: 0,
  gameOver: false,
  phase: 'start',
  finishMode: false,
};

const initialPlayer: Player = {
  x: 400,
  y: PLAYER_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  lane: 1,
  pushing: false,
  pushFrame: 0,
  animFrame: 0,
};

function createTrees(): Tree[] {
  const trees: Tree[] = [];
  for (let i = 0; i < TREE_COUNT; i++) {
    trees.push({
      x: Math.random() < 0.5 ? Math.random() * 150 : 650 + Math.random() * 150,
      y: Math.random() * 500,
      size: 20 + Math.random() * 30,
      type: Math.floor(Math.random() * 3),
    });
  }
  return trees;
}

function createStations(): Station[] {
  return STATION_POSITIONS.map((km, i) => ({
    km,
    triggered: false,
    phase: STATION_PHASES[i],
  }));
}

function createCompetitors(): Competitor[] {
  const competitors: Competitor[] = [];
  for (let i = 0; i < COMPETITOR_COUNT; i++) {
    competitors.push({
      lane: Math.floor(Math.random() * 3),
      y: -100 - Math.random() * 2000,
      speed: 2 + Math.random() * 3,
      color: COMPETITOR_COLORS[Math.floor(Math.random() * COMPETITOR_COLORS.length)],
      active: true,
      passed: false,
    });
  }
  return competitors;
}

const initialTrack: Track = {
  offset: 0,
  trees: createTrees(),
  stations: createStations(),
  obstacles: [],
  competitors: createCompetitors(),
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialGameState,
  player: initialPlayer,
  track: initialTrack,
  fireworks: [],
  choices: [],
  user: null,
  feedbackText: '',
  feedbackColor: '',
  feedbackTimer: 0,

  initGame: () => {
    set({
      gameState: { ...initialGameState },
      player: { ...initialPlayer },
      track: {
        offset: 0,
        trees: createTrees(),
        stations: createStations(),
        obstacles: [],
        competitors: createCompetitors(),
      },
      fireworks: [],
      choices: [],
      feedbackText: '',
      feedbackColor: '',
      feedbackTimer: 0,
    });
  },

  startGame: () => {
    const state = get();
    state.initGame();

    set((s) => ({
      gameState: {
        ...s.gameState,
        running: true,
        paused: true, // Start paused for pre-race nutrition
        phase: 'pre',
      },
    }));

    // Trigger first station
    setTimeout(() => {
      get().triggerStation(0);
    }, 500);
  },

  pauseGame: () => {
    set((s) => ({
      gameState: { ...s.gameState, paused: true },
    }));
  },

  resumeGame: () => {
    set((s) => ({
      gameState: { ...s.gameState, paused: false },
    }));
  },

  endGame: (won: boolean) => {
    set((s) => ({
      gameState: {
        ...s.gameState,
        running: false,
        gameOver: true,
        phase: 'results',
        finishMode: false,
      },
    }));
  },

  moveLeft: () => {
    set((s) => ({
      player: {
        ...s.player,
        lane: Math.max(0, s.player.lane - 1),
      },
    }));
  },

  moveRight: () => {
    set((s) => ({
      player: {
        ...s.player,
        lane: Math.min(2, s.player.lane + 1),
      },
    }));
  },

  startPush: () => {
    const state = get();
    if (
      !state.player.pushing &&
      state.gameState.running &&
      !state.gameState.paused
    ) {
      set((s) => ({
        player: {
          ...s.player,
          pushing: true,
          pushFrame: 0,
        },
      }));
    }
  },

  updateGame: (deltaTime: number) => {
    const state = get();
    if (!state.gameState.running || state.gameState.paused) return;

    // Update time
    const newTime = state.gameState.time + deltaTime;

    // Player movement (lanes)
    const targetX = 300 + state.player.lane * 100;
    const newPlayerX = state.player.x + (targetX - state.player.x) * 0.1;

    // Pushing mechanics
    let newPushing = state.player.pushing;
    let newPushFrame = state.player.pushFrame;

    if (state.player.pushing) {
      newPushFrame++;
      if (newPushFrame > 20) {
        newPushing = false;
        newPushFrame = 0;
      }
    }

    // Speed calculation
    let targetSpeed = state.gameState.baseSpeed + state.gameState.speedBoost;
    if (state.player.pushing) {
      targetSpeed += 8;
    }
    targetSpeed *= state.gameState.energy / 100;

    let newSpeed =
      state.gameState.speed + (targetSpeed - state.gameState.speed) * 0.05;
    newSpeed = Math.max(0, Math.min(state.gameState.maxSpeed, newSpeed));

    // Distance
    const newDistance =
      state.gameState.distance + (newSpeed / 3600) * deltaTime;

    // Energy drain
    let newEnergy =
      state.gameState.energy - deltaTime * 0.005 * (newSpeed / 20);
    newEnergy = Math.max(0, newEnergy);

    // Track movement
    const newOffset = state.track.offset + newSpeed * 0.1;

    // Update feedback timer
    let newFeedbackTimer = state.feedbackTimer;
    if (newFeedbackTimer > 0) {
      newFeedbackTimer -= deltaTime;
    }

    // Check for stations
    const newStations = [...state.track.stations];
    let shouldPause = false;
    let stationToTrigger = -1;

    newStations.forEach((station, index) => {
      if (index === 0) return; // Pre-start handled separately

      // Last station (finish) triggers at exactly 50km
      if (index === 6) {
        if (!station.triggered && newDistance >= 50) {
          station.triggered = true;
          shouldPause = true;
          stationToTrigger = index;
        }
      } else {
        if (
          !station.triggered &&
          newDistance >= station.km - 0.3 &&
          newDistance <= station.km + 0.5
        ) {
          station.triggered = true;
          shouldPause = true;
          stationToTrigger = index;
        }
      }
    });

    // Update competitors
    const newCompetitors = state.track.competitors.map((comp) => {
      if (!comp.active) return comp;

      let newY = comp.y + (newSpeed - comp.speed) * 0.5;

      // Collision detection
      const compScreenY = 200 + comp.y;
      const compX = 300 + comp.lane * 100;

      if (
        comp.lane === state.player.lane &&
        compScreenY > state.player.y - 40 &&
        compScreenY < state.player.y + 30 &&
        Math.abs(compX - newPlayerX) < 30
      ) {
        // Bump!
        newSpeed = Math.max(2, newSpeed - 5);
        newEnergy = Math.max(5, newEnergy - 5);
        newY += 50;
        get().showFeedback('NÁRAZ! -5 rychlost', '#ff0000');
      }

      // Reset competitor if too far below screen
      if (200 + newY > 600) {
        return {
          ...comp,
          y: -200 - Math.random() * 500,
          lane: Math.floor(Math.random() * 3),
          speed: 2 + Math.random() * 3,
        };
      }

      return { ...comp, y: newY };
    });

    set({
      gameState: {
        ...state.gameState,
        time: newTime,
        speed: newSpeed,
        distance: newDistance,
        energy: newEnergy,
        paused: shouldPause ? true : state.gameState.paused,
        currentStation:
          stationToTrigger >= 0 ? stationToTrigger : state.gameState.currentStation,
        finishMode: stationToTrigger === 6 ? true : state.gameState.finishMode,
        phase:
          stationToTrigger === 6
            ? 'finish'
            : stationToTrigger >= 0
            ? 'station'
            : state.gameState.phase,
      },
      player: {
        ...state.player,
        x: newPlayerX,
        pushing: newPushing,
        pushFrame: newPushFrame,
      },
      track: {
        ...state.track,
        offset: newOffset,
        stations: newStations,
        competitors: newCompetitors,
      },
      feedbackTimer: newFeedbackTimer,
    });

    // Check energy depletion
    if (newEnergy <= 0) {
      get().endGame(false);
    }
  },

  updateFireworks: () => {
    const state = get();
    if (!state.gameState.finishMode) return;

    let newFireworks = [...state.fireworks];

    // Spawn new fireworks randomly
    if (Math.random() < 0.1) {
      const colors = [
        '#ff0000',
        '#ffff00',
        '#00ff00',
        '#00ffff',
        '#ff00ff',
        '#ff6600',
        '#ffffff',
      ];
      const x = 100 + Math.random() * 600;
      const y = 50 + Math.random() * 150;

      for (let i = 0; i < 20; i++) {
        newFireworks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 60 + Math.random() * 40,
        });
      }
    }

    // Update particles
    newFireworks = newFireworks
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.15,
        life: p.life - 1,
      }))
      .filter((p) => p.life > 0);

    set({ fireworks: newFireworks });
  },

  triggerStation: (stationIndex: number) => {
    set((s) => {
      const newStations = [...s.track.stations];
      newStations[stationIndex].triggered = true;

      return {
        gameState: {
          ...s.gameState,
          paused: true,
          currentStation: stationIndex,
          phase: stationIndex === 6 ? 'finish' : 'station',
        },
        track: {
          ...s.track,
          stations: newStations,
        },
      };
    });
  },

  selectNutrition: (
    productId: string,
    productName: string,
    correct: boolean,
    boost: number,
    explanation: string,
    stationIndex: number
  ) => {
    const state = get();

    const newChoice: NutritionChoice = {
      stationIndex,
      productId,
      productName,
      correct,
      explanation,
    };

    let newCorrectChoices = state.gameState.correctChoices;
    let newSpeedBoost = state.gameState.speedBoost;
    let newEnergy = state.gameState.energy;

    if (correct) {
      newCorrectChoices++;
      newSpeedBoost += boost;
      newEnergy = Math.min(100, newEnergy + 25);
      get().showFeedback('SPRÁVNÁ VOLBA! +' + boost + ' rychlost', '#00ff00');
    } else {
      newSpeedBoost += boost; // boost is negative for wrong choices
      newEnergy = Math.max(10, newEnergy - 15);
      get().showFeedback('ŠPATNÁ VOLBA! ' + boost + ' rychlost', '#ff0000');
    }

    set((s) => ({
      gameState: {
        ...s.gameState,
        correctChoices: newCorrectChoices,
        speedBoost: newSpeedBoost,
        energy: newEnergy,
        paused: stationIndex === 6, // Stay paused only for last station
        phase: stationIndex === 6 ? 'finish' : 'race',
        finishMode: stationIndex === 6 ? false : s.gameState.finishMode,
      },
      choices: [...s.choices, newChoice],
    }));

    // End game after last station
    if (stationIndex === 6) {
      setTimeout(() => {
        get().endGame(true);
      }, 1500);
    }
  },

  showFeedback: (text: string, color: string) => {
    set({
      feedbackText: text,
      feedbackColor: color,
      feedbackTimer: 2000,
    });
  },

  setUser: (user: UserData) => {
    set({ user });
  },

  setPhase: (phase: GameState['phase']) => {
    set((s) => ({
      gameState: { ...s.gameState, phase },
    }));
  },
}));
