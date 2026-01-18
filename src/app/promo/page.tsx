'use client';

import React, { useState, useRef, useCallback } from 'react';

// Enervit brand colors
const ENERVIT_RED = '#e40521';
const JIZ_BLUE = '#0066cc';

// Pure Canvas rendering for video frames (avoids html2canvas lab() color issues)
function drawFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  variant: ReelsVariant,
  frameIndex: number,
  score: string,
  rating: string,
  width: number,
  height: number
) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1e3a5f');
  gradient.addColorStop(0.5, '#1e40af');
  gradient.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Scanlines overlay
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 2);
  }

  // Common text settings
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Helper functions
  const drawText = (text: string, x: number, y: number, color: string, size: number, bold = false) => {
    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${size}px "Press Start 2P", monospace`;
    ctx.fillText(text, x, y);
  };

  const drawButton = (text: string, x: number, y: number, w: number, h: number, bgColor: string) => {
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - w/2, y - h/2, w, h, 8);
    ctx.fill();
    drawText(text, x, y, '#ffffff', 20, true);
  };

  const drawLogo = (x: number, y: number, scale = 1) => {
    // Enervit logo
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(x - 100*scale, y - 20*scale, 80*scale, 40*scale, 4);
    ctx.fill();
    drawText('ENERVIT', x - 60*scale, y, '#ffffff', 14*scale, true);

    // X
    drawText('×', x, y, '#ffffff', 24*scale);

    // JIZ50 logo
    ctx.fillStyle = JIZ_BLUE;
    ctx.beginPath();
    ctx.roundRect(x + 20*scale, y - 20*scale, 80*scale, 40*scale, 4);
    ctx.fill();
    drawText('JIZ', x + 45*scale, y, '#fde047', 12*scale, true);
    drawText('50', x + 75*scale, y, '#ffffff', 12*scale, true);
  };

  const drawSkier = (x: number, y: number, scale = 1) => {
    // Helmet
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.ellipse(x, y - 45*scale, 12*scale, 8*scale, 0, Math.PI, 0);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(x, y - 35*scale, 10*scale, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = ENERVIT_RED;
    ctx.fillRect(x - 12*scale, y - 22*scale, 24*scale, 35*scale);

    // Legs
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x - 8*scale, y + 13*scale, 16*scale, 25*scale);

    // Skis
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(x - 35*scale, y + 40*scale, 70*scale, 8*scale, 4);
    ctx.fill();

    // Poles
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(x - 25*scale, y - 15*scale, 3*scale, 60*scale);
    ctx.fillRect(x + 22*scale, y - 15*scale, 3*scale, 60*scale);
  };

  const cx = width / 2;
  const cy = height / 2;

  // Draw frame based on variant and index
  if (variant === 'teaser') {
    switch (frameIndex) {
      case 0: // Logo animation
        drawLogo(cx, cy - 50, 1.2);
        drawText('PRESENTS', cx, cy + 50, '#9ca3af', 16);
        break;
      case 1: // Title with skier
        drawText('FUEL THE RACE', cx, cy - 150, ENERVIT_RED, 36, true);
        ctx.shadowColor = ENERVIT_RED;
        ctx.shadowBlur = 20;
        ctx.fillStyle = ENERVIT_RED;
        ctx.fillText('FUEL THE RACE', cx, cy - 150);
        ctx.shadowBlur = 0;
        drawSkier(cx, cy + 50, 1.5);
        break;
      case 2: // Product selection
        drawText('KM 8 - OBČERSTVENÍ', cx, cy - 200, '#fde047', 20);
        const products = ['ISOTONIC', 'GEL', 'PROTEIN BAR'];
        products.forEach((p, i) => {
          const y = cy - 80 + i * 80;
          ctx.strokeStyle = i === 0 ? '#22c55e' : '#4b5563';
          ctx.lineWidth = 3;
          ctx.fillStyle = i === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(55, 65, 81, 0.5)';
          ctx.beginPath();
          ctx.roundRect(cx - 180, y - 30, 360, 60, 8);
          ctx.fill();
          ctx.stroke();
          drawText(`ENERVIT ${p}`, cx, y, '#ffffff', 18);
        });
        drawText('Vyber správnou výživu!', cx, cy + 180, '#ffffff', 14);
        break;
      case 3: // Correct choice
        drawText('✓', cx, cy - 80, '#22c55e', 80);
        drawText('SPRÁVNĚ!', cx, cy + 20, '#22c55e', 32, true);
        drawText('+25 ENERGIE', cx, cy + 80, '#ffffff', 24);
        // Energy bar
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(cx - 150, cy + 130, 300, 20, 10);
        ctx.fill();
        const energyGradient = ctx.createLinearGradient(cx - 150, 0, cx + 100, 0);
        energyGradient.addColorStop(0, '#22c55e');
        energyGradient.addColorStop(1, '#4ade80');
        ctx.fillStyle = energyGradient;
        ctx.beginPath();
        ctx.roundRect(cx - 148, cy + 132, 250, 16, 8);
        ctx.fill();
        break;
      case 4: // CTA
        drawText('ZAHRAJ SI TEĎ!', cx, cy - 100, '#ffffff', 28, true);
        drawButton('🎮 HRAŤ', cx, cy, 200, 60, ENERVIT_RED);
        drawText('🎁 -15% na enervit.cz', cx, cy + 100, '#fde047', 16);
        drawText('jiz50.enervit.online', cx, cy + 160, '#9ca3af', 14);
        break;
    }
  } else if (variant === 'challenge') {
    switch (frameIndex) {
      case 0: // Challenge intro
        drawText('⚡ VÝZVA ⚡', cx, cy - 80, '#fde047', 28, true);
        drawText('Zvládneš JIZ50', cx, cy + 20, '#ffffff', 24);
        drawText('se správnou výživou?', cx, cy + 60, '#ffffff', 24);
        break;
      case 1: // Gameplay
        drawText('🎿', cx, cy - 120, '#ffffff', 60);
        drawText('50 km závod', cx, cy - 30, '#ffffff', 24);
        drawText('7 výživových stanic', cx, cy + 20, '#9ca3af', 18);
        // Station markers
        const kms = [0, 8, 16, 25, 33, 42, 50];
        kms.forEach((km, i) => {
          const x = cx - 150 + i * 50;
          ctx.fillStyle = '#374151';
          ctx.beginPath();
          ctx.arc(x, cy + 100, 18, 0, Math.PI * 2);
          ctx.fill();
          drawText(String(km), x, cy + 100, '#9ca3af', 10);
        });
        break;
      case 2: // Tension
        drawText('⚠️ ENERGIE KLESÁ!', cx, cy - 100, '#ef4444', 22);
        // Low energy bar
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(cx - 150, cy - 30, 300, 25, 12);
        ctx.fill();
        const lowEnergyGradient = ctx.createLinearGradient(cx - 150, 0, cx - 70, 0);
        lowEnergyGradient.addColorStop(0, '#dc2626');
        lowEnergyGradient.addColorStop(1, '#f97316');
        ctx.fillStyle = lowEnergyGradient;
        ctx.beginPath();
        ctx.roundRect(cx - 148, cy - 28, 75, 21, 10);
        ctx.fill();
        drawText('KM 42', cx, cy + 50, '#ffffff', 32, true);
        drawText('Posledná stanica!', cx, cy + 100, '#9ca3af', 16);
        break;
      case 3: // Result
        drawText('MŮJ VÝSLEDEK:', cx, cy - 120, '#9ca3af', 16);
        drawText(score, cx, cy - 30, '#22c55e', 64, true);
        drawText(rating, cx, cy + 60, '#fde047', 24);
        drawText('🏆', cx, cy + 140, '#ffffff', 50);
        break;
      case 4: // Challenge CTA
        drawText('PŘEKONEJ MĚ!', cx, cy - 80, '#ffffff', 28, true);
        drawButton('🎮 HRÁT', cx, cy + 20, 200, 60, ENERVIT_RED);
        drawText('Link v bio 👆', cx, cy + 120, '#9ca3af', 16);
        break;
    }
  } else if (variant === 'howto') {
    switch (frameIndex) {
      case 0: // Intro
        drawText('🎮 JAK HRÁT?', cx, cy - 50, '#ffffff', 28);
        drawText('FUEL THE RACE', cx, cy + 30, ENERVIT_RED, 24, true);
        break;
      case 1: // Controls
        drawText('OVLÁDÁNÍ', cx, cy - 150, '#fde047', 22);
        // Arrow keys
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(cx - 90, cy - 70, 50, 40, 6);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(cx - 30, cy - 70, 50, 40, 6);
        ctx.fill();
        drawText('←', cx - 65, cy - 50, '#ffffff', 20);
        drawText('→', cx - 5, cy - 50, '#ffffff', 20);
        drawText('Změna dráhy', cx + 80, cy - 50, '#9ca3af', 12);
        // Space
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(cx - 70, cy + 20, 100, 40, 6);
        ctx.fill();
        drawText('SPACE', cx - 20, cy + 40, '#ffffff', 14);
        drawText('Odraz', cx + 80, cy + 40, '#9ca3af', 12);
        break;
      case 2: // Stations
        drawText('7 STANIC', cx, cy - 100, '#fde047', 24);
        drawText('= 7 ROZHODNUTÍ', cx, cy - 50, '#ffffff', 22);
        const stationKms = [0, 8, 16, 25, 33, 42, 50];
        stationKms.forEach((km, i) => {
          const x = cx - 150 + i * 50;
          ctx.fillStyle = ENERVIT_RED;
          ctx.beginPath();
          ctx.roundRect(x - 15, cy + 20, 30, 30, 4);
          ctx.fill();
          drawText(String(km), x, cy + 35, '#ffffff', 10);
        });
        break;
      case 3: // Products
        drawText('PRODUKTY', cx, cy - 150, '#fde047', 22);
        const prods = [
          { text: '✓ PRE SPORT - před startem', color: '#22c55e' },
          { text: '✓ ISOTONIC - hydratace', color: '#3b82f6' },
          { text: '✓ GEL - rychlá energie', color: '#f97316' },
          { text: '✓ KOFEIN - boost!', color: '#fde047' },
        ];
        prods.forEach((p, i) => {
          drawText(p.text, cx, cy - 60 + i * 50, p.color, 14);
        });
        break;
      case 4: // Tip
        drawText('💡 TIP', cx, cy - 100, '#fde047', 22);
        drawText('KOFEIN v půlce', cx, cy - 20, '#ffffff', 22);
        drawText('závodu = BOOST!', cx, cy + 20, '#ffffff', 22);
        drawText('⚡', cx, cy + 100, '#fde047', 50);
        break;
      case 5: // CTA
        drawText('Nauč se to hrou!', cx, cy - 100, '#ffffff', 22);
        drawButton('🎮 HRÁT', cx, cy, 200, 60, ENERVIT_RED);
        drawText('🎁 -15% na enervit.cz', cx, cy + 100, '#fde047', 16);
        drawText('Link v bio 👆', cx, cy + 150, '#9ca3af', 14);
        break;
    }
  }

  // Frame indicator dots
  const frameCount = variant === 'howto' ? 6 : 5;
  for (let i = 0; i < frameCount; i++) {
    ctx.fillStyle = i === frameIndex ? '#ffffff' : '#4b5563';
    ctx.beginPath();
    ctx.arc(cx - (frameCount * 10) + i * 20, height - 60, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Pure Canvas rendering for Story graphics
function drawStoryToCanvas(
  ctx: CanvasRenderingContext2D,
  variant: PromoVariant,
  score: string,
  rating: string,
  width: number,
  height: number
) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1e3a5f');
  gradient.addColorStop(0.5, '#1e40af');
  gradient.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 2);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const drawText = (text: string, x: number, y: number, color: string, size: number, bold = false) => {
    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${size}px "Press Start 2P", monospace`;
    ctx.fillText(text, x, y);
  };

  const drawLogo = (x: number, y: number, scale = 1) => {
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(x - 100*scale, y - 20*scale, 80*scale, 40*scale, 4);
    ctx.fill();
    ctx.strokeStyle = '#ff5566';
    ctx.lineWidth = 2;
    ctx.stroke();
    drawText('ENERVIT', x - 60*scale, y, '#ffffff', 12*scale, true);

    drawText('×', x, y, '#9ca3af', 20*scale);

    ctx.fillStyle = JIZ_BLUE;
    ctx.beginPath();
    ctx.roundRect(x + 20*scale, y - 20*scale, 70*scale, 40*scale, 4);
    ctx.fill();
    ctx.strokeStyle = '#4da6ff';
    ctx.stroke();
    drawText('JIZ', x + 40*scale, y, '#fde047', 10*scale, true);
    drawText('50', x + 70*scale, y, '#ffffff', 10*scale, true);
  };

  const drawSkier = (x: number, y: number, scale = 1) => {
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.ellipse(x, y - 45*scale, 10*scale, 6*scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(x, y - 35*scale, 8*scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ENERVIT_RED;
    ctx.fillRect(x - 10*scale, y - 24*scale, 20*scale, 28*scale);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x - 7*scale, y + 4*scale, 14*scale, 20*scale);
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(x - 28*scale, y + 26*scale, 56*scale, 6*scale, 3);
    ctx.fill();
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(x - 20*scale, y - 18*scale, 2*scale, 48*scale);
    ctx.fillRect(x + 18*scale, y - 18*scale, 2*scale, 48*scale);
  };

  const cx = width / 2;

  if (variant === 'story-challenge') {
    // Challenge variant
    drawLogo(cx, height * 0.08, 1.2);
    drawText('⚡ VÝZVA ⚡', cx, height * 0.18, '#fde047', 28);
    drawText('Kolik správných voleb', cx, height * 0.24, '#ffffff', 16);
    drawText('zvládneš ty?', cx, height * 0.28, '#ffffff', 16);

    // Score box
    ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - 140, height * 0.34, 280, 180, 12);
    ctx.fill();
    ctx.stroke();

    drawText('MŮJ VÝSLEDEK:', cx, height * 0.40, '#9ca3af', 14);
    drawText(score + ' ✓', cx, height * 0.48, '#22c55e', 42, true);
    drawText(rating, cx, height * 0.56, '#fde047', 18);

    // Title
    ctx.shadowColor = ENERVIT_RED;
    ctx.shadowBlur = 15;
    drawText('FUEL THE RACE', cx, height * 0.68, ENERVIT_RED, 36, true);
    ctx.shadowBlur = 0;

    // CTA button
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(cx - 120, height * 0.76, 240, 60, 8);
    ctx.fill();
    drawText('🏆 PŘEKONEJ MĚ!', cx, height * 0.79, '#ffffff', 16, true);

    drawText('⬆️ SWIPE UP ⬆️', cx, height * 0.88, '#ffffff', 18);
  } else {
    // Play variant
    drawLogo(cx, height * 0.08, 1.2);
    drawSkier(cx, height * 0.22, 1.8);

    ctx.shadowColor = ENERVIT_RED;
    ctx.shadowBlur = 15;
    drawText('FUEL THE RACE', cx, height * 0.42, ENERVIT_RED, 40, true);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(cx - 120, height * 0.45, 240, 2);

    drawText('Zvládneš 50 km se', cx, height * 0.52, '#ffffff', 16);
    drawText('správnou výživou?', cx, height * 0.56, '#ffffff', 16);

    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(cx - 130, height * 0.64, 260, 60, 8);
    ctx.fill();
    drawText('🎮 ZAHRAJ SI TEĎ', cx, height * 0.67, '#ffffff', 16, true);

    drawText('⬆️ SWIPE UP ⬆️', cx, height * 0.78, '#ffffff', 18);
    drawText('🎁 -15% na enervit.cz', cx, height * 0.88, '#fde047', 14);
  }
}

// Pure Canvas rendering for Post graphics
function drawPostToCanvas(
  ctx: CanvasRenderingContext2D,
  variant: PromoVariant,
  width: number,
  height: number
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1e3a5f');
  gradient.addColorStop(0.5, '#1e40af');
  gradient.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 2);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const drawText = (text: string, x: number, y: number, color: string, size: number, bold = false) => {
    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${size}px "Press Start 2P", monospace`;
    ctx.fillText(text, x, y);
  };

  const cx = width / 2;

  if (variant === 'post-edu') {
    // Educational post
    drawText('VÍTE, ŽE...? 🤔', cx, height * 0.08, '#ffffff', 24);
    drawText('Na JIZ50 potřebuješ', cx, height * 0.16, '#ffffff', 14);
    drawText('doplnit energii minimálně', cx, height * 0.20, '#ffffff', 14);
    drawText('7× během závodu!', cx, height * 0.24, '#ffffff', 14);

    // Info box
    ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 180, height * 0.30, 360, 200, 8);
    ctx.fill();
    ctx.stroke();

    const stations = [
      { km: 'KM 0', product: 'PRE SPORT', color: '#22c55e' },
      { km: 'KM 8', product: 'ISOTONIC', color: '#3b82f6' },
      { km: 'KM 16', product: 'GEL', color: '#f97316' },
      { km: 'KM 25', product: 'KOFEIN', color: '#fde047' },
    ];
    stations.forEach((s, i) => {
      const y = height * 0.36 + i * 40;
      ctx.textAlign = 'left';
      drawText(s.km, cx - 150, y, '#9ca3af', 12);
      ctx.textAlign = 'right';
      drawText('→ ' + s.product, cx + 150, y, s.color, 12);
    });
    ctx.textAlign = 'center';
    drawText('...', cx, height * 0.52, '#6b7280', 16);

    drawText('Nauč se to hrou! 🎮', cx, height * 0.62, '#ffffff', 18);

    ctx.shadowColor = ENERVIT_RED;
    ctx.shadowBlur = 10;
    drawText('FUEL THE RACE', cx, height * 0.72, ENERVIT_RED, 28, true);
    ctx.shadowBlur = 0;

    // Logos
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(cx - 100, height * 0.80, 70, 30, 4);
    ctx.fill();
    drawText('ENERVIT', cx - 65, height * 0.82, '#ffffff', 8, true);

    drawText('×', cx, height * 0.82, '#9ca3af', 14);

    ctx.fillStyle = JIZ_BLUE;
    ctx.beginPath();
    ctx.roundRect(cx + 30, height * 0.80, 70, 30, 4);
    ctx.fill();
    drawText('JIZ50', cx + 65, height * 0.82, '#ffffff', 8, true);

    drawText('▶ Link v bio', cx, height * 0.92, '#9ca3af', 12);
  } else {
    // Launch post
    ctx.fillStyle = ENERVIT_RED;
    ctx.beginPath();
    ctx.roundRect(cx - 80, height * 0.04, 60, 30, 4);
    ctx.fill();
    drawText('ENERVIT', cx - 50, height * 0.06, '#ffffff', 8, true);

    drawText('×', cx, height * 0.06, '#9ca3af', 14);

    ctx.fillStyle = JIZ_BLUE;
    ctx.beginPath();
    ctx.roundRect(cx + 20, height * 0.04, 60, 30, 4);
    ctx.fill();
    drawText('JIZ50', cx + 50, height * 0.06, '#ffffff', 8, true);

    ctx.shadowColor = ENERVIT_RED;
    ctx.shadowBlur = 12;
    drawText('FUEL THE RACE', cx, height * 0.16, ENERVIT_RED, 32, true);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(cx - 100, height * 0.19, 200, 2);

    // Game preview box
    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - 160, height * 0.24, 320, 180, 8);
    ctx.fill();
    ctx.stroke();

    drawText('🎮 RETRO GAME', cx, height * 0.28, '#9ca3af', 12);

    // Mini game scene
    const skyGradient = ctx.createLinearGradient(0, height * 0.32, 0, height * 0.50);
    skyGradient.addColorStop(0, '#38bdf8');
    skyGradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = skyGradient;
    ctx.beginPath();
    ctx.roundRect(cx - 140, height * 0.32, 280, 120, 4);
    ctx.fill();

    // Snow
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(cx - 140, height * 0.46, 280, 20);

    // Mountains
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(cx - 100, height * 0.46);
    ctx.lineTo(cx - 60, height * 0.36);
    ctx.lineTo(cx - 20, height * 0.46);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 20, height * 0.46);
    ctx.lineTo(cx + 70, height * 0.34);
    ctx.lineTo(cx + 120, height * 0.46);
    ctx.fill();

    // Mini skier
    ctx.fillStyle = ENERVIT_RED;
    ctx.fillRect(cx - 5, height * 0.43, 10, 14);

    drawText('Zvol správnou výživu', cx, height * 0.56, '#ffffff', 14);
    drawText('na 7 stanicích a', cx, height * 0.60, '#ffffff', 14);
    drawText('dojeď do cíle! 🏁', cx, height * 0.64, '#ffffff', 14);

    drawText('🎁 BONUS: -15% sleva', cx, height * 0.72, '#fde047', 14);
    drawText('▶ Link v bio', cx, height * 0.80, '#9ca3af', 14);
  }
}

type PromoVariant = 'story-play' | 'story-challenge' | 'post-launch' | 'post-edu';
type ReelsVariant = 'teaser' | 'challenge' | 'howto';
type TabType = 'graphics' | 'reels';

export default function PromoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('graphics');
  const [activeVariant, setActiveVariant] = useState<PromoVariant>('story-play');
  const [activeReels, setActiveReels] = useState<ReelsVariant>('teaser');
  const [score, setScore] = useState('6/7');
  const [rating, setRating] = useState('PROFESIONÁL');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeReelsFrame, setActiveReelsFrame] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const reelsFrameRef = useRef<HTMLDivElement>(null);

  // Reels scenarios data
  const reelsScenarios: Record<ReelsVariant, { title: string; duration: string; durationSec: number; frames: { time: string; content: string; text?: string; durationSec: number }[] }> = {
    'teaser': {
      title: 'Gameplay Teaser',
      duration: '15s',
      durationSec: 15,
      frames: [
        { time: '0-3s', content: 'Logo animácia', text: 'ENERVIT × JIZ50', durationSec: 3 },
        { time: '3-6s', content: 'Lyžiar na trati', text: 'FUEL THE RACE', durationSec: 3 },
        { time: '6-10s', content: 'Výber produktov', text: 'Vyber správnou výživu!', durationSec: 4 },
        { time: '10-13s', content: 'Správna voľba', text: '✓ SPRÁVNE! +25 energie', durationSec: 3 },
        { time: '13-15s', content: 'CTA', text: 'ZAHRAJ SI TEĎ! 🎮', durationSec: 2 },
      ],
    },
    'challenge': {
      title: 'Challenge Video',
      duration: '20s',
      durationSec: 20,
      frames: [
        { time: '0-3s', content: 'Úvod', text: 'Zvládneš JIZ50 se správnou výživou?', durationSec: 3 },
        { time: '3-8s', content: 'Gameplay ukážka', text: '50 km... 7 stanic...', durationSec: 5 },
        { time: '8-12s', content: 'Napínavý moment', text: 'Energie klesá! 🔋', durationSec: 4 },
        { time: '12-16s', content: 'Výsledok', text: `${score} správnych! ${rating}`, durationSec: 4 },
        { time: '16-20s', content: 'Výzva', text: 'PŘEKONEJ MĚ! 🏆', durationSec: 4 },
      ],
    },
    'howto': {
      title: 'How To Play',
      duration: '30s',
      durationSec: 30,
      frames: [
        { time: '0-5s', content: 'Intro', text: 'Jak hrát FUEL THE RACE?', durationSec: 5 },
        { time: '5-10s', content: 'Ovládanie', text: '← → Změna dráhy | SPACE Odraz', durationSec: 5 },
        { time: '10-15s', content: 'Stanice', text: '7 stanic = 7 rozhodnutí', durationSec: 5 },
        { time: '15-20s', content: 'Produkty', text: 'PRE SPORT → GEL → ISOTONIC', durationSec: 5 },
        { time: '20-25s', content: 'Tip', text: 'KOFEIN v půlce závodu! ⚡', durationSec: 5 },
        { time: '25-30s', content: 'CTA', text: 'Nauč se to hrou! Link v bio', durationSec: 5 },
      ],
    },
  };

  // Generate video using pure Canvas + MediaRecorder (no html2canvas - avoids lab() color issues)
  const generateVideo = useCallback(async () => {
    if (isGeneratingVideo) return;

    setIsGeneratingVideo(true);
    setVideoProgress(0);
    setVideoStatus('Generuji video...');

    try {
      const scenario = reelsScenarios[activeReels];
      const frames = scenario.frames;

      // Video dimensions (9:16 ratio for Reels)
      const width = 1080;
      const height = 1920;
      const fps = 30;

      setVideoStatus('Připravuji canvas...');
      setVideoProgress(5);

      // Create video canvas
      const videoCanvas = document.createElement('canvas');
      videoCanvas.width = width;
      videoCanvas.height = height;
      const ctx = videoCanvas.getContext('2d')!;

      // Load font before rendering
      try {
        await document.fonts.load('20px "Press Start 2P"');
      } catch {
        console.log('Font already loaded or not available');
      }

      setVideoStatus('Spouštím nahrávání...');
      setVideoProgress(10);

      // Setup MediaRecorder with WebM format (best browser support)
      const stream = videoCanvas.captureStream(fps);

      // Try VP9 first, fall back to VP8 if not supported
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5000000, // 5 Mbps for good quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // Promise to wait for recording to finish
      const recordingComplete = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
      });

      // Start recording
      mediaRecorder.start();

      // Calculate total duration and frame data
      const totalDuration = frames.reduce((sum, f) => sum + f.durationSec, 0);
      let currentFrameIndex = 0;
      let elapsedInFrame = 0;
      let totalElapsed = 0;

      // Draw frames with proper timing
      const drawNextFrame = () => {
        if (currentFrameIndex >= frames.length) {
          setTimeout(() => mediaRecorder.stop(), 100);
          return;
        }

        // Draw current frame using pure canvas rendering
        drawFrameToCanvas(ctx, activeReels, currentFrameIndex, score, rating, width, height);

        elapsedInFrame += 1 / fps;
        totalElapsed += 1 / fps;

        // Update progress
        const progress = 10 + (totalElapsed / totalDuration) * 85;
        setVideoProgress(Math.min(95, progress));
        setVideoStatus(`Nahrávám: ${Math.round(totalElapsed)}s / ${totalDuration}s`);

        // Check if we need to move to next frame
        if (elapsedInFrame >= frames[currentFrameIndex].durationSec) {
          currentFrameIndex++;
          elapsedInFrame = 0;
        }

        // Continue drawing
        if (currentFrameIndex < frames.length) {
          requestAnimationFrame(drawNextFrame);
        } else {
          setTimeout(() => mediaRecorder.stop(), 100);
        }
      };

      // Start drawing frames
      requestAnimationFrame(drawNextFrame);

      // Wait for recording to complete
      const videoBlob = await recordingComplete;

      setVideoStatus('Finalizujem...');
      setVideoProgress(98);

      // Create download link
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fuel-the-race-${activeReels}-${scenario.duration}.webm`;
      link.click();

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setVideoStatus('Hotovo! Video stažené.');
      setVideoProgress(100);

      setTimeout(() => {
        setIsGeneratingVideo(false);
        setVideoProgress(0);
        setVideoStatus('');
      }, 2000);

    } catch (error) {
      console.error('Video generation error:', error);
      setVideoStatus(`Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
      setVideoProgress(0);
      setTimeout(() => {
        setIsGeneratingVideo(false);
        setVideoStatus('');
      }, 3000);
    }
  }, [activeReels, score, rating, isGeneratingVideo, reelsScenarios]);

  const getFilename = () => {
    const names: Record<PromoVariant, string> = {
      'story-play': 'fuel-the-race-story-zahraj-si',
      'story-challenge': `fuel-the-race-story-vyzva-${score.replace('/', '-')}`,
      'post-launch': 'fuel-the-race-post-launch',
      'post-edu': 'fuel-the-race-post-edukativny',
    };
    return names[activeVariant];
  };

  const getDimensions = () => {
    if (activeVariant.startsWith('story')) {
      return { width: 1080, height: 1920 };
    }
    return { width: 1080, height: 1080 };
  };

  // Download image using pure Canvas rendering (no html2canvas - avoids lab() color issues)
  const downloadImage = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const { width, height } = getDimensions();

      // Load font first
      try {
        await document.fonts.load('20px "Press Start 2P"');
      } catch {
        console.log('Font already loaded');
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Draw using pure canvas based on variant
      if (activeVariant.startsWith('story')) {
        drawStoryToCanvas(ctx, activeVariant, score, rating, width, height);
      } else {
        drawPostToCanvas(ctx, activeVariant, width, height);
      }

      const link = document.createElement('a');
      link.download = `${getFilename()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Stažení selhalo: ' + (error instanceof Error ? error.message : 'Neznámá chyba'));
    } finally {
      setIsDownloading(false);
    }
  }, [activeVariant, score, rating, isDownloading]);

  // Download Reels frame using pure Canvas rendering
  const downloadReelsFrame = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const width = 1080;
      const height = 1920;

      // Load font first
      try {
        await document.fonts.load('20px "Press Start 2P"');
      } catch {
        console.log('Font already loaded');
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Draw using pure canvas
      drawFrameToCanvas(ctx, activeReels, activeReelsFrame, score, rating, width, height);

      const link = document.createElement('a');
      link.download = `fuel-the-race-reels-${activeReels}-frame-${activeReelsFrame + 1}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Stažení selhalo: ' + (error instanceof Error ? error.message : 'Neznámá chyba'));
    } finally {
      setIsDownloading(false);
    }
  }, [activeReels, activeReelsFrame, score, rating, isDownloading]);

  const copyCaption = useCallback(() => {
    const captions: Record<PromoVariant, string> = {
      'story-play': `🎿 FUEL THE RACE 🎮

Nová retro hra od @enervit_cz × JIZ50!

⚡ Zvládni 50 km se správnou výživou
🎯 7 stanic, 7 rozhodnutí
🏆 Nauč se, kdy použít jaký produkt

BONUS: Ulož skóre a získej -15% slevu! 🎁

#FuelTheRace #Enervit #JIZ50`,
      'story-challenge': `⚡ MŮJ VÝSLEDEK: ${score} ⚡

Překonej mě ve FUEL THE RACE! 🏆

👉 jiz50.enervit.online

#FuelTheRace #Enervit #JIZ50`,
      'post-launch': `🎮 ZAHRAJ SI: FUEL THE RACE

Virtuální JIZ50, kde vybíráš správnou výživu na každé stanici!

✅ Naučíš se, kdy použít PRE SPORT, GEL, ISOTONIC...
✅ Zjistíš, proč je důležité správné načasování
✅ Získáš -15% slevu na nákup

Kolik správných voleb zvládneš ty? 🏆

👉 Link v bio

#FuelTheRace #Enervit #JIZ50 #RetroGame`,
      'post-edu': `🤔 VÍTE, ŽE...?

Na JIZ50 potřebuješ doplnit energii minimálně 7× během závodu!

📍 KM 0 → PRE SPORT
📍 KM 8 → ISOTONIC
📍 KM 16 → GEL
📍 KM 25 → KOFEIN
📍 ...

Nauč se to hrou! 🎮

👉 Link v bio

#FuelTheRace #SportovniVyziva #Enervit`,
    };

    navigator.clipboard.writeText(captions[activeVariant]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeVariant, score]);

  const copyReelsCaption = useCallback(() => {
    const captions: Record<ReelsVariant, string> = {
      'teaser': `🎿 FUEL THE RACE 🎮

Nová retro hra kde se naučíš správnou výživu pro JIZ50!

⚡ 50 km závod
🎯 7 výživových stanic
🏆 Vyber správně a dojeď do cíle!

Link v bio 👆

#FuelTheRace #Enervit #JIZ50 #RetroGame #Gaming`,
      'challenge': `⚡ VÝZVA: Kolik správnych voleb zvládneš? ⚡

Můj výsledek: ${score} 🏆

Překonal jsem hru FUEL THE RACE - virtuální JIZ50!

Zkus to i ty 👉 Link v bio

#FuelTheRace #Challenge #Enervit #JIZ50`,
      'howto': `🎮 Ako hrať FUEL THE RACE?

1️⃣ Vyber správnou výživu na každé stanici
2️⃣ Vyhni se soupeřům na trati
3️⃣ Dojeď do cíle s energiou!

✅ PRE SPORT pred štartom
✅ GEL počas závodu
✅ ISOTONIC na hydratáciu
✅ KOFEIN v polovici

Link v bio 👆

#FuelTheRace #HowTo #Enervit #SportovniVyziva`,
    };

    navigator.clipboard.writeText(captions[activeReels]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeReels, score]);

  const dimensions = getDimensions();

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-mono text-white mb-2 text-center">
          FUEL THE RACE - Promo Generátor
        </h1>
        <p className="text-gray-400 text-center mb-6 font-mono text-sm">
          Vytvoř grafiky a videa pro sociální sítě
        </p>

        {/* Tab selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`px-6 py-3 font-mono text-sm rounded-t-lg transition-colors ${
              activeTab === 'graphics'
                ? 'bg-gray-800 text-white border-t-2 border-x-2 border-red-500'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            📷 Grafiky
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-6 py-3 font-mono text-sm rounded-t-lg transition-colors ${
              activeTab === 'reels'
                ? 'bg-gray-800 text-white border-t-2 border-x-2 border-red-500'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            🎬 Reels / TikTok
          </button>
        </div>

        {activeTab === 'graphics' ? (
          <>
            {/* Graphics section */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'story-play' as const, label: 'Story: Zahraj si' },
                { id: 'story-challenge' as const, label: 'Story: Výzva' },
                { id: 'post-launch' as const, label: 'Post: Launch' },
                { id: 'post-edu' as const, label: 'Post: Edukatívny' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v.id)}
                  className={`px-4 py-2 font-mono text-xs rounded transition-colors ${
                    activeVariant === v.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {activeVariant === 'story-challenge' && (
              <div className="flex justify-center gap-4 mb-8">
                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">Skóre:</label>
                  <input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded font-mono text-sm w-20"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">Hodnocení:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded font-mono text-sm"
                  >
                    <option value="PROFESIONÁL">PROFESIONÁL</option>
                    <option value="POKROČILÝ">POKROČILÝ</option>
                    <option value="ZAČÁTEČNÍK">ZAČÁTEČNÍK</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              <div className="flex flex-col items-center">
                <div ref={previewRef}>
                  {activeVariant.startsWith('story') ? (
                    <StoryPreview variant={activeVariant} score={score} rating={rating} />
                  ) : (
                    <PostPreview variant={activeVariant} />
                  )}
                </div>

                <button
                  onClick={downloadImage}
                  disabled={isDownloading}
                  className={`mt-4 w-full max-w-[270px] lg:max-w-[320px] py-3 font-mono rounded transition-colors flex items-center justify-center gap-2 ${
                    isDownloading
                      ? 'bg-gray-600 text-gray-400 cursor-wait'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Generujem...
                    </>
                  ) : (
                    <>
                      📥 STÁHNOUT PNG ({dimensions.width}×{dimensions.height})
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-white font-mono text-lg mb-4">
                  {activeVariant === 'story-play' && 'Instagram/Facebook Story - Zahraj si'}
                  {activeVariant === 'story-challenge' && 'Instagram/Facebook Story - Výzva'}
                  {activeVariant === 'post-launch' && 'Instagram/Facebook Post - Launch'}
                  {activeVariant === 'post-edu' && 'Instagram/Facebook Post - Edukatívny'}
                </h3>

                <div className="text-gray-400 text-sm font-mono space-y-2 mb-6">
                  <p><span className="text-gray-500">Rozmer:</span> {dimensions.width} × {dimensions.height} px</p>
                  <p><span className="text-gray-500">Formát:</span> PNG</p>
                  <p><span className="text-gray-500">Použitie:</span> {activeVariant.startsWith('story') ? 'Stories, Reels' : 'Feed, Carousel'}</p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-gray-400 font-mono text-xs mb-3">📝 POPIS PRE POST:</h4>
                  <div className="bg-gray-900 rounded p-3 text-xs text-gray-300 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {activeVariant === 'story-play' && `🎿 FUEL THE RACE 🎮

Nová retro hra od @enervit_cz × JIZ50!

⚡ Zvládni 50 km se správnou výživou
🎯 7 stanic, 7 rozhodnutí
🏆 Nauč se, kdy použít jaký produkt

BONUS: Ulož skóre a získej -15% slevu! 🎁

#FuelTheRace #Enervit #JIZ50`}
                    {activeVariant === 'story-challenge' && `⚡ MŮJ VÝSLEDEK: ${score} ⚡

Překonej mě ve FUEL THE RACE! 🏆

👉 jiz50.enervit.online

#FuelTheRace #Enervit #JIZ50`}
                    {activeVariant === 'post-launch' && `🎮 ZAHRAJ SI: FUEL THE RACE

Virtuální JIZ50, kde vybíráš správnou výživu na každé stanici!

✅ Naučíš se, kdy použít PRE SPORT, GEL, ISOTONIC...
✅ Zjistíš, proč je důležité správné načasování
✅ Získáš -15% slevu na nákup

Kolik správných voleb zvládneš ty? 🏆

👉 Link v bio

#FuelTheRace #Enervit #JIZ50 #RetroGame`}
                    {activeVariant === 'post-edu' && `🤔 VÍTE, ŽE...?

Na JIZ50 potřebuješ doplnit energii minimálně 7× během závodu!

📍 KM 0 → PRE SPORT
📍 KM 8 → ISOTONIC
📍 KM 16 → GEL
📍 KM 25 → KOFEIN
📍 ...

Nauč se to hrou! 🎮

👉 Link v bio

#FuelTheRace #SportovniVyziva #Enervit`}
                  </div>
                  <button
                    onClick={copyCaption}
                    className={`mt-3 w-full py-2 font-mono text-sm rounded transition-colors ${
                      copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {copied ? '✓ ZKOPÍROVÁNO!' : '📋 KOPÍROVAT POPIS'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Reels section */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'teaser' as const, label: '🎬 Teaser (15s)' },
                { id: 'challenge' as const, label: '🏆 Challenge (20s)' },
                { id: 'howto' as const, label: '📚 How To (30s)' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setActiveReels(v.id); setActiveReelsFrame(0); }}
                  className={`px-4 py-2 font-mono text-xs rounded transition-colors ${
                    activeReels === v.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {activeReels === 'challenge' && (
              <div className="flex justify-center gap-4 mb-8">
                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">Skóre:</label>
                  <input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded font-mono text-sm w-20"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">Hodnocení:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded font-mono text-sm"
                  >
                    <option value="PROFESIONÁL">PROFESIONÁL</option>
                    <option value="POKROČILÝ">POKROČILÝ</option>
                    <option value="ZAČÁTEČNÍK">ZAČÁTEČNÍK</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              {/* Reels preview */}
              <div className="flex flex-col items-center">
                <div ref={reelsFrameRef}>
                  <ReelsFramePreview
                    variant={activeReels}
                    frameIndex={activeReelsFrame}
                    score={score}
                    rating={rating}
                  />
                </div>

                {/* Frame selector */}
                <div className="flex gap-1 mt-4 flex-wrap justify-center max-w-[270px]">
                  {reelsScenarios[activeReels].frames.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReelsFrame(i)}
                      className={`w-8 h-8 font-mono text-xs rounded transition-colors ${
                        activeReelsFrame === i
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Download buttons */}
                <div className="mt-4 space-y-2 w-full max-w-[270px]">
                  <button
                    onClick={downloadReelsFrame}
                    disabled={isDownloading}
                    className={`w-full py-3 font-mono text-sm rounded transition-colors flex items-center justify-center gap-2 ${
                      isDownloading
                        ? 'bg-gray-600 text-gray-400 cursor-wait'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {isDownloading ? '⏳ Generuji...' : `📥 STÁHNOUT FRAME ${activeReelsFrame + 1}`}
                  </button>

                  {/* Video generation button */}
                  <button
                    onClick={generateVideo}
                    disabled={isGeneratingVideo}
                    className={`w-full py-3 font-mono text-sm rounded transition-colors flex items-center justify-center gap-2 ${
                      isGeneratingVideo
                        ? 'bg-gray-600 text-gray-400 cursor-wait'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isGeneratingVideo ? '⏳' : '🎬'} STÁHNOUT VIDEO ({reelsScenarios[activeReels].duration})
                  </button>

                  {/* Progress bar */}
                  {isGeneratingVideo && (
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <p className="text-gray-400 text-xs font-mono text-center mt-1">
                        {videoStatus}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reels info */}
              <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-white font-mono text-lg">{reelsScenarios[activeReels].title}</h3>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-mono">
                    {reelsScenarios[activeReels].duration}
                  </span>
                </div>

                <div className="text-gray-400 text-sm font-mono mb-4">
                  <p><span className="text-gray-500">Rozmer:</span> 1080 × 1920 px (9:16)</p>
                  <p><span className="text-gray-500">Platforma:</span> Instagram Reels, TikTok, YouTube Shorts</p>
                </div>

                {/* Scenario timeline */}
                <div className="border-t border-gray-700 pt-4 mb-4">
                  <h4 className="text-gray-400 font-mono text-xs mb-3">📋 SCENÁR:</h4>
                  <div className="space-y-2">
                    {reelsScenarios[activeReels].frames.map((frame, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveReelsFrame(i)}
                        className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${
                          activeReelsFrame === i ? 'bg-red-900/30 border border-red-500/50' : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <span className={`font-mono text-xs px-2 py-1 rounded ${
                          activeReelsFrame === i ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {frame.time}
                        </span>
                        <div className="flex-1">
                          <p className="text-white text-sm font-mono">{frame.content}</p>
                          {frame.text && (
                            <p className="text-gray-400 text-xs mt-1">"{frame.text}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mb-4">
                  <h4 className="text-green-400 font-mono text-xs mb-2">🎬 VIDEO GENERÁTOR:</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Klikni "STÁHNOUT VIDEO" pro hotové WebM</li>
                    <li>• Video obsahuje všechny snímky ve správném pořadí</li>
                    <li>• Rozlišení: 1080×1920 (optimální pro Reels)</li>
                    <li>• Přidej hudbu v CapCut/InShot</li>
                  </ul>
                </div>

                {/* Caption */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-gray-400 font-mono text-xs mb-3">📝 POPIS PRE REELS:</h4>
                  <div className="bg-gray-900 rounded p-3 text-xs text-gray-300 font-mono max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {activeReels === 'teaser' && `🎿 FUEL THE RACE 🎮

Nová retro hra kde se naučíš správnou výživu pro JIZ50!

⚡ 50 km závod
🎯 7 výživových stanic
🏆 Vyber správně a dojeď do cíle!

Link v bio 👆

#FuelTheRace #Enervit #JIZ50 #RetroGame #Gaming`}
                    {activeReels === 'challenge' && `⚡ VÝZVA: Kolik správnych voleb zvládneš? ⚡

Můj výsledek: ${score} 🏆

Překonal jsem hru FUEL THE RACE - virtuální JIZ50!

Zkus to i ty 👉 Link v bio

#FuelTheRace #Challenge #Enervit #JIZ50`}
                    {activeReels === 'howto' && `🎮 Ako hrať FUEL THE RACE?

1️⃣ Vyber správnou výživu na každé stanici
2️⃣ Vyhni se soupeřům na trati
3️⃣ Dojeď do cíle s energiou!

✅ PRE SPORT pred štartom
✅ GEL počas závodu
✅ ISOTONIC na hydratáciu
✅ KOFEIN v polovici

Link v bio 👆

#FuelTheRace #HowTo #Enervit #SportovniVyziva`}
                  </div>
                  <button
                    onClick={copyReelsCaption}
                    className={`mt-3 w-full py-2 font-mono text-sm rounded transition-colors ${
                      copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {copied ? '✓ ZKOPÍROVÁNO!' : '📋 KOPÍROVAT POPIS'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-xs font-mono">
          <p>Grafiky a videa jsou optimalizované pro Instagram, Facebook a TikTok.</p>
          <p className="mt-1">Hra: <a href="/" className="text-red-400 hover:underline">jiz50.enervit.online</a></p>
        </div>
      </div>
    </div>
  );
}

// Reels Frame for Video Generation (standalone component for rendering)
function ReelsFrameForVideo({ variant, frameIndex, score, rating }: { variant: ReelsVariant; frameIndex: number; score: string; rating: string }) {
  return (
    <div
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(to bottom, #1e3a5f, #1e40af, #1e3a5f)',
        fontFamily: "'Press Start 2P', monospace",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ReelsFrameContent variant={variant} frameIndex={frameIndex} score={score} rating={rating} />
    </div>
  );
}

// Shared frame content
function ReelsFrameContent({ variant, frameIndex, score, rating }: { variant: ReelsVariant; frameIndex: number; score: string; rating: string }) {
  const frames: Record<ReelsVariant, React.ReactNode[]> = {
    'teaser': [
      // Frame 1: Logo
      <div key="t1" className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-4 py-2 rounded" style={{ background: ENERVIT_RED }}>
            <span className="text-white font-bold text-sm">ENERVIT</span>
          </div>
          <span className="text-white text-2xl">×</span>
          <div className="px-3 py-2 rounded" style={{ background: JIZ_BLUE }}>
            <span className="text-yellow-300 font-bold text-sm">JIZ</span>
            <span className="text-white font-bold text-sm">50</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs">PRESENTS</p>
      </div>,
      // Frame 2: Title
      <div key="t2" className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4" style={{ color: ENERVIT_RED, textShadow: `0 0 20px ${ENERVIT_RED}` }}>
          FUEL THE RACE
        </h1>
        <div className="relative w-20 h-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-3 rounded-t-full" style={{ background: ENERVIT_RED }} />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-100 rounded-full" />
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-7 rounded" style={{ background: ENERVIT_RED }} />
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-5 bg-blue-900 rounded-b" />
          <div className="absolute top-[76px] left-1/2 -translate-x-1/2 w-16 h-2 rounded-full" style={{ background: ENERVIT_RED }} />
        </div>
      </div>,
      // Frame 3: Product selection
      <div key="t3" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-6">KM 8 - OBČERSTVENÍ</p>
        <div className="space-y-3 w-full">
          {['ISOTONIC', 'GEL', 'PROTEIN BAR'].map((p, i) => (
            <div key={p} className={`p-3 rounded border-2 ${i === 0 ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800/50'}`}>
              <span className="text-white text-sm">ENERVIT {p}</span>
            </div>
          ))}
        </div>
        <p className="text-white text-xs mt-4">Vyber správnou výživu!</p>
      </div>,
      // Frame 4: Correct choice
      <div key="t4" className="flex flex-col items-center justify-center h-full">
        <div className="text-6xl mb-4">✓</div>
        <p className="text-green-400 text-2xl font-bold mb-2">SPRÁVNĚ!</p>
        <p className="text-white text-lg">+25 ENERGIE</p>
        <div className="mt-4 w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '85%' }} />
        </div>
      </div>,
      // Frame 5: CTA
      <div key="t5" className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-white mb-6">ZAHRAJ SI TEĎ!</h2>
        <div className="px-6 py-3 rounded-lg" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRAŤ</span>
        </div>
        <p className="text-yellow-400 text-sm mt-6">🎁 -15% na enervit.cz</p>
        <p className="text-gray-400 text-xs mt-4">jiz50.enervit.online</p>
      </div>,
    ],
    'challenge': [
      // Frame 1: Challenge intro
      <div key="c1" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-2xl mb-4">⚡ VÝZVA ⚡</p>
        <h2 className="text-white text-xl text-center leading-relaxed">
          Zvládneš JIZ50<br/>se správnou výživou?
        </h2>
      </div>,
      // Frame 2: Gameplay
      <div key="c2" className="flex flex-col items-center justify-center h-full">
        <div className="text-4xl mb-4">🎿</div>
        <p className="text-white text-lg mb-2">50 km závod</p>
        <p className="text-gray-400">7 výživových stanic</p>
        <div className="mt-6 flex gap-2">
          {[0, 8, 16, 25, 33, 42, 50].map((km) => (
            <div key={km} className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-[8px] text-gray-400">{km}</span>
            </div>
          ))}
        </div>
      </div>,
      // Frame 3: Tension
      <div key="c3" className="flex flex-col items-center justify-center h-full">
        <p className="text-red-400 text-lg mb-4">⚠️ ENERGIE KLESÁ!</p>
        <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 animate-pulse" style={{ width: '25%' }} />
        </div>
        <p className="text-white text-2xl font-bold">KM 42</p>
        <p className="text-gray-400 text-sm">Posledná stanica!</p>
      </div>,
      // Frame 4: Result
      <div key="c4" className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 text-sm mb-2">MŮJ VÝSLEDEK:</p>
        <p className="text-green-400 text-5xl font-bold mb-2">{score}</p>
        <p className="text-yellow-400 text-xl">{rating}</p>
        <div className="text-4xl mt-4">🏆</div>
      </div>,
      // Frame 5: Challenge CTA
      <div key="c5" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-2xl font-bold mb-6">PŘEKONEJ MĚ!</p>
        <div className="px-6 py-3 rounded-lg mb-4" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRÁT</span>
        </div>
        <p className="text-gray-400 text-sm">Link v bio 👆</p>
      </div>,
    ],
    'howto': [
      // Frame 1: Intro
      <div key="h1" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-2xl mb-4">🎮 JAK HRÁT?</p>
        <h2 className="text-xl font-bold" style={{ color: ENERVIT_RED }}>FUEL THE RACE</h2>
      </div>,
      // Frame 2: Controls
      <div key="h2" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-6">OVLÁDÁNÍ</p>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gray-700 px-3 py-1 rounded text-white">←</span>
            <span className="bg-gray-700 px-3 py-1 rounded text-white">→</span>
            <span className="text-gray-400 text-sm ml-2">Změna dráhy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gray-700 px-4 py-1 rounded text-white">SPACE</span>
            <span className="text-gray-400 text-sm ml-2">Odraz</span>
          </div>
        </div>
      </div>,
      // Frame 3: Stations
      <div key="h3" className="flex flex-col items-center justify-center h-full">
        <p className="text-yellow-400 text-lg mb-4">7 STANIC</p>
        <p className="text-white text-xl mb-4">= 7 ROZHODNUTÍ</p>
        <div className="grid grid-cols-7 gap-1">
          {[0, 8, 16, 25, 33, 42, 50].map((km) => (
            <div key={km} className="w-8 h-8 rounded" style={{ background: ENERVIT_RED }}>
              <span className="text-white text-[10px] flex items-center justify-center h-full">{km}</span>
            </div>
          ))}
        </div>
      </div>,
      // Frame 4: Products
      <div key="h4" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-4">PRODUKTY</p>
        <div className="space-y-2 text-sm">
          <p className="text-green-400">✓ PRE SPORT - před startem</p>
          <p className="text-blue-400">✓ ISOTONIC - hydratace</p>
          <p className="text-orange-400">✓ GEL - rychlá energie</p>
          <p className="text-yellow-400">✓ KOFEIN - boost!</p>
        </div>
      </div>,
      // Frame 5: Tip
      <div key="h5" className="flex flex-col items-center justify-center h-full">
        <p className="text-yellow-400 text-lg mb-4">💡 TIP</p>
        <p className="text-white text-xl text-center px-4">
          KOFEIN v půlce<br/>závodu = BOOST!
        </p>
        <div className="text-4xl mt-4">⚡</div>
      </div>,
      // Frame 6: CTA
      <div key="h6" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-xl mb-4">Nauč se to hrou!</p>
        <div className="px-6 py-3 rounded-lg mb-4" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRÁT</span>
        </div>
        <p className="text-yellow-400 text-sm">🎁 -15% na enervit.cz</p>
        <p className="text-gray-400 text-xs mt-2">Link v bio 👆</p>
      </div>,
    ],
  };

  return <>{frames[variant][frameIndex] || frames[variant][0]}</>;
}

// Reels Frame Preview Component
function ReelsFramePreview({ variant, frameIndex, score, rating }: { variant: ReelsVariant; frameIndex: number; score: string; rating: string }) {
  const frames: Record<ReelsVariant, React.ReactNode[]> = {
    'teaser': [
      // Frame 1: Logo
      <div key="t1" className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-4 py-2 rounded" style={{ background: ENERVIT_RED }}>
            <span className="text-white font-bold text-sm">ENERVIT</span>
          </div>
          <span className="text-white text-2xl">×</span>
          <div className="px-3 py-2 rounded" style={{ background: JIZ_BLUE }}>
            <span className="text-yellow-300 font-bold text-sm">JIZ</span>
            <span className="text-white font-bold text-sm">50</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs">PRESENTS</p>
      </div>,
      // Frame 2: Title
      <div key="t2" className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4" style={{ color: ENERVIT_RED, textShadow: `0 0 20px ${ENERVIT_RED}` }}>
          FUEL THE RACE
        </h1>
        <div className="relative w-20 h-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-3 rounded-t-full" style={{ background: ENERVIT_RED }} />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-100 rounded-full" />
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-7 rounded" style={{ background: ENERVIT_RED }} />
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-5 bg-blue-900 rounded-b" />
          <div className="absolute top-[76px] left-1/2 -translate-x-1/2 w-16 h-2 rounded-full" style={{ background: ENERVIT_RED }} />
        </div>
      </div>,
      // Frame 3: Product selection
      <div key="t3" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-6">KM 8 - OBČERSTVENÍ</p>
        <div className="space-y-3 w-full">
          {['ISOTONIC', 'GEL', 'PROTEIN BAR'].map((p, i) => (
            <div key={p} className={`p-3 rounded border-2 ${i === 0 ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800/50'}`}>
              <span className="text-white text-sm">ENERVIT {p}</span>
            </div>
          ))}
        </div>
        <p className="text-white text-xs mt-4">Vyber správnou výživu!</p>
      </div>,
      // Frame 4: Correct choice
      <div key="t4" className="flex flex-col items-center justify-center h-full">
        <div className="text-6xl mb-4">✓</div>
        <p className="text-green-400 text-2xl font-bold mb-2">SPRÁVNĚ!</p>
        <p className="text-white text-lg">+25 ENERGIE</p>
        <div className="mt-4 w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '85%' }} />
        </div>
      </div>,
      // Frame 5: CTA
      <div key="t5" className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-white mb-6">ZAHRAJ SI TEĎ!</h2>
        <div className="px-6 py-3 rounded-lg" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRAŤ</span>
        </div>
        <p className="text-yellow-400 text-sm mt-6">🎁 -15% na enervit.cz</p>
        <p className="text-gray-400 text-xs mt-4">jiz50.enervit.online</p>
      </div>,
    ],
    'challenge': [
      // Frame 1: Challenge intro
      <div key="c1" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-2xl mb-4">⚡ VÝZVA ⚡</p>
        <h2 className="text-white text-xl text-center leading-relaxed">
          Zvládneš JIZ50<br/>se správnou výživou?
        </h2>
      </div>,
      // Frame 2: Gameplay
      <div key="c2" className="flex flex-col items-center justify-center h-full">
        <div className="text-4xl mb-4">🎿</div>
        <p className="text-white text-lg mb-2">50 km závod</p>
        <p className="text-gray-400">7 výživových stanic</p>
        <div className="mt-6 flex gap-2">
          {[0, 8, 16, 25, 33, 42, 50].map((km) => (
            <div key={km} className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-[8px] text-gray-400">{km}</span>
            </div>
          ))}
        </div>
      </div>,
      // Frame 3: Tension
      <div key="c3" className="flex flex-col items-center justify-center h-full">
        <p className="text-red-400 text-lg mb-4">⚠️ ENERGIE KLESÁ!</p>
        <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 animate-pulse" style={{ width: '25%' }} />
        </div>
        <p className="text-white text-2xl font-bold">KM 42</p>
        <p className="text-gray-400 text-sm">Posledná stanica!</p>
      </div>,
      // Frame 4: Result
      <div key="c4" className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 text-sm mb-2">MŮJ VÝSLEDEK:</p>
        <p className="text-green-400 text-5xl font-bold mb-2">{score}</p>
        <p className="text-yellow-400 text-xl">{rating}</p>
        <div className="text-4xl mt-4">🏆</div>
      </div>,
      // Frame 5: Challenge CTA
      <div key="c5" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-2xl font-bold mb-6">PŘEKONEJ MĚ!</p>
        <div className="px-6 py-3 rounded-lg mb-4" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRÁT</span>
        </div>
        <p className="text-gray-400 text-sm">Link v bio 👆</p>
      </div>,
    ],
    'howto': [
      // Frame 1: Intro
      <div key="h1" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-2xl mb-4">🎮 JAK HRÁT?</p>
        <h2 className="text-xl font-bold" style={{ color: ENERVIT_RED }}>FUEL THE RACE</h2>
      </div>,
      // Frame 2: Controls
      <div key="h2" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-6">OVLÁDÁNÍ</p>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gray-700 px-3 py-1 rounded text-white">←</span>
            <span className="bg-gray-700 px-3 py-1 rounded text-white">→</span>
            <span className="text-gray-400 text-sm ml-2">Změna dráhy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gray-700 px-4 py-1 rounded text-white">SPACE</span>
            <span className="text-gray-400 text-sm ml-2">Odraz</span>
          </div>
        </div>
      </div>,
      // Frame 3: Stations
      <div key="h3" className="flex flex-col items-center justify-center h-full">
        <p className="text-yellow-400 text-lg mb-4">7 STANIC</p>
        <p className="text-white text-xl mb-4">= 7 ROZHODNUTÍ</p>
        <div className="grid grid-cols-7 gap-1">
          {[0, 8, 16, 25, 33, 42, 50].map((km) => (
            <div key={km} className="w-8 h-8 rounded" style={{ background: ENERVIT_RED }}>
              <span className="text-white text-[10px] flex items-center justify-center h-full">{km}</span>
            </div>
          ))}
        </div>
      </div>,
      // Frame 4: Products
      <div key="h4" className="flex flex-col items-center justify-center h-full px-4">
        <p className="text-yellow-400 text-lg mb-4">PRODUKTY</p>
        <div className="space-y-2 text-sm">
          <p className="text-green-400">✓ PRE SPORT - před startem</p>
          <p className="text-blue-400">✓ ISOTONIC - hydratace</p>
          <p className="text-orange-400">✓ GEL - rychlá energie</p>
          <p className="text-yellow-400">✓ KOFEIN - boost!</p>
        </div>
      </div>,
      // Frame 5: Tip
      <div key="h5" className="flex flex-col items-center justify-center h-full">
        <p className="text-yellow-400 text-lg mb-4">💡 TIP</p>
        <p className="text-white text-xl text-center px-4">
          KOFEIN v půlce<br/>závodu = BOOST!
        </p>
        <div className="text-4xl mt-4">⚡</div>
      </div>,
      // Frame 6: CTA
      <div key="h6" className="flex flex-col items-center justify-center h-full">
        <p className="text-white text-xl mb-4">Nauč se to hrou!</p>
        <div className="px-6 py-3 rounded-lg mb-4" style={{ background: ENERVIT_RED }}>
          <span className="text-white text-lg font-bold">🎮 HRÁT</span>
        </div>
        <p className="text-yellow-400 text-sm">🎁 -15% na enervit.cz</p>
        <p className="text-gray-400 text-xs mt-2">Link v bio 👆</p>
      </div>,
    ],
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(to bottom, #1e3a5f, #1e40af, #1e3a5f)',
        fontFamily: "'Press Start 2P', monospace"
      }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
        }}
      />

      {/* Frame content */}
      {frames[variant][frameIndex] || frames[variant][0]}

      {/* Frame indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
        {frames[variant].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === frameIndex ? 'bg-white' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}

// Story Preview Component
function StoryPreview({ variant, score, rating }: { variant: PromoVariant; score: string; rating: string }) {
  const isChallenge = variant === 'story-challenge';

  return (
    <div
      className="promo-preview relative overflow-hidden"
      style={{
        width: '270px',
        height: '480px',
        background: 'linear-gradient(to bottom, #1e3a5f, #1e40af, #1e3a5f)',
        fontFamily: "'Press Start 2P', monospace"
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
        }}
      />

      <div className="flex justify-center items-center gap-2 pt-6 pb-4">
        <div className="px-3 py-1.5 rounded" style={{ background: `linear-gradient(180deg, #ff1a3a, ${ENERVIT_RED})`, border: '2px solid #ff5566' }}>
          <span className="text-white font-bold text-[8px]">ENERVIT</span>
        </div>
        <span className="text-gray-400 text-sm">×</span>
        <div className="px-2 py-1.5 rounded" style={{ background: `linear-gradient(180deg, #1a8cff, ${JIZ_BLUE})`, border: '2px solid #4da6ff' }}>
          <span className="text-yellow-300 font-bold text-[7px]">JIZ</span>
          <span className="text-white font-bold text-[7px] ml-0.5">50</span>
        </div>
      </div>

      {isChallenge ? (
        <>
          <div className="text-center py-4">
            <span className="text-yellow-400 text-sm">⚡ VÝZVA ⚡</span>
          </div>
          <p className="text-white text-[8px] text-center px-4">Kolik správných voleb<br/>zvládneš ty?</p>
          <div className="mx-6 mt-6 bg-gray-800/80 border-2 border-gray-600 rounded-lg p-4">
            <p className="text-gray-400 text-[7px] text-center mb-2">MŮJ VÝSLEDEK:</p>
            <p className="text-green-400 text-2xl text-center font-bold">{score} ✓</p>
            <p className="text-yellow-400 text-[8px] text-center mt-2">{rating}</p>
          </div>
          <h1 className="text-center text-lg font-bold mt-8" style={{ color: ENERVIT_RED, textShadow: `0 0 10px ${ENERVIT_RED}` }}>FUEL THE RACE</h1>
          <div className="absolute bottom-20 left-0 right-0 flex justify-center">
            <div className="px-4 py-2 rounded" style={{ background: ENERVIT_RED, border: '2px solid #ff5566' }}>
              <span className="text-white text-[8px] font-bold">🏆 PŘEKONEJ MĚ!</span>
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white text-[10px]">⬆️ SWIPE UP ⬆️</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center mt-4 mb-4">
            <div className="relative w-16 h-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 rounded-t-full" style={{ background: ENERVIT_RED }} />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-100 rounded-full" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-5 h-6 rounded" style={{ background: ENERVIT_RED }} />
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-3 h-4 bg-blue-900 rounded-b" />
              <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full" style={{ background: ENERVIT_RED }} />
              <div className="absolute top-6 left-0.5 w-0.5 h-12 bg-gray-500 rounded-full" />
              <div className="absolute top-6 right-0.5 w-0.5 h-12 bg-gray-500 rounded-full" />
            </div>
          </div>
          <h1 className="text-center text-xl font-bold" style={{ color: ENERVIT_RED, textShadow: `0 0 10px ${ENERVIT_RED}` }}>FUEL THE RACE</h1>
          <div className="flex justify-center"><div className="w-32 h-0.5 bg-white/30 mt-1" /></div>
          <p className="text-white text-[8px] text-center px-6 mt-4">Zvládneš 50 km se<br/>správnou výživou?</p>
          <div className="flex justify-center mt-6">
            <div className="px-4 py-2 rounded" style={{ background: ENERVIT_RED, border: '2px solid #ff5566' }}>
              <span className="text-white text-[8px] font-bold">🎮 ZAHRAJ SI TEĎ</span>
            </div>
          </div>
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <p className="text-white text-[10px]">⬆️ SWIPE UP ⬆️</p>
          </div>
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-yellow-400 text-[7px]">🎁 -15% na enervit.cz</p>
          </div>
        </>
      )}
    </div>
  );
}

// Post Preview Component
function PostPreview({ variant }: { variant: PromoVariant }) {
  const isEdu = variant === 'post-edu';

  return (
    <div
      className="promo-preview relative overflow-hidden"
      style={{
        width: '320px',
        height: '320px',
        background: 'linear-gradient(to bottom, #1e3a5f, #1e40af, #1e3a5f)',
        fontFamily: "'Press Start 2P', monospace"
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
        }}
      />

      {isEdu ? (
        <>
          <div className="text-center pt-4"><span className="text-white text-sm">VÍTE, ŽE...? 🤔</span></div>
          <p className="text-white text-[7px] text-center px-4 mt-2">Na JIZ50 potřebuješ<br/>doplnit energii minimálně<br/>7× během závodu!</p>
          <div className="mx-4 mt-3 bg-gray-800/80 border border-gray-600 rounded p-2 text-[6px]">
            <div className="flex justify-between text-gray-300 border-b border-gray-600 pb-1 mb-1"><span>KM 0</span><span className="text-green-400">→ PRE SPORT</span></div>
            <div className="flex justify-between text-gray-300 border-b border-gray-600 pb-1 mb-1"><span>KM 8</span><span className="text-blue-400">→ ISOTONIC</span></div>
            <div className="flex justify-between text-gray-300 border-b border-gray-600 pb-1 mb-1"><span>KM 16</span><span className="text-orange-400">→ GEL</span></div>
            <div className="flex justify-between text-gray-300"><span>KM 25</span><span className="text-yellow-400">→ KOFEIN</span></div>
            <p className="text-gray-500 text-center mt-1">...</p>
          </div>
          <p className="text-white text-[8px] text-center mt-3">Nauč se to hrou! 🎮</p>
          <div className="absolute bottom-3 left-0 right-0">
            <h1 className="text-center text-sm font-bold" style={{ color: ENERVIT_RED }}>FUEL THE RACE</h1>
            <div className="flex justify-center items-center gap-2 mt-1">
              <span className="text-[6px] px-2 py-0.5 rounded text-white" style={{ background: ENERVIT_RED }}>ENERVIT</span>
              <span className="text-gray-400 text-[8px]">×</span>
              <span className="text-[6px] px-2 py-0.5 rounded text-white" style={{ background: JIZ_BLUE }}>JIZ50</span>
            </div>
            <p className="text-gray-400 text-[6px] text-center mt-1">▶ Link v bio</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center gap-2 pt-4">
            <div className="px-2 py-1 rounded" style={{ background: ENERVIT_RED }}><span className="text-white font-bold text-[7px]">ENERVIT</span></div>
            <span className="text-gray-400 text-xs">×</span>
            <div className="px-2 py-1 rounded" style={{ background: JIZ_BLUE }}><span className="text-yellow-300 font-bold text-[6px]">JIZ</span><span className="text-white font-bold text-[6px]">50</span></div>
          </div>
          <h1 className="text-center text-lg font-bold mt-3" style={{ color: ENERVIT_RED, textShadow: `0 0 8px ${ENERVIT_RED}` }}>FUEL THE RACE</h1>
          <div className="flex justify-center"><div className="w-24 h-0.5 bg-white/30 mt-1" /></div>
          <div className="mx-6 mt-3 bg-gray-800 border-2 border-gray-600 rounded p-2">
            <p className="text-gray-400 text-[7px] text-center">🎮 RETRO GAME</p>
            <div className="h-12 bg-gradient-to-b from-sky-400 to-sky-600 rounded mt-1 relative overflow-hidden">
              <div className="absolute bottom-2 left-2 w-6 h-4 bg-gray-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              <div className="absolute bottom-2 right-4 w-8 h-5 bg-gray-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/80" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-3 rounded" style={{ background: ENERVIT_RED }} />
            </div>
          </div>
          <p className="text-white text-[7px] text-center px-4 mt-2">Zvol správnou výživu<br/>na 7 stanicích a<br/>dojeď do cíle! 🏁</p>
          <p className="text-yellow-400 text-[7px] text-center mt-2">🎁 BONUS: -15% sleva</p>
          <p className="text-gray-400 text-[7px] text-center mt-2">▶ Link v bio</p>
        </>
      )}
    </div>
  );
}
