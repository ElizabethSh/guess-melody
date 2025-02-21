import { NameSpace } from '../../settings';
import { State } from '../../types/state';

// game data
export const selectQuestions = (state: State) => state[NameSpace.Data].questions;
export const selectLoadedDataStatus = (state: State) => state[NameSpace.Data].isDataLoaded;

// game process
export const selectStep = (state: State) => state[NameSpace.Game].step;
export const selectMistakeCount = (state: State) => state[NameSpace.Game].mistakes;
