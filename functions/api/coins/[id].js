export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const coinId = url.searchParams.get('id');
  const currency = url.searchParams.get('currency') || 'usd';

  if (!coinId) {
    return Response.json({ error: 'Missing coin id parameter' }, { status: 400 });
  }

  // Try D1 first for base data
  let coin = null;
  try {
    const result = await env.DB.prepare('SELECT * FROM coins WHERE id = ?').bind(coinId).first();
    if (result) coin = result;
  } catch {}

  // Fetch live price from multiple sources
  const livePrice = await fetchLivePrice(coinId, currency);

  if (coin && livePrice) {
    return Response.json({
      ...coin,
      current_price: livePrice.current_price || coin.current_price,
      price_change_percentage_24h: livePrice.price_change_percentage_24h ?? coin.price_change_percentage_24h,
      total_volume: livePrice.total_volume || coin.total_volume,
      market_cap: livePrice.market_cap || coin.market_cap,
      live_source: livePrice.source,
      timestamp: new Date().toISOString(),
    });
  }

  if (livePrice) {
    return Response.json({
      ...livePrice,
      id: coinId,
      live_source: livePrice.source,
      timestamp: new Date().toISOString(),
    });
  }

  if (coin) {
    return Response.json({ ...coin, live_source: 'cached', timestamp: new Date().toISOString() });
  }

  return Response.json({ error: 'Coin not found' }, { status: 404 });
}

async function fetchLivePrice(coinId, currency) {
  // Try CoinGecko
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data[coinId]) {
        return {
          current_price: data[coinId][currency] || 0,
          price_change_percentage_24h: data[coinId][`${currency}_24h_change`] || 0,
          total_volume: data[coinId][`${currency}_24h_vol`] || 0,
          market_cap: data[coinId][`${currency}_market_cap`] || 0,
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
          total_volume: parseFloat(data.data.volumeUsd24Hr) || 0,
          market_cap: parseFloat(data.data.marketCapUsd) || 0,
          source: 'coincap',
        };
      }
    }
  } catch {}

  // Try Binance (for USDT pairs)
  try {
    const symbol = coinId.toUpperCase() + 'USDT';
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      return {
        current_price: parseFloat(data.lastPrice) || 0,
        price_change_percentage_24h: parseFloat(data.priceChangePercent) || 0,
        total_volume: parseFloat(data.quoteVolume) || 0,
        market_cap: 0,
        source: 'binance',
      };
    }
  } catch {}

  return null;
}
