'use client';

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput, RetroCheckbox } from '@/components/ui/RetroInput';
import { getPerformanceRating, generateNutritionPlan } from '@/lib/nutritionData';
import { DISCOUNT_CODE, DISCOUNT_PERCENT, ENERVIT_SHOP_URL } from '@/lib/constants';

export function ResultsScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const choices = useGameStore((s) => s.choices);
  const initGame = useGameStore((s) => s.initGame);
  const setPhase = useGameStore((s) => s.setPhase);
  const setUser = useGameStore((s) => s.setUser);
  const user = useGameStore((s) => s.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [raffleConsent, setRaffleConsent] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showNutritionPlan, setShowNutritionPlan] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  if (gameState.phase !== 'results') return null;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const rating = getPerformanceRating(gameState.correctChoices);
  const won = gameState.energy > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save user data
    setUser({ name, email, raffleConsent });

    // TODO: Submit to API
    // For now, just simulate
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setShowLeadForm(false);
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    setShowLeadForm(false);
  };

  const handlePlayAgain = () => {
    initGame();
    setPhase('start');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const text = `Dokončil jsem Jizerskou 50 virtuálně za ${formatTime(gameState.time)}! ${gameState.correctChoices}/7 správných voleb. Zkus to taky!`;
    const url = window.location.href;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const nutritionPlan = generateNutritionPlan(
    choices.map((c) => ({
      stationIndex: c.stationIndex,
      correct: c.correct,
      productName: c.productName,
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-start p-4 overflow-auto">
      {/* Result card */}
      <div className="bg-gray-800 border-4 border-orange-500 rounded-lg p-4 md:p-6 w-full max-w-md mt-4">
        {/* Title */}
        <h1
          className="text-center font-mono text-2xl md:text-3xl font-bold mb-2"
          style={{ color: won ? '#00ff00' : '#ff0000' }}
        >
          {won ? 'CÍLOVÁ ČÁRA!' : 'VYČERPÁNÍ!'}
        </h1>

        {/* Rating */}
        <div className="text-center mb-4">
          <span
            className="font-mono text-lg md:text-xl font-bold"
            style={{ color: rating.color }}
          >
            {rating.title}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-gray-400 text-xs font-mono">ČAS</div>
            <div className="text-yellow-400 text-xl md:text-2xl font-mono font-bold">
              {formatTime(gameState.time)}
            </div>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <div className="text-gray-400 text-xs font-mono">SPRÁVNÉ VOLBY</div>
            <div className="text-green-400 text-xl md:text-2xl font-mono font-bold">
              {gameState.correctChoices}/{gameState.totalStations}
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-sm text-center mb-4">{rating.message}</p>

        {/* Lead capture form */}
        {showLeadForm && !submitted && (
          <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded mb-4">
            <h3 className="text-orange-400 font-mono font-bold text-sm mb-3">
              Ulož si skóre a soutěž o startovné!
            </h3>

            <div className="space-y-3">
              <RetroInput
                label="Jméno"
                value={name}
                onChange={setName}
                placeholder="Tvé jméno"
                required
              />
              <RetroInput
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="email@example.com"
                required
              />
              <RetroCheckbox
                label="Chci soutěžit o startovné na Jizerskou 50 + Enervit balíček"
                checked={raffleConsent}
                onChange={setRaffleConsent}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <RetroButton type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'UKLÁDÁM...' : 'ULOŽIT'}
              </RetroButton>
              <RetroButton type="button" variant="secondary" onClick={handleSkip}>
                PŘESKOČIT
              </RetroButton>
            </div>
          </form>
        )}

        {/* Success message */}
        {submitted && (
          <div className="bg-green-900/50 border border-green-500 p-3 rounded mb-4 text-center">
            <p className="text-green-400 font-mono text-sm">Skóre uloženo!</p>
            {raffleConsent && (
              <p className="text-gray-400 text-xs mt-1">
                Jsi zařazen do slosování o startovné.
              </p>
            )}
          </div>
        )}

        {/* Discount code */}
        {!showLeadForm && (
          <div className="bg-orange-900/50 border border-orange-500 p-4 rounded mb-4">
            <h3 className="text-orange-400 font-mono font-bold text-sm mb-2">
              SLEVOVÝ KÓD {DISCOUNT_PERCENT}%
            </h3>
            <div className="flex items-center gap-2">
              <code className="bg-gray-900 text-white px-3 py-2 font-mono text-lg flex-1 text-center">
                {DISCOUNT_CODE}
              </code>
              <RetroButton size="sm" onClick={handleCopyCode}>
                {codeCopied ? 'OK!' : 'KOPÍROVAT'}
              </RetroButton>
            </div>
            <a
              href={`${ENERVIT_SHOP_URL}?discount=${DISCOUNT_CODE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-orange-400 text-xs mt-2 underline"
            >
              Přejít do e-shopu Enervit
            </a>
          </div>
        )}

        {/* Nutrition plan */}
        {!showLeadForm && (
          <div className="mb-4">
            <button
              onClick={() => setShowNutritionPlan(!showNutritionPlan)}
              className="w-full text-left text-cyan-400 font-mono text-sm underline"
            >
              {showNutritionPlan ? '▼ Skrýt nutriční plán' : '▶ Zobrazit nutriční plán'}
            </button>
            {showNutritionPlan && (
              <div className="bg-gray-700 p-3 rounded mt-2">
                {nutritionPlan.map((tip, i) => (
                  <p key={i} className="text-gray-300 text-xs mb-1">
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Share buttons */}
        {!showLeadForm && (
          <div className="mb-4">
            <h3 className="text-gray-400 font-mono text-xs mb-2">SDÍLET VÝSLEDEK:</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare('facebook')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 text-xs font-mono rounded"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white py-2 px-3 text-xs font-mono rounded"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 text-xs font-mono rounded"
              >
                WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Play again */}
        <RetroButton onClick={handlePlayAgain} variant="success" className="w-full">
          HRÁT ZNOVU
        </RetroButton>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-xs mt-4 font-mono text-center">
        ENERVIT x JIZERSKÁ 50 - Výživový závod
      </p>
    </div>
  );
}
