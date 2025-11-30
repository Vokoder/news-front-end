import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserJWT } from '../types/user.type';
import type { RootState } from './store';
import { deleteCookie, getCookie, setCookie } from '../modules/cookies';

type UserState = {
  user: UserJWT | null;
};

const jwt = getCookie('token');
const user = getCookie('User');
const initialState: UserState = { user: jwt ? { jwt, user } as unknown as UserJWT : null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn(state, action: PayloadAction<UserJWT>) {
      setCookie('User', JSON.stringify(action.payload.user));
      state.user = action.payload;
    },
    logOut(state) {
      deleteCookie('User');
      state.user = null;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const selectUser = (state: RootState) => state.user.user;
