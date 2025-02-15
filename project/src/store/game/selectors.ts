import { State } from '../../types/state';

export const selectQuestions = (state: State) => state.questions;
export const selectLoadedDataStatus = (state: State) => state.isDataLoaded;
