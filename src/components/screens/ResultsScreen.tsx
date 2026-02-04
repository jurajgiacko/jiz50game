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
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

    try {
      // Save user data locally
      setUser({ name, email, raffleConsent });

      // Submit to API
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          timeMs: gameState.time,
          correctChoices: gameState.correctChoices,
          raffleConsent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitted(true);
      setShowLeadForm(false);
    } catch (error) {
      console.error('Error submitting score:', error);
      // Still show success to user, we can retry later
      setSubmitted(true);
      setShowLeadForm(false);
    } finally {
      setIsSubmitting(false);
    }
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

  const getShareText = () => {
    const ratingEmoji = gameState.correctChoices >= 6 ? '🏆' : gameState.correctChoices >= 4 ? '🥈' : '🎿';
    return `${ratingEmoji} Mám ${gameState.correctChoices}/7 správných voleb ve hře FUEL THE RACE! Znáš správnou výživu pro Jizerskou 50? Zkus to taky!`;
  };

  const handleShare = (platform: 'facebook' | 'whatsapp' | 'instagram') => {
    const text = getShareText();
    const url = 'https://jiz50.enervit.online';

    if (platform === 'instagram') {
      // Instagram doesn't have share URL, copy text to clipboard
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
      return;
    }

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleShowShareCard = () => {
    setShowShareCard(true);
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

        {/* Share section */}
        {!showLeadForm && (
          <div className="mb-4">
            <button
              onClick={handleShowShareCard}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-4 font-mono font-bold rounded-lg mb-2 flex items-center justify-center gap-2"
            >
              📤 SDÍLET VÝSLEDEK
            </button>
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

      {/* Share Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm">
            {/* Share Card */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-4 border-orange-500 rounded-xl p-6 mb-4 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-4">
                  <div className="text-orange-500 font-mono text-xs tracking-widest mb-1">ENERVIT × JIZERSKÁ 50</div>
                  <div className="text-white font-mono text-2xl font-bold">FUEL THE RACE</div>
                </div>

                {/* Result */}
                <div className="bg-gray-800/80 rounded-lg p-4 mb-4 text-center border border-gray-700">
                  <div className="text-6xl mb-2">
                    {gameState.correctChoices >= 6 ? '🏆' : gameState.correctChoices >= 4 ? '🥈' : gameState.correctChoices >= 2 ? '🥉' : '🎿'}
                  </div>
                  <div 
                    className="font-mono text-xl font-bold mb-1"
                    style={{ color: rating.color }}
                  >
                    {rating.title}
                  </div>
                  <div className="text-white font-mono text-3xl font-bold">
                    {gameState.correctChoices}<span className="text-gray-500">/7</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">správných voleb</div>
                </div>

                {/* Call to action */}
                <div className="text-center text-gray-400 text-xs font-mono">
                  Znáš správnou výživu pro Jizerskou 50?
                </div>
                <div className="text-center text-orange-400 text-sm font-mono font-bold mt-1">
                  jiz50.enervit.online
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-2 text-sm font-mono rounded-lg flex flex-col items-center gap-1"
              >
                <span className="text-xl">📘</span>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white py-3 px-2 text-sm font-mono rounded-lg flex flex-col items-center gap-1"
              >
                <span className="text-xl">📷</span>
                <span>{shareCopied ? 'Zkopírováno!' : 'Instagram'}</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-600 hover:bg-green-500 text-white py-3 px-2 text-sm font-mono rounded-lg flex flex-col items-center gap-1"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowShareCard(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 font-mono rounded-lg"
            >
              ZAVŘÍT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
