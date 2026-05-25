export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, locale: 'en-US' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 278.50, locale: 'ur-PK' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, locale: 'en-GB' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67, locale: 'ar-AE' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 3.75, locale: 'ar-SA' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.50, locale: 'hi-IN' },
];

export const DEFAULT_CURRENCY = 'USD';

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  PKR: 278.50,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  INR: 83.50,
};

let dynamicRates: Record<string, number> | null = null;
let ratesFetchedAt = 0;
const RATES_CACHE_TTL = 300000; // 5 minutes

async function fetchDynamicRates(): Promise<Record<string, number>> {
  if (dynamicRates && Date.now() - ratesFetchedAt < RATES_CACHE_TTL) {
    return dynamicRates;
  }

  try {
    const res = await fetch('/api/rates');
    if (res.ok) {
      const data = await res.json();
      if (data.fiat?.rates) {
        dynamicRates = data.fiat.rates;
        ratesFetchedAt = Date.now();
        return dynamicRates || FALLBACK_RATES;
      }
    }
  } catch {
    // Fallback to hardcoded rates
  }

  dynamicRates = FALLBACK_RATES;
  ratesFetchedAt = Date.now();
  return FALLBACK_RATES;
}

export async function getLiveRates(): Promise<Record<string, number>> {
  return fetchDynamicRates();
}

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const rates = dynamicRates || FALLBACK_RATES;
  const fromRate = rates[from] || FALLBACK_RATES[from] || 1;
  const toRate = rates[to] || FALLBACK_RATES[to] || 1;
  return (amount / fromRate) * toRate;
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol || '$';
}

export function getCurrencyLocale(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.locale || 'en-US';
}

export async function refreshRates(): Promise<void> {
  dynamicRates = null;
  await fetchDynamicRates();
}
