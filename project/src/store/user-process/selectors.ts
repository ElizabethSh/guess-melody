import { State } from'../../types/state';

export const selectAuthorizationStatus = (state: State) => state.authorizationStatus;
