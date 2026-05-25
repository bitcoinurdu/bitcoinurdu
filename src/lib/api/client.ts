import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 15000;

interface RetryConfig {
  retries?: number;
  retryDelay?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey?: string;
  private headerKey?: string;

  constructor(baseUrl: string, apiKey?: string, headerKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.headerKey = headerKey || 'x-cg-demo-key';
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.apiKey && this.headerKey) {
        config.headers[this.headerKey] = this.apiKey;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 5;
          error.retryAfter = parseInt(retryAfter) * 1000;
        }
        return Promise.reject(error);
      }
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig?: RetryConfig
  ): Promise<T> {
    const retries = retryConfig?.retries ?? MAX_RETRIES;
    const delay = retryConfig?.retryDelay ?? RETRY_DELAY;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number }; retryAfter?: number };
        const status = axiosError.response?.status;

        if (attempt === retries) throw error;

        if (status === 429) {
          const waitTime = axiosError.retryAfter || delay * (attempt + 1);
          await this.sleep(waitTime);
        } else if (status && status >= 500) {
          await this.sleep(delay * Math.pow(2, attempt));
        } else if (status === 404 || status === 401 || status === 403) {
          throw error;
        } else {
          await this.sleep(delay);
        }
      }
    }

    throw new Error('Max retries exceeded');
  }

  async post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }
}

export default ApiClient;

export function createApiClient(baseUrl: string, apiKey?: string, headerKey?: string) {
  return new ApiClient(baseUrl, apiKey, headerKey);
}

export let coingeckoClient = new ApiClient(
  'https://api.coingecko.com/api/v3',
  undefined,
  'x-cg-demo-key'
);

export let binanceClient = new ApiClient(
  'https://api.binance.com/api/v3'
);

export let dexscreenerClient = new ApiClient(
  'https://api.dexscreener.com/latest'
);

export let defillamaClient = new ApiClient(
  'https://api.llama.fi'
);

// JSONBin client removed - all CMS operations now use /api/settings

export function updateApiClients(config: Record<string, { enabled: boolean; baseUrl: string; apiKey?: string; headerKey?: string }>) {
  if (config.coingecko?.enabled) {
    coingeckoClient = new ApiClient(config.coingecko.baseUrl, config.coingecko.apiKey, config.coingecko.headerKey || 'x-cg-demo-key');
  }
  if (config.binance?.enabled) {
    binanceClient = new ApiClient(config.binance.baseUrl, config.binance.apiKey);
  }
  if (config.dexscreener?.enabled) {
    dexscreenerClient = new ApiClient(config.dexscreener.baseUrl);
  }
  if (config.defillama?.enabled) {
    defillamaClient = new ApiClient(config.defillama.baseUrl);
  }
  // JSONBin config removed - migrated to unified settings engine
}

export const DEFAULT_API_CONFIG: Record<string, { enabled: boolean; baseUrl: string; apiKey?: string; headerKey?: string; description: string }> = {
  coingecko: {
    enabled: true,
    baseUrl: 'https://api.coingecko.com/api/v3',
    headerKey: 'x-cg-demo-key',
    description: 'Coin prices, market data, coin details',
  },
  binance: {
    enabled: true,
    baseUrl: 'https://api.binance.com/api/v3',
    description: 'Binance exchange data',
  },
  dexscreener: {
    enabled: true,
    baseUrl: 'https://api.dexscreener.com/latest',
    description: 'DEX token prices and pairs',
  },
  defillama: {
    enabled: true,
    baseUrl: 'https://api.llama.fi',
    description: 'DeFi TVL and protocol data',
  },
};
