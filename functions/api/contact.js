const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders('*') });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '*';

  try {
    const body = await request.json();
    const { turnstileToken, name, email, subject, message, type } = body;

    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing verification token' }), {
        status: 400, headers: corsHeaders(origin),
      });
    }

    const secretKey = env.TURNSTILE_SECRET_KEY || '0x4AAAAAADWLchJdObJGRl9ETty8xvYV5y0';

    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(turnstileToken)}`,
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Verification failed', details: verifyData['error-codes'] }), {
        status: 400, headers: corsHeaders(origin),
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Message received. We will get back to you soon.',
    }), {
      status: 200, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error', details: e.message }), {
      status: 500, headers: corsHeaders(origin),
    });
  }
}
