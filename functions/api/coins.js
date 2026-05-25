export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = Math.min(parseInt(url.searchParams.get('per_page') || '50'), 250);
  const sort = url.searchParams.get('sort') || 'market_cap_rank';
  const order = url.searchParams.get('order') || 'asc';
  const search = url.searchParams.get('search') || '';
  const filter = url.searchParams.get('filter') || 'all';

  const validSorts = ['market_cap_rank', 'current_price', 'price_change_percentage_24h', 'market_cap', 'total_volume', 'price_change_percentage_1h', 'price_change_percentage_7d'];
  const sortCol = validSorts.includes(sort) ? sort : 'market_cap_rank';
  const orderDir = order === 'desc' ? 'DESC' : 'ASC';

  try {
    // Try D1 first
    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('(name LIKE ? OR symbol LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (filter === 'gainers') {
      whereClauses.push('price_change_percentage_24h > 5');
    } else if (filter === 'losers') {
      whereClauses.push('price_change_percentage_24h < -5');
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM coins ${whereSQL}`;
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;

    const dataQuery = `SELECT * FROM coins ${whereSQL} ORDER BY ${sortCol} ${orderDir} LIMIT ? OFFSET ?`;
    const dataResult = await env.DB.prepare(dataQuery).bind(...params, perPage, (page - 1) * perPage).all();

    return Response.json({
      coins: dataResult.results,
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
      source: 'd1',
      timestamp: new Date().toISOString(),
    });
  } catch (d1Error) {
    console.error('[API/Coins] D1 failed, falling back to local cache:', d1Error.message);

    try {
      // Fallback: fetch from local coins-market.json via a pre-built endpoint
      const fallbackRes = await fetch(`${url.origin}/data/coins-market.json`);
      if (!fallbackRes.ok) throw new Error('Fallback not available');

      const localData = await fallbackRes.json();
      let allCoins = [];
      for (const p of localData.pages || []) {
        for (const coin of p.coins || []) {
          allCoins.push(coin);
        }
      }

      if (search) {
        const q = search.toLowerCase();
        allCoins = allCoins.filter((c) =>
          c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
        );
      }

      if (filter === 'gainers') {
        allCoins = allCoins.filter((c) => (c.price_change_percentage_24h || 0) > 5);
      } else if (filter === 'losers') {
        allCoins = allCoins.filter((c) => (c.price_change_percentage_24h || 0) < -5);
      }

      const sortKey = ['market_cap_rank', 'current_price', 'price_change_percentage_24h', 'market_cap', 'total_volume'].includes(sort) ? sort : 'market_cap_rank';
      allCoins.sort((a, b) => {
        const aVal = a[sortKey] ?? 999999999;
        const bVal = b[sortKey] ?? 999999999;
        return order === 'desc' ? bVal - aVal : aVal - bVal;
      });

      const total = allCoins.length;
      const totalPages = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const pagedCoins = allCoins.slice(start, start + perPage);

      return Response.json({
        coins: pagedCoins,
        total,
        page,
        per_page: perPage,
        total_pages: totalPages,
        source: 'local-cache',
        timestamp: localData.lastUpdated || new Date().toISOString(),
      });
    } catch {
      return Response.json(
        { error: 'Data unavailable', coins: [], total: 0, page, per_page: perPage, total_pages: 0, source: 'unavailable' },
        { status: 503 }
      );
    }
  }
}
