import axios from 'axios';
import type { UserJWT } from '../types/user.type';
import { HttpError } from './http-error';
import { AXIOS_ERROR } from '../constants/errors.constant';
import { setTokenCookie } from './cookies';
import { SERVER_ADRESS, SERVER_LOGIN_ADRESS, SERVER_REGISTER_ADRESS } from '../constants/env';

export const sendRequest = async (identifier: string, password: string, register: boolean): Promise<UserJWT | HttpError> => {
  try {
    axios.defaults.headers.common['Authorization'] = '';
    const res = await axios.post(
      `${SERVER_ADRESS}${register ? SERVER_REGISTER_ADRESS : SERVER_LOGIN_ADRESS}`,
      {
        identifier: register ? undefined : identifier,
        email: register ? identifier : undefined,
        username: register ? identifier.split('@')[0] : undefined,
        password
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    if (res.status !== 200) return new HttpError(res.status, res.data);

    const jwt = res.data?.jwt;
    if (!jwt) return new HttpError(500, 'JWT ticken is missing');
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
