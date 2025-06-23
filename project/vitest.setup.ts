import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'crypto';

if (!global.crypto) {
  global.crypto = webcrypto as Crypto;
}
