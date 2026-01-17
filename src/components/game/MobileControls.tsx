'use client';

import { useInput } from '@/hooks/useInput';
import { useGameStore } from '@/stores/gameStore';

export function MobileControls() {
  const { moveLeft, moveRight, startPush } = useInput();
  const gameState = useGameStore((s) => s.gameState);

  // Don't show controls during nutrition selection
  if (gameState.phase !== 'race') return null;

  return (
    <div
      className="flex justify-center items-center gap-2 px-3 py-3 bg-gradient-to-t from-gray-950 to-gray-900 border-t-2 border-gray-700 md:hidden"
      style={{
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Left button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          moveLeft();
        }}
        onTouchEnd={(e) => e.preventDefault()}
        onClick={moveLeft}
        className="flex-1 max-w-24 h-14 bg-gradient-to-b from-gray-600 to-gray-700 active:from-gray-700 active:to-gray-800 border-3 border-t-gray-500 border-l-gray-500 border-b-gray-900 border-r-gray-900 text-white text-2xl font-bold rounded-lg shadow-lg active:shadow-inner transition-all select-none flex items-center justify-center"
        aria-label="Doleva"
      >
        ◀
      </button>

      {/* Push/boost button - larger and more prominent */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          startPush();
        }}
        onTouchEnd={(e) => e.preventDefault()}
        onClick={startPush}
        className="flex-1 max-w-32 h-14 bg-gradient-to-b from-orange-500 to-orange-700 active:from-orange-600 active:to-orange-800 border-3 border-t-orange-400 border-l-orange-400 border-b-orange-900 border-r-orange-900 text-white font-bold font-mono rounded-lg shadow-lg active:shadow-inner transition-all select-none flex items-center justify-center gap-1"
        aria-label="Odraz"
      >
        <span className="text-lg">⚡</span>
        <span className="text-sm tracking-wide">ODRAZ</span>
      </button>

      {/* Right button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          moveRight();
        }}
        onTouchEnd={(e) => e.preventDefault()}
        onClick={moveRight}
        className="flex-1 max-w-24 h-14 bg-gradient-to-b from-gray-600 to-gray-700 active:from-gray-700 active:to-gray-800 border-3 border-t-gray-500 border-l-gray-500 border-b-gray-900 border-r-gray-900 text-white text-2xl font-bold rounded-lg shadow-lg active:shadow-inner transition-all select-none flex items-center justify-center"
        aria-label="Doprava"
      >
        ▶
      </button>
    </div>
  );
}
