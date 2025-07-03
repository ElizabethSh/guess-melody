const LOCALSTORAGE_AUTH_TOKEN = 'guess-melody-auth-token';

export type Token = string | undefined;

const isLocalStorageAvailable = (): boolean =>
  typeof window !== 'undefined' && !!window.localStorage;

export const getToken = (): Token => {
  try {
    if (
      isLocalStorageAvailable() &&
      typeof window.localStorage.getItem === 'function'
    ) {
      const token = localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN);
      return token ? JSON.parse(token) : undefined;
    }
  } catch {
    return undefined;
  }
};

export const setToken = (token: Token): void => {
  try {
    if (
      isLocalStorageAvailable() &&
      typeof window.localStorage.setItem === 'function'
    ) {
      localStorage.setItem(LOCALSTORAGE_AUTH_TOKEN, JSON.stringify(token));
    }
    // eslint-disable-next-line no-empty
  } catch {}
};

export const dropToken = (): void => {
  try {
    if (
      isLocalStorageAvailable() &&
      typeof window.localStorage.removeItem === 'function'
    ) {
      localStorage.removeItem(LOCALSTORAGE_AUTH_TOKEN);
    }
    // eslint-disable-next-line no-empty
  } catch {}
};
