import axios from 'axios';
import type { UserJWT } from '../types/user.type';
import { HttpError } from './http-error';
import { AXIOS_ERROR } from '../constants/errors.constant';
import { setTokenCookie } from './cookies';
import { SERVER_ADRESS } from '../constants/env';

export const sendRequest = async (identifier: string, password: string, path: string): Promise<UserJWT | HttpError> => {
  try {
    axios.defaults.headers.common['Authorization'] = '';
    const res = await axios.post(
      `${SERVER_ADRESS}${path}`,
      { identifier, password },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    if (res.status !== 200) return new HttpError(res.status, res.data);

    const jwt = res.data?.jwt;
    if (!jwt) throw new HttpError(500, 'JWT ticken is missing');
    setTokenCookie(jwt);

    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    const { user } = res.data;

    return { jwt, user } as UserJWT;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return new HttpError(e.status, e.message);
    }
    return new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};
