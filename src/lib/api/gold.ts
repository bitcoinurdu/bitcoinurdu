export interface GoldRates {
  gold_24k_per_oz: number;
  gold_22k_per_oz: number;
  gold_21k_per_oz: number;
  gold_18k_per_oz: number;
  gold_per_gram_24k: number;
  silver_per_oz: number;
  silver_per_gram: number;
  lastUpdated: string;
}

const DEFAULT_GOLD: GoldRates = {
  gold_24k_per_oz: 2650,
  gold_22k_per_oz: 2430,
  gold_21k_per_oz: 2319,
  gold_18k_per_oz: 1988,
  gold_per_gram_24k: 85.20,
  silver_per_oz: 30.50,
  silver_per_gram: 0.98,
  lastUpdated: new Date().toISOString(),
};

export async function fetchGoldRates(): Promise<GoldRates> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY || '',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`GoldAPI returned ${response.status}`);

    const data = await response.json();
    const goldPerOz = data.price || DEFAULT_GOLD.gold_24k_per_oz;
    const silverResponse = await fetch('https://www.goldapi.io/api/XAG/USD', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY || '',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    const silverData = silverResponse.ok ? await silverResponse.json() : null;
    const silverPerOz = silverData?.price || DEFAULT_GOLD.silver_per_oz;

    return {
      gold_24k_per_oz: goldPerOz,
      gold_22k_per_oz: goldPerOz * 0.9167,
      gold_21k_per_oz: goldPerOz * 0.875,
      gold_18k_per_oz: goldPerOz * 0.75,
      gold_per_gram_24k: goldPerOz / 31.1035,
      silver_per_oz: silverPerOz,
      silver_per_gram: silverPerOz / 31.1035,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return DEFAULT_GOLD;
  }
}
