'use client';

import { useGameStore } from '@/stores/gameStore';
import { RetroButton } from '@/components/ui/RetroButton';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const gameState = useGameStore((s) => s.gameState);

  if (gameState.phase !== 'start') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col items-center justify-center p-4">
      {/* Retro Window */}
      <div className="bg-gray-300 border-4 border-t-white border-l-white border-b-gray-600 border-r-gray-600 w-full max-w-md">
        {/* Title bar */}
        <div className="bg-blue-800 text-white px-2 py-1 flex items-center justify-between">
          <span className="font-mono text-xs md:text-sm font-bold">
            ENERVIT x JIZERSKÁ 50 - HRA
          </span>
          <div className="flex gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 border border-t-white border-l-white border-b-gray-600 border-r-gray-600" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 bg-gray-200">
          {/* Logos */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-orange-600 px-3 py-2 border-2 border-orange-400">
              <span className="text-white font-mono font-bold text-lg md:text-xl">ENERVIT</span>
            </div>
            <span className="text-gray-600 text-2xl">x</span>
            <div className="bg-blue-800 px-3 py-2 border-2 border-blue-600">
              <span className="text-yellow-400 font-mono font-bold text-lg md:text-xl">
                JIŽ50
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-gray-800 font-mono text-xl md:text-2xl font-bold mb-2">
            VÝŽIVOVÝ ZÁVOD
          </h1>
          <p className="text-center text-gray-600 font-mono text-sm mb-6">
            Zvládni 50 km a vyber správnou výživu!
          </p>

          {/* Pixel skier */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-24">
              {/* Simple pixel art representation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-orange-500" /> {/* Helmet */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-200" /> {/* Head */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-5 h-6 bg-orange-500" /> {/* Body */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-3 h-5 bg-blue-900" /> {/* Legs */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-orange-500" /> {/* Skis */}
              {/* Poles */}
              <div className="absolute top-6 left-2 w-0.5 h-12 bg-gray-700" />
              <div className="absolute top-6 right-2 w-0.5 h-12 bg-gray-700" />
            </div>
          </div>

          {/* Controls info */}
          <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-3 mb-6">
            <h3 className="font-mono text-sm font-bold text-gray-800 mb-2">OVLÁDÁNÍ:</h3>
            <div className="text-xs md:text-sm text-gray-700 space-y-1 font-mono">
              <p>
                <span className="bg-gray-300 px-1 border border-gray-400">←</span>{' '}
                <span className="bg-gray-300 px-1 border border-gray-400">→</span> Změna dráhy
              </p>
              <p>
                <span className="bg-gray-300 px-2 border border-gray-400">SPACE</span> Odraz
              </p>
              <p className="text-gray-500 mt-2">Na mobilu: dotyková tlačítka</p>
            </div>
          </div>

          {/* Start button */}
          <div className="flex justify-center">
            <RetroButton onClick={startGame} size="lg">
              ZAHÁJIT ZÁVOD
            </RetroButton>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-[10px] md:text-xs mt-4 font-mono">
            Správná výživa = lepší výkon
          </p>
        </div>
      </div>

      {/* Version */}
      <p className="text-gray-500 text-xs mt-4 font-mono">v1.0 - Retro Edition</p>
    </div>
  );
}
