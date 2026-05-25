// Firebase Firestore-backed Auth API
// Handles register, login, forgot-password, reset-password

const PROJECT_ID = 'bu-opencode';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const FIREBASE_PRIVATE_KEY_FALLBACK = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDE1OCDEOefYGvN
jpiPTnjTGReuBdp+RlpB2gnbO5siz2KL1QItRbOiiLm1hCNpSxxH9T5VRLlDi+hU
tx6H+4n1iBKDwNBqvf5yP7yFiDAhxl+4jsc5cSUQmPGfeHDEGaQ2ifYWKQGR3Mc9
lReV0d82JeqC385Kg7GgJWPK4Vq72bH7Q638F0y3gmMkNmJHG/HCred2C7zRNOHk
XJyc9cT8ifAMYFvJiOr0Lj6wPFNcdGDLgGJEM98WqKbDE/u3Ygk3vmYjSbEXNGGo
Nbh4j53a1PZb/NebLZdCP9FwBIbfj1V+B9+w4MsFSMKCsQJ3+nOQTiGcSLE+c3Dz
xgSGkJkTAgMBAAECggEASEGnm6XIicLxQDgxPCaAB2qmPT2r3IBCIPuEc8U5abl9
AT00e98jFy8fEYoNH9mxa58Vf2LnqerB4tuIaz4FgquttE1DlXPi5RkNwW1h0fxL
ZmqPq0Akbaffx32E1BBfrp/NxYvPJjdIsww46MhvKycXJG05gzQ+MD6ZmEBLOTsG
1SSERco9KFlxqRAmXLESY1/Exs2W+byYwk5bM4fJC3ybO6pDafQR3HH/mDLBWEPc
wXi9lDLOQOiabmDj/sFUhlx4IpajzTAwIx+YyDpQGVdxnk5N/XrfEyUX7VD5HQVX
YVnRrZDqtpziWaqy+gHcIwJOeL2EVmW8ylziEFtegQKBgQD+g1sxic4zo9Jsm4/q
y0Kl7+3SdU9JxPDHnEA7Cv+9x0yGDB+HAMnNiC8sG1m3pfYLSio+txS1NrcrgU+U
qkVoUwyl/o5hVnmzdkV8PrafwLiUSq7uVcMT49KouBV1D6MN9ismgwKr71pUPPFK
hK8NapzeNqa6/Lt62Ojmg6z/kwKBgQDF+0DsEH3l10HwEcjhMMNheO4k55lM1AjJ
NKcvHkvkiZ6I9RHjhkucnZw6/Ndl1VP/6FrQn5WqIWrPDCqaT7bJ1N3G0IoP5PNL
2v7vue80+tvMshjkAD9akRng7Sul439ADxJjuuIHZ4ddcuxwpQdDz51nDbgVS/Av
WdriKk7wgQKBgHIJAO8tQ4q3uCyZdt5IvFAFNJW7og73grqtM8pAn1200oCtJeMj
Y0gH4LrudkBmx9s/G7aF6W1YWrHPeoytzfN0YpJtf/X0/Qp/z5pfrwvdGda3r7Fy
E7nxtg2KjXKp0vEKf0L+KFBJKjvcInC1CooEXszhx8q4OnhMf+3oybapAoGAHtA0
Eomejp8qDAs4kJPeVNVVezjwixyVIXuoaZT1iuRAYGCEID1Ol1mQbz3a6GaDZFjt
iXrM+GWrEf56wvmVIWSX/9GFK2Qe2beD5huyNzSz8O/nH9VKBvZ+aJuBJ5h4vaea
3RrBAxYB43F3izCkKNGvVdK0y9u9ziDWCE09bAECgYBpmQ+TRvRfqsXbpQUr5lXn
4ujKCSXVbOpgyQKBimVb4PoGCLbn6VgK3mkE1JTykS9BhstRSMhQ0jbZ4EQdgdjF
YrjcloxThlQFW61maok8MnQ4aLlOXkBfU2a9PsrCq9hgajN9BMXEEwDpFhwckjMJ
BCcdJGkhopoTQXHkj8nWgQ==
-----END PRIVATE KEY-----`;

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function pemToBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '').replace(/\r/g, '');
  const bytes = atob(b64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return buf.buffer;
}

function b64url(buf) {
  const str = buf instanceof ArrayBuffer ? String.fromCharCode(...new Uint8Array(buf)) : String.fromCharCode(...buf);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(pKey, cEmail) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: cEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, iat: now,
  };
  const encoder = new TextEncoder();
  const headerB64 = b64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = b64url(encoder.encode(JSON.stringify(payload)));
  const toSign = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey('pkcs8', pemToBuffer(pKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, key, encoder.encode(toSign));
  const assertion = `${toSign}.${b64url(sig)}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`,
  });
  const data = await res.json();
  return data.access_token;
}

async function firestoreGet(collection, doc, pKey, cEmail) {
  const token = await getAccessToken(pKey, cEmail);
  const res = await fetch(`${FIRESTORE_URL}/${collection}/${doc}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return docToObj(data);
}

async function firestoreSet(collection, doc, obj, pKey, cEmail) {
  const token = await getAccessToken(pKey, cEmail);
  const res = await fetch(`${FIRESTORE_URL}/${collection}/${doc}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(objToDoc(obj)),
  });
  return res.ok;
}

function docToObj(doc) {
  if (!doc || !doc.fields) return null;
  const obj = {};
  for (const [key, val] of Object.entries(doc.fields)) {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = String(val.integerValue);
    else if (val.doubleValue !== undefined) obj[key] = String(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = String(val.booleanValue);
  }
  return obj;
}

function objToDoc(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    fields[key] = { stringValue: String(val) };
  }
  return { fields };
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '*';
  return new Response(null, { headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '*';
  const pKey = (env && env.FIREBASE_PRIVATE_KEY) || FIREBASE_PRIVATE_KEY_FALLBACK;
  const cEmail = (env && env.FIREBASE_CLIENT_EMAIL) || 'firebase-adminsdk-fbsvc@bu-opencode.iam.gserviceaccount.com';

  try {
    const body = await request.json();
    const { action, email, password, name, code } = body;

    if (action === 'register') {
      if (!email || !password || !name) {
        return Response.json({ error: 'email, password, name required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const existing = await firestoreGet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (existing) {
        return Response.json({ error: 'Email already registered' }, { status: 409, headers: corsHeaders(origin) });
      }
      const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const hashed = await sha256(password);
      const userData = { id: userId, email, name, password: hashed, createdAt: new Date().toISOString() };
      await firestoreSet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), userData, pKey, cEmail);
      const token = btoa(`${userId}:${email}:${Date.now()}`);
      return Response.json({ success: true, token, user: { id: userId, email, name } }, { headers: corsHeaders(origin) });
    }

    if (action === 'login') {
      if (!email || !password) {
        return Response.json({ error: 'email, password required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const userData = await firestoreGet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (!userData) {
        return Response.json({ error: 'Email not registered' }, { status: 404, headers: corsHeaders(origin) });
      }
      const hashed = await sha256(password);
      if (userData.password !== hashed) {
        return Response.json({ error: 'Wrong password' }, { status: 401, headers: corsHeaders(origin) });
      }
      const token = btoa(`${userData.id}:${email}:${Date.now()}`);
      return Response.json({ success: true, token, user: { id: userData.id, email: userData.email, name: userData.name } }, { headers: corsHeaders(origin) });
    }

    if (action === 'forgot-password') {
      if (!email) {
        return Response.json({ error: 'email required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const userData = await firestoreGet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (!userData) {
        return Response.json({ error: 'Email not registered' }, { status: 404, headers: corsHeaders(origin) });
      }
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = String(Date.now() + 10 * 60 * 1000);
      await firestoreSet('resets', email.replace(/[^a-zA-Z0-9]/g, '_'), { email, code: resetCode, expires }, pKey, cEmail);
      return Response.json({ success: true, message: 'Reset code generated', code: resetCode }, { headers: corsHeaders(origin) });
    }

    if (action === 'verify-reset-code') {
      if (!email || !code) {
        return Response.json({ error: 'email, code required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const resetData = await firestoreGet('resets', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (!resetData) {
        return Response.json({ error: 'No reset code found' }, { status: 404, headers: corsHeaders(origin) });
      }
      if (resetData.code !== code) {
        return Response.json({ error: 'Wrong code' }, { status: 401, headers: corsHeaders(origin) });
      }
      if (Date.now() > parseInt(resetData.expires || '0')) {
        return Response.json({ error: 'Code expired' }, { status: 410, headers: corsHeaders(origin) });
      }
      return Response.json({ success: true, message: 'Code verified' }, { headers: corsHeaders(origin) });
    }

    if (action === 'reset-password') {
      if (!email || !code || !password) {
        return Response.json({ error: 'email, code, password required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const resetData = await firestoreGet('resets', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (!resetData || resetData.code !== code) {
        return Response.json({ error: 'Invalid or expired code' }, { status: 401, headers: corsHeaders(origin) });
      }
      if (Date.now() > parseInt(resetData.expires || '0')) {
        return Response.json({ error: 'Code expired' }, { status: 410, headers: corsHeaders(origin) });
      }
      const hashed = await sha256(password);
      await firestoreSet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), { password: hashed }, pKey, cEmail);
      // Clean up reset code
      await fetch(`${FIRESTORE_URL}/resets/${email.replace(/[^a-zA-Z0-9]/g, '_')}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await getAccessToken(pKey, cEmail)}` },
      }).catch(() => {});
      return Response.json({ success: true, message: 'Password reset successfully' }, { headers: corsHeaders(origin) });
    }

    if (action === 'update-password') {
      if (!email || !password || !code) {
        return Response.json({ error: 'email, password, current auth required' }, { status: 400, headers: corsHeaders(origin) });
      }
      const userData = await firestoreGet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), pKey, cEmail);
      if (!userData) {
        return Response.json({ error: 'User not found' }, { status: 404, headers: corsHeaders(origin) });
      }
      // code = current password for update-password action
      const currentHashed = await sha256(code);
      if (userData.password !== currentHashed) {
        return Response.json({ error: 'Current password wrong' }, { status: 401, headers: corsHeaders(origin) });
      }
      const newHashed = await sha256(password);
      await firestoreSet('users', email.replace(/[^a-zA-Z0-9]/g, '_'), { password: newHashed }, pKey, cEmail);
      return Response.json({ success: true, message: 'Password updated' }, { headers: corsHeaders(origin) });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400, headers: corsHeaders(origin) });
  } catch (e) {
    return Response.json({ error: e.message || 'Internal error' }, { status: 500, headers: corsHeaders(origin) });
  }
}
