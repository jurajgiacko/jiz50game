'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RetroButton } from '@/components/ui/RetroButton';
import type { LeaderboardEntry } from '@/lib/types';

// Mock data for now (will be replaced with API call)
const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: 'Jan Novák', timeMs: 125000, correctChoices: 7, createdAt: '2024-01-15', rank: 1 },
  { id: 2, name: 'Petra Svobodová', timeMs: 132000, correctChoices: 6, createdAt: '2024-01-14', rank: 2 },
  { id: 3, name: 'Martin Dvořák', timeMs: 145000, correctChoices: 7, createdAt: '2024-01-13', rank: 3 },
  { id: 4, name: 'Eva Králová', timeMs: 151000, correctChoices: 5, createdAt: '2024-01-12', rank: 4 },
  { id: 5, name: 'Tomáš Černý', timeMs: 163000, correctChoices: 6, createdAt: '2024-01-11', rank: 5 },
];

type FilterType = 'all' | 'today' | 'week';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ');
  };

  useEffect(() => {
    // TODO: Fetch from API
    // const fetchLeaderboard = async () => {
    //   setLoading(true);
    //   const res = await fetch(`/api/leaderboard?filter=${filter}`);
    //   const data = await res.json();
    //   setLeaderboard(data);
    //   setLoading(false);
    // };
    // fetchLeaderboard();
  }, [filter]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-300';
      case 3:
        return 'text-orange-400';
      default:
        return 'text-white';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <RetroButton size="sm" variant="secondary">
              ← ZPĚT
            </RetroButton>
          </Link>
          <h1 className="text-orange-500 font-mono text-lg md:text-xl font-bold">ŽEBŘÍČEK</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {(['all', 'week', 'today'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-mono text-xs border-2 transition-colors ${
                filter === f
                  ? 'bg-orange-600 border-orange-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f === 'all' ? 'CELKEM' : f === 'week' ? 'TÝDEN' : 'DNES'}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 p-3 bg-gray-700 border-b-2 border-gray-600 text-gray-400 font-mono text-[10px] md:text-xs">
            <div className="col-span-1">#</div>
            <div className="col-span-4">JMÉNO</div>
            <div className="col-span-3 text-center">ČAS</div>
            <div className="col-span-2 text-center">VOLBY</div>
            <div className="col-span-2 text-right hidden md:block">DATUM</div>
          </div>

          {/* Table body */}
          {loading ? (
            <div className="p-8 text-center text-gray-400 font-mono">Načítám...</div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-mono">
              Zatím žádné výsledky
            </div>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-12 gap-2 p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <div className={`col-span-1 font-mono font-bold ${getRankColor(entry.rank || 0)}`}>
                  {getRankEmoji(entry.rank || 0)}
                </div>
                <div className="col-span-4 font-mono text-white truncate text-sm">
                  {entry.name}
                </div>
                <div className="col-span-3 font-mono text-yellow-400 text-center text-sm">
                  {formatTime(entry.timeMs)}
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-green-400 font-mono text-sm">
                    {entry.correctChoices}/7
                  </span>
                </div>
                <div className="col-span-2 text-right text-gray-500 font-mono text-xs hidden md:block">
                  {formatDate(entry.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Play button */}
        <div className="mt-6 flex justify-center">
          <Link href="/">
            <RetroButton size="lg">HRÁT</RetroButton>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6 font-mono">
          ENERVIT x JIZERSKÁ 50 - Výživový závod
        </p>
      </div>
    </div>
  );
}
