import { NextRequest, NextResponse } from 'next/server';

const SQLI_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b.*\b(FROM|INTO|TABLE|WHERE|SET|DATABASE)\b)/i,
  /(--|;|\/\*|\*\/|@@|@|CHAR\(|NCHAR\(|VARCHAR\(|NVARCHAR\(|CAST\(|CONVERT\()/i,
  /(\bOR\b\s+\d+\s*=\s*\d+)/i,
  /(\bAND\b\s+\d+\s*=\s*\d+)/i,
  /('\s*(OR|AND)\s*')/i,
  /(UNION\s+(ALL\s+)?SELECT)/i,
  /(WAITFOR\s+DELAY)/i,
  /(BENCHMARK\(|SLEEP\()/i,
  /(LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE)/i,
];

const XSS_PATTERNS = [
  /<script[^>]*>[\s\S]*?<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /on\w+\s*=\s*[^\s>]+/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<form[^>]*>/gi,
  /eval\s*\(/gi,
  /document\.(cookie|write|location)/gi,
  /window\.(location|open)/gi,
  /alert\s*\(/gi,
  /prompt\s*\(/gi,
  /confirm\s*\(/gi,
  /String\.fromCharCode/gi,
  /atob\s*\(/gi,
  /btoa\s*\(/gi,
];

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.[/\\]/gi,
  /%2e%2e[/\\%]/gi,
  /\.\.%2[fF]/gi,
  /%252e%252e%252[fF]/gi,
  /[/\\]etc[/\\]passwd/i,
  /[/\\]etc[/\\]shadow/i,
  /[/\\]windows[/\\]/i,
  /[/\\]system32[/\\]/i,
];

const BOT_SIGNATURES = [
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /scrapy/i,
  /python-requests/i,
  /curl\//i,
  /wget\//i,
  /nikto/i,
  /sqlmap/i,
  /nmap/i,
  /dirbuster/i,
  /gobuster/i,
  /burpsuite/i,
];

const SAFE_PATHS = [
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/api/health',
  '/data/',
];

function sanitizeValue(value: string): string {
  let sanitized = value;
  for (const pattern of XSS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  sanitized = sanitized.replace(/[<>"'`;]/g, (match) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;',
      ';': '&#59;',
    };
    return entities[match] || match;
  });
  return sanitized;
}

function inspectPayload(payload: string): { safe: boolean; threat: string | null } {
  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(payload)) {
      return { safe: false, threat: 'SQL Injection' };
    }
  }
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(payload)) {
      return { safe: false, threat: 'XSS Attack' };
    }
  }
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(payload)) {
      return { safe: false, threat: 'Path Traversal' };
    }
  }
  return { safe: true, threat: null };
}

function isSuspiciousBot(userAgent: string): boolean {
  if (!userAgent) return true;
  for (const pattern of BOT_SIGNATURES) {
    if (pattern.test(userAgent)) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const method = request.method;

  if (SAFE_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.coingecko.com https://api.coincap.io https://api.binance.com https://api.dexscreener.com https://api.mexc.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com;",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };

  if (isSuspiciousBot(userAgent) && !pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('CF-Challenge', 'managed');
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  if (method === 'GET' && searchParams.toString()) {
    for (const [key, value] of searchParams.entries()) {
      const inspection = inspectPayload(value);
      if (!inspection.safe) {
        console.warn(`[SECURITY] Blocked ${inspection.threat} on ${pathname} param ${key}`);
        return NextResponse.json(
          { error: 'Request blocked by security filter', code: 'SECURITY_VIOLATION' },
          { status: 403 }
        );
      }
    }
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    const contentType = request.headers.get('content-type') || '';
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/contact')) {
      const cfTurnstileToken = request.headers.get('cf-turnstile-response');
      if (!cfTurnstileToken && process.env.TURNSTILE_SECRET_KEY) {
        return NextResponse.json(
          { error: 'Turnstile verification required', code: 'TURNSTILE_REQUIRED' },
          { status: 403 }
        );
      }
    }
  }

  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
