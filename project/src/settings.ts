export enum ApiRoute {
  Login = '/login',
  Logout = '/logout',
  Questions = '/questions',
}

export enum AppRoute {
  Game = '/game',
  Login = '/login',
  Lose = '/lose',
  Result = '/result',
  Root = '/',
}

export enum AuthorizationStatus {
  Auth = 'auth',
  NoAuth = 'no-auth',
  Unknown = 'unknown'
}

export enum GameType {
  Artist = 'artist',
  Genre = 'genre'
}

export enum NameSpace {
  Data = 'DATA',
  Game = 'GAME',
  User = 'USER',
}

export const FIRST_GAME_STEP = 0;
export const MAX_ERRORS_COUNT = 3;
export const CLEAR_MESSAGE_TIMEOUT = 2000;
