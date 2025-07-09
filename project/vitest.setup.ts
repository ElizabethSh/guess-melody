import { webcrypto } from 'crypto';
import { vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

// Make vi globally available
global.vi = vi;

if (!global.crypto) {
  global.crypto = webcrypto as Crypto;
}
