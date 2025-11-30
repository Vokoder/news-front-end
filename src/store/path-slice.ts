import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type PathState = {
  path: string;
};

const initialState: PathState = { path: '' };

const pathSlice = createSlice({
  name: 'path',
  initialState,
  reducers: {
    setPath(state, action: PayloadAction<string>) {
      state.path = action.payload;
    },
  },
});

export const { setPath } = pathSlice.actions;
export const pathReducer = pathSlice.reducer;
export const selectPath = (state: RootState) => state.path.path;
