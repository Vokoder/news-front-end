export interface Article {
  id: number,
  title?: string,
  slug?: string,
  createdAt?: string,
  updatedAt?: string,
  publishedAt?: string,
  excerpt?: string,
  content?: string,
  readingTime?: number,
  views?: number,
  isEdited?: boolean,
  author?: Author,
  category?: Category,
}

export interface ArticlesArray {
  data?: Article[]
  meta?: {
    pagination?: {
      page?: number,
      pageSize?: number,
      total?: number,
      pageCount?: number
    }
  }
}

export interface Author {
  id?: number,
  username?: string,
  email?: string
}

export interface Category {
  id?: number,
  name?: string,
  slug?: string,
}

export interface PaginationQuery {
  pagination?: {
    page?: string | number;
    pageSize?: string | number;
  };
  filters?: Record<string, unknown>;
  sort?: string | string[];
  populate?: unknown;
}

export interface CreateArticleDto {
  title: string;
  category?: number | null;
  excerpt: string;
  content: string;
}