'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '@/lib/constants';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gameState = useGameStore((s) => s.gameState);
  const player = useGameStore((s) => s.player);
  const track = useGameStore((s) => s.track);
  const fireworks = useGameStore((s) => s.fireworks);
  const feedbackText = useGameStore((s) => s.feedbackText);
  const feedbackColor = useGameStore((s) => s.feedbackColor);
  const feedbackTimer = useGameStore((s) => s.feedbackTimer);

  useGameLoop(canvasRef);

  // Drawing functions
  const drawMountain = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, baseY: number, height: number) => {
      ctx.fillStyle = COLORS.mountain;
      ctx.beginPath();
      ctx.moveTo(x - height, baseY);
      ctx.lineTo(x, baseY - height);
      ctx.lineTo(x + height, baseY);
      ctx.closePath();
      ctx.fill();

      // Snow cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x - height * 0.3, baseY - height * 0.6);
      ctx.lineTo(x, baseY - height);
      ctx.lineTo(x + height * 0.3, baseY - height * 0.6);
      ctx.closePath();
      ctx.fill();
    },
    []
  );

  const drawTree = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.fillStyle = COLORS.tree;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x - size / 2, y);
      ctx.lineTo(x + size / 2, y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.7);
      ctx.lineTo(x - size / 2.5, y - size * 0.2);
      ctx.lineTo(x + size / 2.5, y - size * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = COLORS.trunk;
      ctx.fillRect(x - 4, y, 8, 15);
    },
    []
  );

  const drawSkier = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, pushing: boolean, pushFrame: number) => {
      const lean = pushing ? Math.sin(pushFrame * 0.5) * 5 : 0;

      // Skis
      ctx.fillStyle = COLORS.enervitOrange;
      ctx.fillRect(x - 25 + lean, y + 25, 50, 6);
      ctx.fillRect(x - 23 + lean, y + 27, 46, 2);

      // Legs
      ctx.fillStyle = '#000080';
      ctx.fillRect(x - 8, y + 5, 6, 22);
      ctx.fillRect(x + 2, y + 5, 6, 22);

      // Body
      ctx.fillStyle = COLORS.enervitOrange;
      ctx.fillRect(x - 10, y - 15, 20, 22);

      // Enervit logo on chest (simple E)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 5, y - 12, 10, 2);
      ctx.fillRect(x - 5, y - 12, 2, 15);
      ctx.fillRect(x - 5, y - 5, 8, 2);
      ctx.fillRect(x - 5, y + 1, 10, 2);

      // Arms with poles
      ctx.fillStyle = '#ffcc99';
      const armAngle = pushing ? Math.sin(pushFrame * 0.5) * 15 : 0;

      ctx.fillRect(x - 18 - armAngle, y - 10, 10, 5);
      ctx.fillRect(x + 8 + armAngle, y - 10, 10, 5);

      // Poles
      ctx.fillStyle = '#333333';
      ctx.fillRect(x - 22 - armAngle, y - 12, 2, 45);
      ctx.fillRect(x + 20 + armAngle, y - 12, 2, 45);

      // Head
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(x - 6, y - 28, 12, 12);

      // Helmet
      ctx.fillStyle = COLORS.enervitOrange;
      ctx.fillRect(x - 8, y - 32, 16, 8);

      // Goggles
      ctx.fillStyle = '#000000';
      ctx.fillRect(x - 5, y - 24, 10, 4);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x - 4, y - 23, 3, 2);
      ctx.fillRect(x + 1, y - 23, 3, 2);
    },
    []
  );

  const drawCompetitor = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      lane: number,
      screenY: number,
      bodyColor: string,
      helmetColor: string
    ) => {
      const x = 300 + lane * 100;
      const y = screenY;

      // Skis
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - 20, y + 20, 40, 5);

      // Legs
      ctx.fillStyle = '#000080';
      ctx.fillRect(x - 6, y + 5, 5, 17);
      ctx.fillRect(x + 1, y + 5, 5, 17);

      // Body (colored jersey)
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x - 8, y - 10, 16, 17);

      // Arms
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(x - 14, y - 6, 8, 4);
      ctx.fillRect(x + 6, y - 6, 8, 4);

      // Poles
      ctx.fillStyle = '#333333';
      ctx.fillRect(x - 16, y - 8, 2, 35);
      ctx.fillRect(x + 14, y - 8, 2, 35);

      // Head
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(x - 5, y - 20, 10, 10);

      // Helmet
      ctx.fillStyle = helmetColor;
      ctx.fillRect(x - 6, y - 24, 12, 6);
    },
    []
  );

  const drawTrack = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, 200);
      skyGradient.addColorStop(0, '#87ceeb');
      skyGradient.addColorStop(1, '#b0e0e6');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, 200);

      // Mountains
      drawMountain(ctx, 100, 200, 150);
      drawMountain(ctx, 300, 200, 200);
      drawMountain(ctx, 550, 200, 180);
      drawMountain(ctx, 700, 200, 120);

      // Snow/ground
      ctx.fillStyle = COLORS.snow;
      ctx.fillRect(0, 200, CANVAS_WIDTH, 300);

      // Track lanes
      ctx.fillStyle = COLORS.track;
      ctx.fillRect(200, 200, 400, 300);

      // Track lines
      ctx.strokeStyle = '#c0c8d0';
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(250 + i * 100, 200);
        ctx.lineTo(250 + i * 100, 500);
        ctx.stroke();
      }

      // Moving track marks
      ctx.fillStyle = '#d0d8e0';
      for (let i = 0; i < 20; i++) {
        const markY = ((track.offset + i * 30) % 350) + 150;
        ctx.fillRect(220, markY, 360, 4);
      }

      // Trees on sides
      track.trees.forEach((tree) => {
        const treeY = ((tree.y + track.offset * 0.5) % 600) - 50;
        drawTree(ctx, tree.x, treeY, tree.size);
      });

      // Distance markers
      const markerKm = Math.floor(gameState.distance / 5) * 5;
      if (markerKm > 0 && markerKm <= 50) {
        const markerY = 300 - ((gameState.distance % 5) / 5) * 100;
        if (markerY > 100 && markerY < 400) {
          ctx.fillStyle = COLORS.enervitOrange;
          ctx.fillRect(675, markerY - 15, 50, 30);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.strokeRect(675, markerY - 15, 50, 30);

          ctx.fillStyle = '#fff';
          ctx.font = '12px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(markerKm + 'km', 700, markerY + 5);
        }
      }
    },
    [track.offset, track.trees, gameState.distance, drawMountain, drawTree]
  );

  const drawApproachingStation = useCallback(
    (ctx: CanvasRenderingContext2D, stationKm: number) => {
      const distToStation = stationKm - gameState.distance;
      if (distToStation > 0 && distToStation < 1) {
        const stationY = 100 + (1 - distToStation) * 200;

        // Station tent
        ctx.fillStyle = COLORS.enervitOrange;
        ctx.beginPath();
        ctx.moveTo(400, stationY - 60);
        ctx.lineTo(300, stationY);
        ctx.lineTo(500, stationY);
        ctx.closePath();
        ctx.fill();

        // ENERVIT text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ENERVIT', 400, stationY - 20);

        // Station banner
        ctx.fillStyle = '#000080';
        ctx.fillRect(320, stationY - 5, 160, 20);
        ctx.fillStyle = '#ffff00';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText('NUTRITION STATION', 400, stationY + 8);
      }
    },
    [gameState.distance]
  );

  const drawJizerskaLogo = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = COLORS.jizerskaBlue;
    ctx.fillRect(x, y, 75, 45);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 75, 45);
    ctx.strokeStyle = '#001a66';
    ctx.strokeRect(x + 2, y + 2, 71, 41);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JIZERSKA', x + 37, y + 18);

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.fillText('50', x + 37, y + 36);
  }, []);

  const drawEnervitLogo = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = COLORS.enervitOrange;
    ctx.fillRect(x, y, 70, 35);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 70, 35);
    ctx.strokeStyle = '#cc5500';
    ctx.strokeRect(x + 2, y + 2, 66, 31);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ENERVIT', x + 35, y + 22);
  }, []);

  const drawSkierOnPodium = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Legs
    ctx.fillStyle = '#000080';
    ctx.fillRect(x - 8, y + 5, 6, 25);
    ctx.fillRect(x + 2, y + 5, 6, 25);

    // Body
    ctx.fillStyle = COLORS.enervitOrange;
    ctx.fillRect(x - 12, y - 20, 24, 27);

    // Arms up (celebrating!)
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(x - 20, y - 35, 8, 20);
    ctx.fillRect(x + 12, y - 35, 8, 20);

    // Head
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(x - 6, y - 35, 12, 14);

    // Helmet
    ctx.fillStyle = COLORS.enervitOrange;
    ctx.fillRect(x - 8, y - 42, 16, 10);

    // Happy face
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 32, 2, 2);
    ctx.fillRect(x + 2, y - 32, 2, 2);
    ctx.fillRect(x - 3, y - 26, 6, 2);
  }, []);

  const drawPodium = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Sky
      ctx.fillStyle = '#1a1a4e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const sx = (i * 73) % CANVAS_WIDTH;
        const sy = (i * 37) % 200;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Ground/snow
      ctx.fillStyle = COLORS.track;
      ctx.fillRect(0, 380, CANVAS_WIDTH, 120);

      // Podium
      ctx.fillStyle = COLORS.silver;
      ctx.fillRect(200, 320, 120, 80);
      ctx.fillStyle = '#000';
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('2', 260, 360);

      ctx.fillStyle = COLORS.gold;
      ctx.fillRect(340, 280, 120, 120);
      ctx.fillStyle = '#000';
      ctx.fillText('1', 400, 330);

      ctx.fillStyle = COLORS.bronze;
      ctx.fillRect(480, 340, 120, 60);
      ctx.fillStyle = '#000';
      ctx.fillText('3', 540, 375);

      // Player on 1st place
      drawSkierOnPodium(ctx, 400, 260);

      // ENERVIT banner
      ctx.fillStyle = COLORS.enervitOrange;
      ctx.fillRect(250, 50, 300, 60);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(250, 50, 300, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ENERVIT', 400, 90);

      // JIZERSKA 50 text
      ctx.fillStyle = COLORS.jizerskaBlue;
      ctx.fillRect(280, 130, 240, 40);
      ctx.fillStyle = '#ffcc00';
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.fillText('JIZERSKA 50', 400, 158);

      // Fireworks
      fireworks.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 100;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;

      // CÍL text
      ctx.fillStyle = '#00ff00';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText('VÍTEJ V CÍLI!', 400, 220);
      ctx.fillText('Vyber si regeneraci...', 400, 240);
    },
    [fireworks, drawSkierOnPodium]
  );

  // Main draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // If finish mode, draw podium instead of track
    if (gameState.finishMode) {
      drawPodium(ctx);
      return;
    }

    drawTrack(ctx);

    // Draw approaching stations
    track.stations.forEach((station) => {
      if (!station.triggered) {
        drawApproachingStation(ctx, station.km);
      }
    });

    // Draw competitors
    track.competitors.forEach((comp) => {
      if (!comp.active) return;
      const screenY = 200 + comp.y;
      if (screenY > -50 && screenY < 500) {
        drawCompetitor(ctx, comp.lane, screenY, comp.color.body, comp.color.helmet);
      }
    });

    // Draw player
    drawSkier(ctx, player.x, player.y, player.pushing, player.pushFrame);

    // Draw energy warning
    if (gameState.energy < 30) {
      ctx.fillStyle = '#ff0000';
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('! NÍZKÁ ENERGIE !', CANVAS_WIDTH / 2, 50);
      ctx.globalAlpha = 1;
    }

    // Draw feedback text
    if (feedbackTimer > 0) {
      ctx.fillStyle = feedbackColor;
      ctx.globalAlpha = Math.min(1, feedbackTimer / 500);
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(feedbackText, CANVAS_WIDTH / 2, 80);
      ctx.globalAlpha = 1;
    }

    // Draw speed boost indicator
    if (gameState.speedBoost !== 0) {
      ctx.fillStyle = gameState.speedBoost > 0 ? '#00ff00' : '#ff0000';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      const boostText =
        gameState.speedBoost > 0
          ? '+' + gameState.speedBoost.toFixed(1)
          : gameState.speedBoost.toFixed(1);
      ctx.fillText('BOOST: ' + boostText, CANVAS_WIDTH / 2, 480);
    }

    // Draw logos
    drawJizerskaLogo(ctx, 10, 10);
    drawEnervitLogo(ctx, 720, 10);
  }, [
    gameState,
    player,
    track,
    feedbackText,
    feedbackColor,
    feedbackTimer,
    drawTrack,
    drawApproachingStation,
    drawCompetitor,
    drawSkier,
    drawPodium,
    drawJizerskaLogo,
    drawEnervitLogo,
  ]);

  // Animation loop for drawing
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="w-full max-w-[800px] h-auto border-4 border-gray-800 rounded"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
