'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useInput } from '@/hooks/useInput';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHUD } from '@/components/game/GameHUD';
import { MobileControls } from '@/components/game/MobileControls';
import { NutritionPopup } from '@/components/game/NutritionPopup';

export function GameScreen() {
  const gameState = useGameStore((s) => s.gameState);

  // Initialize keyboard input
  useInput();

  // Prevent scrolling during game
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (gameState.running) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, [gameState.running]);

  if (
    gameState.phase !== 'pre' &&
    gameState.phase !== 'race' &&
    gameState.phase !== 'station' &&
    gameState.phase !== 'finish'
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* HUD */}
      <GameHUD />

      {/* Canvas container */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-hidden">
        <GameCanvas />
      </div>

      {/* Mobile controls */}
      <MobileControls />

      {/* Nutrition popup */}
      <NutritionPopup />
    </div>
  );
}
