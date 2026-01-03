import { randomBytes } from 'node:crypto';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const generateReferenceNumber = (): string => {
  const bytes = randomBytes(6);
  let result = '';
  for (const byte of bytes) {
    result += ALPHABET[byte % 62];
  }
  return result;
};
