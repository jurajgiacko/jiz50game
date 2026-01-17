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

  // Prevent scrolling during game and lock viewport
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (gameState.running) {
        e.preventDefault();
      }
    };

    // Prevent pull-to-refresh and overscroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
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
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      {/* HUD - fixed height */}
      <div className="flex-shrink-0">
        <GameHUD />
      </div>

      {/* Canvas container - takes remaining space minus controls */}
      <div className="flex-1 flex items-center justify-center p-1 md:p-2 overflow-hidden min-h-0">
        <GameCanvas />
      </div>

      {/* Mobile controls - fixed at bottom */}
      <div className="flex-shrink-0">
        <MobileControls />
      </div>

      {/* Nutrition popup */}
      <NutritionPopup />
    </div>
  );
}
