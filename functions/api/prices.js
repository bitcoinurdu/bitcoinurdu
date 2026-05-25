export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const ids = url.searchParams.get('ids') || '';
  const currency = url.searchParams.get('currency') || 'usd';

  const coinIds = ids.split(',').filter(Boolean).slice(0, 100);

  if (coinIds.length === 0) {
    return Response.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  const results = {};
  const fetches = coinIds.map(async (id) => {
    const price = await fetchLivePrice(id, currency);
    if (price) {
      results[id] = price;
    }
  });

  await Promise.allSettled(fetches);

  return Response.json({
    prices: results,
    currency,
    count: Object.keys(results).length,
    timestamp: new Date().toISOString(),
  });
}

async function fetchLivePrice(coinId, currency) {
  // Try CoinGecko
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data[coinId]) {
        return {
          current_price: data[coinId][currency] || 0,
          price_change_percentage_24h: data[coinId][`${currency}_24h_change`] || 0,
          source: 'coingecko',
        };
      }
    }
  } catch {}

  // Try CoinCap
  try {
    const res = await fetch(`https://api.coincap.io/v2/assets/${coinId}`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return {
          current_price: parseFloat(data.data.priceUsd) || 0,
          price_change_percentage_24h: parseFloat(data.data.changePercent24Hr) || 0,
          source: 'coincap',
        };
      }
    }
  } catch {}

  // Try Binance
  try {
    const symbol = coinId.toUpperCase() + 'USDT';
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      return {
        current_price: parseFloat(data.lastPrice) || 0,
        price_change_percentage_24h: parseFloat(data.priceChangePercent) || 0,
        source: 'binance',
      };
    }
  } catch {}

  return null;
}
