import axios from "axios";
import { getCookie } from "./cookies";
import { SERVER_ADRESS, SERVER_CREATE_ARTICLE_ADRESS, SERVER_EDIT_ARTICLE_ADRESS } from "../constants/env";
import { HttpError } from "./http-error";
import { AXIOS_ERROR } from "../constants/errors.constant";
import type { Article, CreateArticleDto } from "../types/types";

export const attachAuthHeader = () => {
  const token = getCookie('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export const createArticle = async (data: CreateArticleDto): Promise<Article> => {
  try {
    attachAuthHeader();
    const res = await axios.post(
      `${SERVER_ADRESS}${SERVER_CREATE_ARTICLE_ADRESS}`,
      { data: data },
    )
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
}

export const editArticle = async (id: number, data: CreateArticleDto): Promise<Article> => {
  try {
    attachAuthHeader();
    const res = await axios.put(
      `${SERVER_ADRESS}${SERVER_EDIT_ARTICLE_ADRESS}${id}`,
      { data },
    )
    if (res.status !== 200) throw new HttpError(res.status, res.data);
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new HttpError(e.status, e.message);
    }
    throw new HttpError(500, (e as Error)?.message ?? AXIOS_ERROR);
  }
}
