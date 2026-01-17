// Game Loop Hook

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useGameLoop(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const updateGame = useGameStore((s) => s.updateGame);
  const updateFireworks = useGameStore((s) => s.updateFireworks);
  const gameState = useGameStore((s) => s.gameState);

  const gameLoop = useCallback(
    (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (gameState.running) {
        updateGame(deltaTime);

        if (gameState.finishMode) {
          updateFireworks();
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState.running, gameState.finishMode, updateGame, updateFireworks]
  );

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  return { lastTimeRef, animationFrameRef };
}
