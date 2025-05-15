const LOCALSTORAGE_AUTH_TOKEN = 'guess-melody-auth-token';

export type Token = string;

export const getToken = (): Token => {
  let token = '';
  try {
    if (global.localStorage && (typeof global.localStorage.getItem) === 'function') {
      token = localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN) || '';
    }
  } catch (err) {}
  return token;
};

export const setToken = (token: Token): void => {
  try {
    if (global.localStorage && (typeof global.localStorage.setItem) === 'function') {
      localStorage.setItem(LOCALSTORAGE_AUTH_TOKEN, token);
    }
  } catch (err) {}
};

export const dropToken = (): void => {
  try {
    if (global.localStorage && (typeof global.localStorage.removeItem) === 'function') {
      localStorage.removeItem(LOCALSTORAGE_AUTH_TOKEN);
    }
  } catch (err) {}
};
