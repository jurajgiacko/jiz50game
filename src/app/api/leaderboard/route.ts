import { NextRequest, NextResponse } from 'next/server';

// Data storage (in production, use Vercel Postgres or KV)
let leaderboardData = [
  { id: 1, name: 'Jan Novák', timeMs: 125000, correctChoices: 7, createdAt: '2024-01-15T10:00:00Z' },
  { id: 2, name: 'Petra Svobodová', timeMs: 132000, correctChoices: 6, createdAt: '2024-01-14T15:30:00Z' },
  { id: 3, name: 'Martin Dvořák', timeMs: 145000, correctChoices: 7, createdAt: '2024-01-13T09:15:00Z' },
  { id: 4, name: 'Eva Králová', timeMs: 151000, correctChoices: 5, createdAt: '2024-01-12T14:45:00Z' },
  { id: 5, name: 'Tomáš Černý', timeMs: 163000, correctChoices: 6, createdAt: '2024-01-11T11:20:00Z' },
];

// Leads storage - emails collected from the game
interface Lead {
  id: number;
  name: string;
  email: string;
  raffleConsent: boolean;
  createdAt: string;
}

let leadsData: Lead[] = [];

// Export leads data for the leads endpoint
export { leadsData };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get('filter') || 'all';
  const limit = parseInt(searchParams.get('limit') || '100');

  let filteredData = [...leaderboardData];

  // Filter by time period
  const now = new Date();
  if (filter === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filteredData = filteredData.filter((entry) => new Date(entry.createdAt) >= startOfDay);
  } else if (filter === 'week') {
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredData = filteredData.filter((entry) => new Date(entry.createdAt) >= startOfWeek);
  }

  // Sort by time (fastest first)
  filteredData.sort((a, b) => a.timeMs - b.timeMs);

  // Add rank
  const rankedData = filteredData.slice(0, limit).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return NextResponse.json(rankedData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, timeMs, correctChoices, raffleConsent } = body;

    // Validate input
    if (!name || !email || typeof timeMs !== 'number' || typeof correctChoices !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create new entry
    const newEntry = {
      id: leaderboardData.length + 1,
      name,
      timeMs,
      correctChoices,
      createdAt: new Date().toISOString(),
    };

    // Add to leaderboard
    leaderboardData.push(newEntry);

    // Sort and get rank
    leaderboardData.sort((a, b) => a.timeMs - b.timeMs);
    const rank = leaderboardData.findIndex((e) => e.id === newEntry.id) + 1;

    // Save lead (email for later export)
    const newLead: Lead = {
      id: leadsData.length + 1,
      name,
      email,
      raffleConsent: raffleConsent || false,
      createdAt: new Date().toISOString(),
    };
    leadsData.push(newLead);

    return NextResponse.json({
      success: true,
      entry: { ...newEntry, rank },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
