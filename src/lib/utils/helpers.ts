import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PKR: '₨',
    AED: 'د.إ',
    SAR: '﷼',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    RUB: '₽',
    TRY: '₺',
    BNB: 'BNB',
    BTC: '₿',
    ETH: 'Ξ',
    SOL: '◎',
  };

  if (value >= 1e12) return `${symbols[currency] || ''}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${symbols[currency] || ''}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${symbols[currency] || ''}${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${symbols[currency] || ''}${(value / 1e3).toFixed(2)}K`;
  if (value < 0.01 && value > 0) return `${symbols[currency] || ''}${value.toFixed(8)}`;
  if (value < 1) return `${symbols[currency] || ''}${value.toFixed(4)}`;
  return `${symbols[currency] || ''}${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(decimals)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(decimals)}K`;
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function shortenUrl(url: string, maxLen: number = 30): string {
  if (!url) return '';
  const cleaned = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen)}...` : cleaned;
}

export function calculatePNL(
  buyPrice: number,
  currentPrice: number,
  quantity: number
): { pnl: number; pnlPercent: number } {
  const invested = buyPrice * quantity;
  const current = currentPrice * quantity;
  const pnl = current - invested;
  const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  return { pnl, pnlPercent };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getRiskColor(score: number): string {
  if (score <= 30) return 'text-crypto-green';
  if (score <= 60) return 'text-yellow-500';
  return 'text-crypto-red';
}

export function getRiskLabel(score: number): string {
  if (score <= 30) return 'Low Risk';
  if (score <= 60) return 'Medium Risk';
  return 'High Risk';
}

export function isValidWalletAddress(address: string, network?: string): boolean {
  if (!address) return false;
  const patterns: Record<string, RegExp> = {
    eth: /^0x[a-fA-F0-9]{40}$/,
    bsc: /^0x[a-fA-F0-9]{40}$/,
    sol: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    btc: /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/,
    trx: /^T[a-zA-HJ-NP-Z0-9]{33}$/,
    arb: /^0x[a-fA-F0-9]{40}$/,
    op: /^0x[a-fA-F0-9]{40}$/,
    base: /^0x[a-fA-F0-9]{40}$/,
    polygon: /^0x[a-fA-F0-9]{40}$/,
    zksync: /^0x[a-fA-F0-9]{40}$/,
  };

  if (network && patterns[network.toLowerCase()]) {
    return patterns[network.toLowerCase()].test(address);
  }

  return Object.values(patterns).some((pattern) => pattern.test(address));
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseSearchQuery(query: string): { term: string; filters: Record<string, string> } {
  const parts = query.split(' ');
  const filters: Record<string, string> = {};
  const termParts: string[] = [];

  for (const part of parts) {
    if (part.includes(':')) {
      const [key, value] = part.split(':');
      filters[key.toLowerCase()] = value;
    } else {
      termParts.push(part);
    }
  }

  return { term: termParts.join(' '), filters };
}

export function getSupplyPercent(
  circulating: number,
  max: number | null
): number | null {
  if (!max || max === 0) return null;
  return Math.min((circulating / max) * 100, 100);
}
