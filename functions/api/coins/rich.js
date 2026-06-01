const CG_API = 'https://api.coingecko.com/api/v3';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders('*') });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '*';
  const coinId = url.searchParams.get('id');
  const currency = url.searchParams.get('currency') || 'usd';

  if (!coinId) {
    return new Response(JSON.stringify({ error: 'Missing coin id parameter' }), {
      status: 400, headers: corsHeaders(origin),
    });
  }

  const cacheKey = `cg_rich_${coinId}`;
  const cache = caches?.default;

  if (cache) {
    const cached = await cache.match(request);
    if (cached) return cached;
  }

  try {
    const apiKey = env.COINGECKO_API_KEY || '';
    const headers = { 'Accept': 'application/json' };
    if (apiKey) headers['x-cg-pro-api-key'] = apiKey;

    const res = await fetch(
      `${CG_API}/coins/${encodeURIComponent(coinId)}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=false`,
      { headers }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'CoinGecko API error', status: res.status }), {
        status: res.status, headers: { ...corsHeaders(origin), 'Cache-Control': 'public, max-age=60' },
      });
    }

    const data = await res.json();

    const result = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      description: data.description?.en || '',
      homepage: data.links?.homepage?.filter(Boolean)?.[0] || '',
      twitter: data.links?.twitter_screen_name ? `https://x.com/${data.links.twitter_screen_name}` : '',
      telegram: data.links?.telegram_channel_identifier ? `https://t.me/${data.links.telegram_channel_identifier}` : '',
      reddit: data.links?.subreddit_url || '',
      discord: data.links?.discord ? `https://discord.gg/${data.links.discord}` : '',
      github: data.links?.repos_url?.github?.filter(Boolean)?.[0] || '',
      explorer: data.links?.blockchain_site?.filter(Boolean)?.[0] || '',
      whitepaper: data.links?.whitepaper || '',
      categories: data.categories?.filter(Boolean) || [],
      genesis_date: data.genesis_date || '',
      market_data: {
        current_price: data.market_data?.current_price?.[currency] || null,
        market_cap: data.market_data?.market_cap?.[currency] || null,
        total_volume: data.market_data?.total_volume?.[currency] || null,
        high_24h: data.market_data?.high_24h?.[currency] || null,
        low_24h: data.market_data?.low_24h?.[currency] || null,
        price_change_24h: data.market_data?.price_change_24h || null,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || null,
        price_change_percentage_7d: data.market_data?.price_change_percentage_7d || null,
        price_change_percentage_14d: data.market_data?.price_change_percentage_14d || null,
        price_change_percentage_30d: data.market_data?.price_change_percentage_30d || null,
        price_change_percentage_60d: data.market_data?.price_change_percentage_60d || null,
        price_change_percentage_200d: data.market_data?.price_change_percentage_200d || null,
        price_change_percentage_1y: data.market_data?.price_change_percentage_1y || null,
        market_cap_rank: data.market_data?.market_cap_rank || null,
        total_supply: data.market_data?.total_supply || null,
        max_supply: data.market_data?.max_supply || null,
        circulating_supply: data.market_data?.circulating_supply || null,
        ath: data.market_data?.ath?.[currency] || null,
        ath_date: data.market_data?.ath_date?.[currency] || null,
        ath_change_percentage: data.market_data?.ath_change_percentage?.[currency] || null,
        atl: data.market_data?.atl?.[currency] || null,
        atl_date: data.market_data?.atl_date?.[currency] || null,
        atl_change_percentage: data.market_data?.atl_change_percentage?.[currency] || null,
        fully_diluted_valuation: data.market_data?.fully_diluted_valuation?.[currency] || null,
      },
      community: data.community_data ? {
        twitter_followers: data.community_data.twitter_followers || 0,
        telegram_channel_user_count: data.community_data.telegram_channel_user_count || 0,
        reddit_subscribers: data.community_data.reddit_subscribers || 0,
      } : null,
    };

    const response = new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });

    if (cache) {
      const cacheRequest = new Request(request.url, { method: 'GET' });
      await cache.put(cacheRequest, response.clone());
    }

    return response;
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders(origin),
    });
  }
}
