const LOCALSTORAGE_AUTH_TOKEN = 'auth-token';

export type Token = string;

export const getToken = (): Token => {
  let token = '';
  try {
    if (global.localStorage && (typeof global.localStorage.getItem) === 'function') {
      token = JSON.parse(localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN) || '');
    }

  /* eslint-disable-next-line */
  } catch (err) {}
  return token;
};

export const setToken = (token: Token) => {
  try {
    if (global.localStorage && (typeof global.localStorage.setItem) === 'function') {
      localStorage.setItem(LOCALSTORAGE_AUTH_TOKEN, token);
    }
  /* eslint-disable-next-line */
  } catch (err) {}
};
