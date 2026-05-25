interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIProvider {
  name: string;
  endpoint: string;
  model: string;
  apiKey?: string;
  maxTokens: number;
}

const PROVIDERS: Record<string, AIProvider> = {
  gpt: {
    name: 'OpenAI GPT',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY,
    maxTokens: 4096,
  },
  gemini: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    apiKey: process.env.GOOGLE_AI_API_KEY,
    maxTokens: 4096,
  },
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    maxTokens: 4096,
  },
  perplexity: {
    name: 'Perplexity',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3.1-sonar-small-128k-online',
    apiKey: process.env.PERPLEXITY_API_KEY,
    maxTokens: 4096,
  },
};

const CRYPTO_SYSTEM_PROMPT = `You are CryptoUrdu AI, an expert cryptocurrency assistant. You provide accurate, helpful information about Bitcoin, cryptocurrency, blockchain, DeFi, trading, airdrops, and related topics. Always be clear, concise, and educational. If you're unsure about something, say so. Never give financial advice - always include a disclaimer that users should do their own research.`;

export async function chatWithAI(
  provider: string,
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const config = PROVIDERS[provider];
  if (!config) throw new Error(`Unknown AI provider: ${provider}`);
  if (!config.apiKey) throw new Error(`API key not configured for ${provider}`);

  const allMessages = [
    { role: 'system' as const, content: systemPrompt || CRYPTO_SYSTEM_PROMPT },
    ...messages,
  ];

  switch (provider) {
    case 'gpt':
      return chatWithOpenAI(config, allMessages);
    case 'gemini':
      return chatWithGemini(config, messages);
    case 'deepseek':
      return chatWithDeepSeek(config, allMessages);
    case 'perplexity':
      return chatWithPerplexity(config, allMessages);
    default:
      throw new Error(`Provider ${provider} not implemented`);
  }
}

async function chatWithOpenAI(
  config: AIProvider,
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function chatWithGemini(
  config: AIProvider,
  messages: ChatMessage[]
): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  const response = await fetch(
    `${config.endpoint}?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: lastMessage.content }],
          },
        ],
        generationConfig: {
          maxOutputTokens: config.maxTokens,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function chatWithDeepSeek(
  config: AIProvider,
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function chatWithPerplexity(
  config: AIProvider,
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function getAvailableProviders(): string[] {
  return Object.keys(PROVIDERS).filter(
    (key) => PROVIDERS[key].apiKey
  );
}

export { PROVIDERS, CRYPTO_SYSTEM_PROMPT };
