import { NextResponse } from 'next/server';
import { fetchAllRates, getConverterRates } from '@/lib/api/rates';

export async function GET() {
  try {
    const rates = getConverterRates();
    const allRates = await fetchAllRates();

    return NextResponse.json({
      success: true,
      data: {
        converter: rates,
        gold: allRates.gold,
        lastUpdated: allRates.lastUpdated,
        source: allRates.source,
      },
    });
  } catch {
    const fallback = getConverterRates();
    return NextResponse.json({
      success: true,
      data: {
        converter: fallback,
        source: 'fallback',
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}
