'use client';

import { StartScreen } from '@/components/screens/StartScreen';
import { GameScreen } from '@/components/screens/GameScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';

export default function Home() {
  return (
    <main className="min-h-screen">
      <StartScreen />
      <GameScreen />
      <ResultsScreen />
    </main>
  );
}
