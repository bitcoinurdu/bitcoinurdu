export interface FiatRates {
  usd_pkr: number;
  usd_eur: number;
  usd_gbp: number;
  usd_aed: number;
  usd_sar: number;
  lastUpdated: string;
}

const DEFAULT_FIAT: FiatRates = {
  usd_pkr: 278,
  usd_eur: 0.92,
  usd_gbp: 0.79,
  usd_aed: 3.6725,
  usd_sar: 3.75,
  lastUpdated: new Date().toISOString(),
};

const FALLBACK_RATES: Record<string, FiatRates> = {
  'exchangerate-api': { usd_pkr: 278, usd_eur: 0.92, usd_gbp: 0.79, usd_aed: 3.6725, usd_sar: 3.75, lastUpdated: '' },
  'openrates': { usd_pkr: 278, usd_eur: 0.92, usd_gbp: 0.79, usd_aed: 3.6725, usd_sar: 3.75, lastUpdated: '' },
};

export async function fetchFiatRates(): Promise<FiatRates> {
  const providers = [
    {
      name: 'exchangerate-api',
      fetch: async () => {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`exchangerate-api: ${res.status}`);
        const data = await res.json();
        return {
          usd_pkr: data.rates?.PKR || DEFAULT_FIAT.usd_pkr,
          usd_eur: data.rates?.EUR || DEFAULT_FIAT.usd_eur,
          usd_gbp: data.rates?.GBP || DEFAULT_FIAT.usd_gbp,
          usd_aed: data.rates?.AED || DEFAULT_FIAT.usd_aed,
          usd_sar: data.rates?.SAR || DEFAULT_FIAT.usd_sar,
          lastUpdated: new Date().toISOString(),
        };
      },
    },
    {
      name: 'openrates',
      fetch: async () => {
        const res = await fetch('https://open.er-api.com/v6/latest/USD', {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`openrates: ${res.status}`);
        const data = await res.json();
        return {
          usd_pkr: data.rates?.PKR || DEFAULT_FIAT.usd_pkr,
          usd_eur: data.rates?.EUR || DEFAULT_FIAT.usd_eur,
          usd_gbp: data.rates?.GBP || DEFAULT_FIAT.usd_gbp,
          usd_aed: data.rates?.AED || DEFAULT_FIAT.usd_aed,
          usd_sar: data.rates?.SAR || DEFAULT_FIAT.usd_sar,
          lastUpdated: new Date().toISOString(),
        };
      },
    },
  ];

  for (const provider of providers) {
    try {
      const rates = await provider.fetch();
      return rates;
    } catch (err) {
      console.warn(`Fiat provider ${provider.name} failed:`, err);
    }
  }

  return DEFAULT_FIAT;
}
