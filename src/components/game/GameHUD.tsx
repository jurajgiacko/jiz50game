'use client';

import { useGameStore } from '@/stores/gameStore';

export function GameHUD() {
  const gameState = useGameStore((s) => s.gameState);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = Math.min((gameState.distance / 50) * 100, 100);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-b-2 border-gray-700 p-2 md:p-3">
      {/* Progress bar - full width */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">START</span>
          <span className="text-[8px] md:text-[10px] text-orange-400 font-mono font-bold">
            {gameState.distance.toFixed(1)} / 50 km
          </span>
          <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">CÍL</span>
        </div>
        <div className="h-2 md:h-3 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 transition-all duration-200 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Station markers */}
        <div className="relative h-1 mt-0.5">
          {[8, 16, 25, 33, 42].map((km) => (
            <div
              key={km}
              className="absolute w-1 h-1 bg-blue-400 rounded-full -translate-x-1/2"
              style={{ left: `${(km / 50) * 100}%` }}
              title={`${km} km`}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center gap-2">
        {/* Energy */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[8px] md:text-[10px] text-gray-400 font-mono">⚡ ENERGIE</span>
            <span className={`text-[10px] md:text-xs font-mono font-bold ${
              gameState.energy > 50 ? 'text-green-400' :
              gameState.energy > 25 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.round(gameState.energy)}%
            </span>
          </div>
          <div className="h-3 md:h-4 bg-gray-700 rounded border border-gray-600 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                gameState.energy > 50 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                gameState.energy > 25 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
              }`}
              style={{ width: `${gameState.energy}%` }}
            />
          </div>
        </div>

        {/* Speed */}
        <div className="text-center px-2 md:px-3">
          <span className="text-[8px] md:text-[10px] text-gray-400 font-mono block">🚀</span>
          <span className="text-sm md:text-lg text-cyan-400 font-mono font-bold">
            {Math.round(gameState.speed)}
          </span>
          <span className="text-[8px] md:text-[10px] text-gray-500 font-mono block">km/h</span>
        </div>

        {/* Time */}
        <div className="text-center px-2 md:px-3">
          <span className="text-[8px] md:text-[10px] text-gray-400 font-mono block">⏱️</span>
          <span className="text-sm md:text-lg text-yellow-400 font-mono font-bold">
            {formatTime(gameState.time)}
          </span>
        </div>

        {/* Score indicator */}
        <div className="text-center px-2 md:px-3">
          <span className="text-[8px] md:text-[10px] text-gray-400 font-mono block">✓</span>
          <span className="text-sm md:text-lg text-green-400 font-mono font-bold">
            {gameState.correctChoices}
          </span>
          <span className="text-[8px] md:text-[10px] text-gray-500 font-mono block">/{gameState.currentStation}</span>
        </div>
      </div>
    </div>
  );
}
