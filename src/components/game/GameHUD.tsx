'use client';

import { useGameStore } from '@/stores/gameStore';

export function GameHUD() {
  const gameState = useGameStore((s) => s.gameState);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-gray-900 border-b-4 border-gray-700">
      <div className="flex flex-col items-center min-w-[70px] md:min-w-[100px]">
        <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">VZDÁLENOST</span>
        <span className="text-sm md:text-xl text-orange-500 font-mono font-bold">
          {gameState.distance.toFixed(1)} km
        </span>
      </div>

      <div className="flex flex-col items-center min-w-[70px] md:min-w-[100px]">
        <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">ENERGIE</span>
        <div className="w-16 md:w-24 h-4 md:h-5 bg-gray-700 border-2 border-gray-600 relative">
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${gameState.energy}%`,
              backgroundColor:
                gameState.energy > 50
                  ? '#22c55e'
                  : gameState.energy > 25
                  ? '#eab308'
                  : '#ef4444',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center min-w-[70px] md:min-w-[100px]">
        <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">RYCHLOST</span>
        <span className="text-sm md:text-xl text-cyan-400 font-mono font-bold">
          {Math.round(gameState.speed)} km/h
        </span>
      </div>

      <div className="flex flex-col items-center min-w-[70px] md:min-w-[100px]">
        <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">ČAS</span>
        <span className="text-sm md:text-xl text-yellow-400 font-mono font-bold">
          {formatTime(gameState.time)}
        </span>
      </div>
    </div>
  );
}
