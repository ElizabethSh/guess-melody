import { NameSpace } from '../../settings';
import { State } from '../../types/state';

// game process
export const selectStep = (state: State) => state[NameSpace.Game].step;
export const selectMistakeCount = (state: State) =>
  state[NameSpace.Game].mistakes;
