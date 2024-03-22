export enum ApiRoute {
  LOGIN = '/login',
  LOGOUT = '/logout',
  QUESTIONS = '/questions',
}

export enum AppRoute {
  GAME = '/game',
  LOGIN = '/login',
  LOSE = '/lose',
  RESULT = '/result',
  ROOT = '/',
}

export enum AuthorizationStatus {
  AUTH = 'auth',
  NO_AUTH = 'no-auth',
  UNKNOWN = 'unknown'
}

export enum GameType {
  ARTIST = 'artist',
  GENRE = 'genre'
}

export const FIRST_GAME_STEP = 0;
export const MAX_ERRORS_COUNT = 3;
