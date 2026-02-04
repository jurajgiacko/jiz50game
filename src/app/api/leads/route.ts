import { NextRequest, NextResponse } from 'next/server';
import { leadsData } from '../leaderboard/route';

// Simple admin password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jiz50admin';

export async function GET(request: NextRequest) {
  // Check for password in query params
  const searchParams = request.nextUrl.searchParams;
  const password = searchParams.get('password');
  const format = searchParams.get('format') || 'json';

  // Basic auth check
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Unauthorized. Add ?password=YOUR_PASSWORD to access.' },
      { status: 401 }
    );
  }

  // Return as CSV
  if (format === 'csv') {
    const headers = ['ID', 'Jméno', 'Email', 'Souhlas se soutěží', 'Datum'];
    const rows = leadsData.map((lead) => [
      lead.id,
      `"${lead.name}"`,
      lead.email,
      lead.raffleConsent ? 'Ano' : 'Ne',
      lead.createdAt,
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="jiz50-leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  // Return as JSON (default)
  return NextResponse.json({
    total: leadsData.length,
    leads: leadsData,
  });
}
