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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showNutritionPlan, setShowNutritionPlan] = useState(false);
  const [showChoicesReview, setShowChoicesReview] = useState(false);
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
    if (!gdprConsent) return;

    setIsSubmitting(true);

    setUser({ name, email, raffleConsent: true });

    // TODO: Submit to API
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

  const stationNames = ['Před startem', 'KM 8', 'KM 16', 'KM 25', 'KM 33', 'KM 42', 'V cíli'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 flex flex-col items-center justify-start p-3 md:p-4 overflow-auto">
      {/* Result card */}
      <div className="bg-gray-800 border-4 border-orange-500 rounded-lg w-full max-w-md mt-2 md:mt-4 shadow-2xl overflow-hidden">

        {/* Header with result */}
        <div className={`p-4 md:p-5 text-center ${won ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-red-900 to-red-800'}`}>
          <h1 className={`font-mono text-2xl md:text-3xl font-bold mb-1 ${won ? 'text-green-400 glow-green' : 'text-red-400 glow-red'}`}>
            {won ? '🏁 FINISH!' : '💀 OUT OF FUEL!'}
          </h1>
          <p className="text-gray-300 text-xs md:text-sm">
            {won ? 'Dokončil jsi Jizerskou 50!' : 'Energie ti došla před cílem'}
          </p>
        </div>

        {/* Rating badge */}
        <div className="flex justify-center -mt-4">
          <div
            className="px-6 py-2 rounded-full border-4 font-mono font-bold text-base md:text-lg shadow-lg"
            style={{
              backgroundColor: rating.color + '33',
              borderColor: rating.color,
              color: rating.color,
            }}
          >
            {rating.title}
          </div>
        </div>

        <div className="p-4 md:p-5">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-700/50 p-3 rounded-lg text-center border border-gray-600">
              <div className="text-[10px] md:text-xs text-gray-400 font-mono mb-1">⏱️ ČAS</div>
              <div className="text-yellow-400 text-lg md:text-xl font-mono font-bold">
                {formatTime(gameState.time)}
              </div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center border border-gray-600">
              <div className="text-[10px] md:text-xs text-gray-400 font-mono mb-1">✓ VOLBY</div>
              <div className="text-green-400 text-lg md:text-xl font-mono font-bold">
                {gameState.correctChoices}/{gameState.totalStations}
              </div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center border border-gray-600">
              <div className="text-[10px] md:text-xs text-gray-400 font-mono mb-1">⚡ ENERGIE</div>
              <div className={`text-lg md:text-xl font-mono font-bold ${gameState.energy > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.max(0, Math.round(gameState.energy))}%
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3 mb-4">
            <p className="text-gray-300 text-sm text-center leading-relaxed">{rating.message}</p>
          </div>

          {/* Lead capture form - NEW DESIGN */}
          {showLeadForm && !submitted && (
            <form onSubmit={handleSubmit} className="bg-gradient-to-b from-orange-900/40 to-orange-800/40 border-2 border-orange-500 rounded-lg p-4 mb-4">
              <div className="text-center mb-3">
                <h3 className="text-orange-400 font-mono font-bold text-base mb-1">
                  🎁 ULOŽ SKÓRE & ZÍSKEJ
                </h3>
                <div className="bg-orange-600 text-white font-mono font-bold text-lg py-2 px-4 rounded inline-block">
                  -{DISCOUNT_PERCENT}% NA ENERVIT.CZ
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/50 rounded p-2 mb-3">
                <p className="text-blue-300 text-[10px] md:text-xs text-center">
                  🏆 + automaticky soutěžíš o <strong>Enervit balíček</strong> pro JIZ50!
                </p>
              </div>

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
                  label="Souhlasím se zpracováním údajů pro zaslání slevy a účast v soutěži"
                  checked={gdprConsent}
                  onChange={setGdprConsent}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <RetroButton type="submit" disabled={isSubmitting || !gdprConsent} className="flex-1">
                  {isSubmitting ? '...' : '🎁 ZÍSKAT SLEVU'}
                </RetroButton>
                <RetroButton type="button" variant="secondary" onClick={handleSkip}>
                  ✕
                </RetroButton>
              </div>
            </form>
          )}

          {/* Success message with discount code */}
          {submitted && (
            <div className="mb-4">
              {/* Success confirmation */}
              <div className="bg-green-900/30 border border-green-500 p-3 rounded-lg mb-3 text-center">
                <p className="text-green-400 font-mono text-sm font-bold">✓ Skóre uloženo!</p>
                <p className="text-gray-400 text-xs mt-1">
                  Jsi v soutěži o Enervit balíček pro JIZ50!
                </p>
              </div>

              {/* Prominent discount code */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 border-2 border-orange-400 rounded-lg p-4 text-center">
                <h3 className="text-white font-mono font-bold text-sm mb-2">
                  🎉 TVŮJ SLEVOVÝ KÓD -{DISCOUNT_PERCENT}%
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <code className="bg-white text-orange-600 px-4 py-3 font-mono text-xl md:text-2xl flex-1 text-center rounded font-bold tracking-wider">
                    {DISCOUNT_CODE}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="bg-white text-orange-600 px-3 py-3 rounded font-bold text-sm hover:bg-orange-100 transition-colors"
                  >
                    {codeCopied ? '✓' : '📋'}
                  </button>
                </div>
                <a
                  href={`${ENERVIT_SHOP_URL}?discount=${DISCOUNT_CODE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-orange-600 font-mono font-bold text-sm px-6 py-2 rounded hover:bg-orange-100 transition-colors"
                >
                  NAKOUPIT NA ENERVIT.CZ →
                </a>
                <p className="text-orange-200 text-[10px] mt-2">
                  Kód byl také odeslán na tvůj e-mail
                </p>
              </div>
            </div>
          )}

          {/* Discount code for skipped users */}
          {!showLeadForm && !submitted && (
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 mb-4 text-center">
              <p className="text-gray-400 text-xs mb-2">
                Ulož skóre a získej slevu -{DISCOUNT_PERCENT}%!
              </p>
              <button
                onClick={() => setShowLeadForm(true)}
                className="text-orange-400 font-mono text-xs underline hover:text-orange-300"
              >
                Chci slevu →
              </button>
            </div>
          )}

          {/* Review choices - educational section */}
          {!showLeadForm && (
            <div className="mb-4">
              <button
                onClick={() => setShowChoicesReview(!showChoicesReview)}
                className="w-full text-left text-cyan-400 font-mono text-xs md:text-sm hover:text-cyan-300 transition-colors flex items-center gap-2"
              >
                <span>{showChoicesReview ? '▼' : '▶'}</span>
                <span>📚 PŘEHLED TVÝCH VOLEB</span>
              </button>
              {showChoicesReview && (
                <div className="bg-gray-700/50 rounded-lg mt-2 overflow-hidden border border-gray-600">
                  {choices.map((choice, i) => (
                    <div
                      key={i}
                      className={`p-3 border-b border-gray-600 last:border-b-0 ${choice.correct ? 'bg-green-900/20' : 'bg-red-900/20'}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`text-lg ${choice.correct ? 'text-green-400' : 'text-red-400'}`}>
                          {choice.correct ? '✓' : '✗'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-400 text-[10px] font-mono">{stationNames[choice.stationIndex]}</div>
                          <div className="text-white text-xs font-bold truncate">{choice.productName}</div>
                          <p className="text-gray-400 text-[10px] leading-relaxed mt-1">{choice.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nutrition plan */}
          {!showLeadForm && (
            <div className="mb-4">
              <button
                onClick={() => setShowNutritionPlan(!showNutritionPlan)}
                className="w-full text-left text-orange-400 font-mono text-xs md:text-sm hover:text-orange-300 transition-colors flex items-center gap-2"
              >
                <span>{showNutritionPlan ? '▼' : '▶'}</span>
                <span>🎯 TVŮJ NUTRIČNÍ PLÁN</span>
              </button>
              {showNutritionPlan && (
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mt-2">
                  {nutritionPlan.map((tip, i) => (
                    <p key={i} className={`text-xs mb-1.5 last:mb-0 ${tip ? 'text-gray-300' : 'text-gray-500'}`}>
                      {tip || '\u00A0'}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Share buttons */}
          {!showLeadForm && (
            <div className="mb-4">
              <h3 className="text-gray-400 font-mono text-[10px] md:text-xs mb-2 text-center">SDÍLEJ VÝSLEDEK</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-2.5 px-3 text-xs font-mono rounded-lg transition-colors"
                >
                  📘 FB
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white py-2.5 px-3 text-xs font-mono rounded-lg transition-colors"
                >
                  🐦 X
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex-1 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white py-2.5 px-3 text-xs font-mono rounded-lg transition-colors"
                >
                  💬 WA
                </button>
              </div>
            </div>
          )}

          {/* Play again button */}
          <button
            onClick={handlePlayAgain}
            className="retro-button-orange w-full py-3 md:py-4 font-mono text-sm md:text-base"
          >
            🔄 RACE AGAIN
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="logo-enervit px-2 py-1 text-[10px]">ENERVIT</span>
          <span className="text-gray-500">×</span>
          <span className="logo-jiz px-2 py-1 text-[10px]">
            <span className="text-yellow-300">JIZ</span>
            <span className="text-white">50</span>
          </span>
        </div>
        <p className="text-gray-500 text-[10px] font-mono">
          FUEL THE RACE ⚡
        </p>
      </div>
    </div>
  );
}
