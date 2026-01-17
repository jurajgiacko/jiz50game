// Input Hook for Keyboard and Touch

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useInput() {
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const startPush = useGameStore((s) => s.startPush);
  const gameState = useGameStore((s) => s.gameState);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameState.running || gameState.paused) return;

      if (e.code === 'ArrowLeft') {
        moveLeft();
      }
      if (e.code === 'ArrowRight') {
        moveRight();
      }
      if (e.code === 'Space') {
        startPush();
        e.preventDefault();
      }
    },
    [gameState.running, gameState.paused, moveLeft, moveRight, startPush]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { moveLeft, moveRight, startPush };
}
