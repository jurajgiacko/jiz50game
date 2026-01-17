'use client';

import { useGameStore } from '@/stores/gameStore';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const gameState = useGameStore((s) => s.gameState);

  if (gameState.phase !== 'start') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 flex flex-col items-center justify-center p-3 md:p-4 scanlines">
      {/* Retro Window Container */}
      <div className="retro-window w-full max-w-sm md:max-w-md">
        {/* Title bar */}
        <div className="retro-window-title flex items-center justify-between px-2 py-1.5">
          <span className="font-mono text-[10px] md:text-xs font-bold tracking-wide">
            ENERVIT x JIZ50 - FUEL THE RACE
          </span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-300 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 flex items-center justify-center">
              <span className="text-black text-[10px] leading-none">×</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 bg-gradient-to-b from-gray-200 to-gray-300">
          {/* Logos - Premium styling */}
          <div className="flex justify-center items-center gap-3 md:gap-4 mb-4">
            <div className="logo-enervit px-4 py-2.5 md:px-5 md:py-3">
              <span className="text-white font-mono font-bold text-base md:text-xl tracking-wider drop-shadow-lg">
                ENERVIT
              </span>
            </div>
            <div className="text-gray-600 text-2xl md:text-3xl font-bold">×</div>
            <div className="logo-jiz px-3 py-2.5 md:px-4 md:py-3">
              <span className="font-mono font-bold text-sm md:text-lg tracking-wide">
                <span className="text-yellow-300 drop-shadow-lg">JIZ</span>
                <span className="text-white drop-shadow-lg ml-1">50</span>
              </span>
            </div>
          </div>

          {/* Title with glow effect */}
          <h1 className="text-center text-gray-800 font-mono text-xl md:text-3xl font-bold mb-1 drop-shadow tracking-wider">
            FUEL THE RACE
          </h1>
          <p className="text-center text-gray-600 font-mono text-[10px] md:text-xs mb-5">
            Zvládni 50 km se správnou výživou!
          </p>

          {/* Pixel skier - Enervit Red colors */}
          <div className="flex justify-center mb-5">
            <div className="relative w-20 h-24 md:w-24 md:h-28">
              {/* Skier representation with Enervit Red */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2.5 md:w-6 md:h-3 rounded-t-full border border-red-900" style={{ background: 'linear-gradient(to bottom, #ff1a3a, #e40521)' }} /> {/* Helmet */}
              <div className="absolute top-2.5 md:top-3 left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full border border-yellow-300" /> {/* Head */}
              <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 w-6 h-7 md:w-7 md:h-8 rounded border border-red-900" style={{ background: 'linear-gradient(to bottom, #ff1a3a, #e40521)' }} /> {/* Body */}
              <div className="absolute top-[52px] md:top-16 left-1/2 -translate-x-1/2 w-4 h-5 md:w-5 md:h-6 bg-gradient-to-b from-blue-800 to-blue-950 rounded-b border border-blue-900" /> {/* Legs */}
              <div className="absolute top-[72px] md:top-[88px] left-1/2 -translate-x-1/2 w-14 h-2 md:w-16 md:h-2.5 rounded-full border shadow-md" style={{ background: 'linear-gradient(to right, #ff1a3a, #e40521, #ff1a3a)', borderColor: '#b80419' }} /> {/* Skis */}
              {/* Poles */}
              <div className="absolute top-7 md:top-9 left-1 md:left-1.5 w-0.5 md:w-1 h-14 md:h-16 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full" />
              <div className="absolute top-7 md:top-9 right-1 md:right-1.5 w-0.5 md:w-1 h-14 md:h-16 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full" />
            </div>
          </div>

          {/* Controls info - inset style */}
          <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-3 mb-5">
            <h3 className="font-mono text-xs md:text-sm font-bold text-gray-800 mb-2 text-center">
              OVLÁDÁNÍ
            </h3>
            <div className="text-[10px] md:text-xs text-gray-700 space-y-2 font-mono">
              <div className="flex items-center justify-center gap-2">
                <span className="bg-gray-300 px-2 py-0.5 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 text-[10px]">←</span>
                <span className="bg-gray-300 px-2 py-0.5 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 text-[10px]">→</span>
                <span className="text-gray-600">Změna dráhy</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="bg-gray-300 px-3 py-0.5 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 text-[10px]">SPACE</span>
                <span className="text-gray-600">Odraz (zrychli)</span>
              </div>
              <p className="text-gray-500 text-center mt-2 pt-2 border-t border-gray-300">
                📱 Na mobilu: dotyková tlačítka dole
              </p>
            </div>
          </div>

          {/* Mission statement */}
          <div className="bg-orange-100 border-2 border-orange-300 rounded p-2 mb-4">
            <p className="text-orange-800 text-[10px] md:text-xs text-center font-mono leading-relaxed">
              ⚡ Vyber správnou výživu na 7 stanicích a dojeď do cíle!
            </p>
          </div>

          {/* Start button - prominent */}
          <div className="flex justify-center">
            <button
              onClick={startGame}
              className="retro-button-orange px-6 py-3 md:px-8 md:py-4 font-mono text-sm md:text-base tracking-wide"
            >
              🏁 START RACE
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-[8px] md:text-[10px] mt-4 font-mono">
            Right fuel = Better performance ⚡
          </p>
        </div>
      </div>

      {/* Version */}
      <p className="text-blue-300/50 text-[10px] mt-4 font-mono">v2.0 - Mobile Edition</p>
    </div>
  );
}
