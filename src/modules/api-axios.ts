import axios from 'axios';
import { getCookie } from './cookies';
import {
  SERVER_ADRESS,
  SERVER_CATEGORIES_ADRESS,
  SERVER_CREATE_ARTICLE_ADRESS,
  SERVER_DELETE_ARTICLE_ADRESS,
  SERVER_EDIT_ARTICLE_ADRESS,
  SERVER_GET_ARTICLE_ADRESS,
  SERVER_GET_ROLE_ADRESS,
} from '../constants/env';
import { HttpError } from './http-error';
import { AXIOS_ERROR } from '../constants/errors.constant';
import type { Article, ArticlesArray, Category, CreateArticleDto, PaginationQuery } from '../types/types';
import qs from 'qs';

export const attachAuthHeader = () => {
  const token = getCookie('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getArticles = async (filter: PaginationQuery = {}): Promise<ArticlesArray> => {
  try {
    attachAuthHeader();
    const params = { ...filter };
    const res = await axios.get(`${SERVER_ADRESS}${SERVER_CREATE_ARTICLE_ADRESS}`, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { encode: false, arrayFormat: 'brackets', skipNulls: true }),
    });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data as ArticlesArray;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const getArticle = async (id: number): Promise<Article> => {
  try {
    attachAuthHeader();
    const res = await axios.get(`${SERVER_ADRESS}${SERVER_GET_ARTICLE_ADRESS}${id}`);
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const createArticle = async (data: CreateArticleDto): Promise<Article> => {
  try {
    attachAuthHeader();
    const res = await axios.post(`${SERVER_ADRESS}${SERVER_CREATE_ARTICLE_ADRESS}`, { data: data });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const editArticle = async (id: number, data: CreateArticleDto): Promise<Article> => {
  try {
    attachAuthHeader();
    const res = await axios.put(`${SERVER_ADRESS}${SERVER_EDIT_ARTICLE_ADRESS}${id}`, { data });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const deleteArticle = async (id: number): Promise<boolean> => {
  try {
    attachAuthHeader();
    const res = await axios.delete(`${SERVER_ADRESS}${SERVER_DELETE_ARTICLE_ADRESS}${id}`);
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return true;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    attachAuthHeader();
    const res = await axios.get(`${SERVER_ADRESS}${SERVER_CATEGORIES_ADRESS}`);
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data.data as Category[];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};

export const getRole = async (id: number | string): Promise<string> => {
  try {
    attachAuthHeader();
    const res = await axios.get(`${SERVER_ADRESS}${SERVER_GET_ROLE_ADRESS}${id}`, { params: { populate: 'role' } });
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data.role.name;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
};
