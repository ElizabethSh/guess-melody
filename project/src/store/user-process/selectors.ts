import { NameSpace } from '../../settings';
import { State } from'../../types/state';

export const selectAuthorizationStatus = (state: State) => state[NameSpace.User].authorizationStatus;
