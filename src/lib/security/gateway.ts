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

export function sanitizeInput(input: string): string {
  let sanitized = input;
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

export function inspectPayload(payload: string): { safe: boolean; threat: string | null } {
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

export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const inspection = inspectPayload(value);
      if (!inspection.safe) {
        throw new Error(`Security violation: ${inspection.threat} detected in field "${key}"`);
      }
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly threshold: number;
  private readonly timeout: number;

  constructor(threshold = 5, timeout = 30000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        console.warn('[CircuitBreaker] Open circuit, using fallback');
        return fallback();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      console.error('[CircuitBreaker] Failure, using fallback:', err);
      return fallback();
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState() {
    return this.state;
  }

  reset() {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

export const dbCircuitBreaker = new CircuitBreaker(3, 15000);
export const apiCircuitBreaker = new CircuitBreaker(3, 10000);
