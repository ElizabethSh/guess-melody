/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
const LOCALSTORAGE_AUTH_TOKEN = 'guess-melody-auth-token';

export type Token = string;

export const getToken = (): Token => {
  let token = '';
  try {
    if (
      window.localStorage &&
      typeof window.localStorage.getItem === 'function'
    ) {
      token = localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN) || '';
    }
  } catch {}
  return token;
};

export const setToken = (token: Token): void => {
  try {
    if (
      window.localStorage &&
      typeof window.localStorage.setItem === 'function'
    ) {
      localStorage.setItem(LOCALSTORAGE_AUTH_TOKEN, token);
    }
  } catch {}
};

export const dropToken = (): void => {
  try {
    if (
      window.localStorage &&
      typeof window.localStorage.removeItem === 'function'
    ) {
      localStorage.removeItem(LOCALSTORAGE_AUTH_TOKEN);
    }
  } catch {}
};
