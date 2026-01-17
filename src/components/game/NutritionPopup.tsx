'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getShuffledProducts } from '@/lib/nutritionData';
import { STATION_NAMES, STATION_PHASES } from '@/lib/constants';
import type { NutritionProduct } from '@/lib/types';

const EXPLANATION_DURATION = 5000; // 5 seconds to read explanation

export function NutritionPopup() {
  const gameState = useGameStore((s) => s.gameState);
  const selectNutrition = useGameStore((s) => s.selectNutrition);

  const [products, setProducts] = useState<NutritionProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NutritionProduct | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const isVisible =
    gameState.phase === 'pre' ||
    gameState.phase === 'station' ||
    gameState.phase === 'finish';

  useEffect(() => {
    if (isVisible) {
      const phase = STATION_PHASES[gameState.currentStation];
      setProducts(getShuffledProducts(phase));
      setSelectedProduct(null);
      setShowExplanation(false);
    }
  }, [isVisible, gameState.currentStation]);

  const handleContinue = useCallback(() => {
    if (!selectedProduct) return;

    selectNutrition(
      selectedProduct.id,
      selectedProduct.name,
      selectedProduct.correct,
      selectedProduct.boost,
      selectedProduct.explanation,
      gameState.currentStation
    );
    setShowExplanation(false);
    setSelectedProduct(null);
  }, [selectedProduct, selectNutrition, gameState.currentStation]);

  const handleSelect = (product: NutritionProduct) => {
    setSelectedProduct(product);
    setShowExplanation(true);

    // Auto-continue after explanation duration
    setTimeout(() => {
      handleContinue();
    }, EXPLANATION_DURATION);
  };

  // Allow tapping to skip explanation
  const handleSkip = () => {
    if (showExplanation && selectedProduct) {
      handleContinue();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-gray-800 border-4 border-orange-500 rounded-lg w-full max-w-lg mx-auto shadow-2xl relative overflow-hidden">

        {/* Station header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 border-b-2 border-orange-700">
          <h2 className="text-white font-mono text-sm md:text-base font-bold text-center drop-shadow-lg">
            {STATION_NAMES[gameState.currentStation]}
          </h2>
        </div>

        {/* Content area */}
        <div className="p-4 md:p-5">

          {/* Explanation overlay */}
          {showExplanation && selectedProduct && (
            <div
              className="absolute inset-0 bg-gray-900/98 flex flex-col z-10 explanation-overlay"
              onClick={handleSkip}
            >
              {/* Timer bar at top */}
              <div className="h-1 bg-gray-700">
                <div
                  className="h-full bg-orange-500 timer-bar"
                  style={{ '--timer-duration': `${EXPLANATION_DURATION}ms` } as React.CSSProperties}
                />
              </div>

              {/* Explanation content */}
              <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-6">
                {/* Result indicator */}
                <div className={`text-2xl md:text-3xl font-bold mb-4 ${
                  selectedProduct.correct ? 'text-green-400 glow-green' : 'text-red-400 glow-red'
                }`}>
                  {selectedProduct.correct ? '✓ SPRÁVNĚ!' : '✗ ŠPATNĚ!'}
                </div>

                {/* Product name */}
                <div className="text-orange-400 font-mono text-sm md:text-base font-bold mb-4 text-center">
                  {selectedProduct.name}
                </div>

                {/* Main explanation */}
                <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 mb-4 max-w-md">
                  <p className="text-white text-sm md:text-base leading-relaxed text-center">
                    {selectedProduct.explanation}
                  </p>
                </div>

                {/* Benefit/tip */}
                <div className="bg-blue-900/50 border border-blue-700 rounded px-4 py-2 mb-4">
                  <p className="text-blue-300 text-xs md:text-sm text-center">
                    💡 {selectedProduct.benefit}
                  </p>
                </div>

                {/* Energy change indicator */}
                <div className={`flex items-center gap-2 text-sm md:text-base font-mono ${
                  selectedProduct.correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  <span>Energie:</span>
                  <span className="font-bold">
                    {selectedProduct.correct ? '+25%' : '-15%'}
                  </span>
                </div>

                {/* Tap to continue hint */}
                <p className="text-gray-500 text-xs mt-4 animate-pulse">
                  Klepni pro pokračování...
                </p>
              </div>
            </div>
          )}

          {/* Selection prompt */}
          <p className="text-gray-300 text-xs md:text-sm mb-4 text-center font-mono">
            Vyber správnou výživu pro tuto fázi závodu:
          </p>

          {/* Product options */}
          <div className="space-y-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => !showExplanation && handleSelect(product)}
                disabled={showExplanation}
                className="product-card w-full p-4 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-left"
              >
                <div className="flex items-start gap-3">
                  {/* Product icon */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded flex items-center justify-center flex-shrink-0 border-2 border-orange-400">
                    <span className="text-white text-lg md:text-xl">🏃</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-orange-400 font-mono font-bold text-sm md:text-base truncate">
                      {product.name}
                    </div>
                    <div className="text-gray-400 text-xs md:text-sm mt-1 line-clamp-2">
                      {product.desc}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Educational hint */}
          <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded p-3">
            <p className="text-gray-400 text-[10px] md:text-xs text-center leading-relaxed">
              🎯 <strong className="text-orange-400">Správná volba</strong> = +25% energie a boost rychlosti<br/>
              ❌ <strong className="text-red-400">Špatná volba</strong> = -15% energie a zpomalení
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
