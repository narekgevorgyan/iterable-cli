import keytar from 'keytar';

const SERVICE_NAME = 'iterable-cli';
const ACCOUNT_NAME = 'api-key';

export async function getApiKey(): Promise<string | null> {
  // Priority 1: Environment variable
  if (process.env.ITERABLE_API_KEY) {
    return process.env.ITERABLE_API_KEY;
  }

  // Priority 2: OS Keychain
  try {
    const key = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    return key;
  } catch (error) {
    // Keytar not available (e.g., in CI environments)
    return null;
  }
}

export async function setApiKey(apiKey: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, apiKey);
}

export async function deleteApiKey(): Promise<boolean> {
  return await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return key !== null;
}
