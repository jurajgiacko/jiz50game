'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getShuffledProducts } from '@/lib/nutritionData';
import { STATION_NAMES, STATION_PHASES } from '@/lib/constants';
import type { NutritionProduct } from '@/lib/types';

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

  const handleSelect = (product: NutritionProduct) => {
    setSelectedProduct(product);
    setShowExplanation(true);

    // After showing explanation, apply the choice
    setTimeout(() => {
      selectNutrition(
        product.id,
        product.name,
        product.correct,
        product.boost,
        product.explanation,
        gameState.currentStation
      );
      setShowExplanation(false);
      setSelectedProduct(null);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-4 border-orange-500 rounded-lg p-4 md:p-6 max-w-md w-full mx-auto shadow-2xl">
        {/* Station name */}
        <div className="text-center mb-4">
          <h2 className="text-orange-500 font-mono text-sm md:text-lg font-bold">
            {STATION_NAMES[gameState.currentStation]}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Vyber správnou výživu:</p>
        </div>

        {/* Explanation overlay */}
        {showExplanation && selectedProduct && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg p-4">
            <div className="text-center">
              <div
                className={`text-xl md:text-2xl font-bold mb-4 ${
                  selectedProduct.correct ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {selectedProduct.correct ? 'SPRÁVNĚ!' : 'ŠPATNĚ!'}
              </div>
              <p className="text-white text-sm md:text-base mb-3">{selectedProduct.explanation}</p>
              <p className="text-gray-400 text-xs md:text-sm italic">{selectedProduct.benefit}</p>
            </div>
          </div>
        )}

        {/* Product options */}
        <div className="space-y-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => !showExplanation && handleSelect(product)}
              disabled={showExplanation}
              className="w-full p-3 md:p-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-600 hover:border-orange-500 rounded-lg transition-all text-left"
            >
              <div className="text-orange-400 font-mono font-bold text-sm md:text-base">
                {product.name}
              </div>
              <div className="text-gray-300 text-xs md:text-sm mt-1">{product.desc}</div>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-[10px] md:text-xs">
            Správná volba = +energie a rychlost
          </p>
        </div>
      </div>
    </div>
  );
}
