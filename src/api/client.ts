import axios, { AxiosInstance, AxiosError } from 'axios';
import { getApiKey } from '../auth/index.js';
import chalk from 'chalk';

const BASE_URL = 'https://api.iterable.com';

let clientInstance: AxiosInstance | null = null;

export class IterableApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'IterableApiError';
  }
}

export async function getClient(): Promise<AxiosInstance> {
  if (clientInstance) {
    return clientInstance;
  }

  const apiKey = await getApiKey();

  if (!apiKey) {
    console.error(chalk.red('Error: No API key found.'));
    console.error(chalk.yellow('Run `iterable auth login` to configure your API key.'));
    console.error(chalk.yellow('Or set the ITERABLE_API_KEY environment variable.'));
    process.exit(1);
  }

  clientInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Response interceptor for error handling
  clientInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ msg?: string; code?: string }>) => {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.msg || error.message;
        const code = data?.code;

        if (status === 401) {
          throw new IterableApiError('Invalid API key. Run `iterable auth login` to reconfigure.', status, code);
        }
        if (status === 429) {
          throw new IterableApiError('Rate limit exceeded. Please wait and try again.', status, code);
        }
        if (status === 404) {
          throw new IterableApiError(`Resource not found: ${message}`, status, code);
        }
        throw new IterableApiError(message, status, code);
      }
      if (error.code === 'ECONNABORTED') {
        throw new IterableApiError('Request timeout. Please try again.');
      }
      throw new IterableApiError(error.message);
    }
  );

  return clientInstance;
}

export function resetClient(): void {
  clientInstance = null;
}
