export async function onRequest(context) {
  try {
    const res = await fetch('https://aslminer.com/products.json', {
      headers: { 'User-Agent': 'Cloudflare-Pages-Function' },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    return new Response(res.body, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
