import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosInstance } from 'axios';

import { ApiRoute } from '../../settings'
import { Questions } from '../../types/question';
import { AppDispatch, State } from '../../types/state';
import { loadQuestions } from './game';


export const fetchQuestionAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchQuestions',
  async (_arg, {dispatch, extra: api}) => {
    const {data} = await api.get<Questions>(ApiRoute.QUESTIONS);
    console.log('data', data);

    dispatch(loadQuestions(data));
  },
);
