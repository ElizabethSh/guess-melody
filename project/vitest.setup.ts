import { webcrypto } from 'crypto';

import '@testing-library/jest-dom/vitest';

if (!global.crypto) {
  global.crypto = webcrypto as Crypto;
}
