import { Button, Col, Empty, Modal, Pagination, Radio, Row, Select, Spin } from 'antd';
import styles from './news.module.css';
import { AlertMessage } from '../../modules/alert';
import { logOut, selectAlert, showAlert, useAppDispatch, useAppSelector } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import type { Article, ArticlesArray, Category } from '../../types/types';
import { deleteTokenCookie, getCookie } from '../../modules/cookies';
import { NewsItem } from './news-item';
import { getArticles, getCategories } from '../../modules/api-axios';
import { CreateArticleForm } from '../../components/article-modal/create-article-form';
import { useNavigate } from 'react-router';
import { SIGN_IN_PATH } from '../../constants/routes.constant';
import type { User } from '../../types/user.type';

const { Option } = Select;

export const News: React.FC = () => {
  const alert = useAppSelector(selectAlert);
  const [isCreateOpen, setCreateOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sort, setSort] = useState<'createdAt:desc' | 'createdAt:asc'>('createdAt:desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const userCookie = getCookie('User');
  const [user, setUser] = useState<User | null>(userCookie ? (JSON.parse(userCookie) as User) : null);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data: ArticlesArray = await getArticles({
        pagination: {
          page,
          pageSize,
        },
        filters: { category: selectedCategory },
        sort,
      });
      setArticles((data.data as Article[]) ?? []);
      setTotal(data.meta?.pagination?.total ?? 0);
    } catch (err) {
      console.error('Failed to load articles', err);
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, selectedCategory, sort]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sort, pageSize]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles, page]);

  const handleCreate = () => {
    setCreateOpen(true);
  };

  const handleClose = () => {
    setCreateOpen(false);
  };

  const onCreated = (article: Article) => {
    setCreateOpen(false);
    setSelectedCategory(null);
    dispatch(showAlert({ type: 'success', message: `Новость с id ${article.id} создана` }));
  };

  const onOk = () => {
    dispatch(showAlert({ type: 'error', message: 'Изменения не сохранены' }));
    setCreateOpen(false);
  };

  const handleLogout = async () => {
    if (user) {
      deleteTokenCookie();
      dispatch(logOut());
      setUser(null);
    } else {
      navigate(SIGN_IN_PATH);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerWrapper}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2>Новости</h2>
          </Col>
          <Col>
            <Button style={{ marginRight: 8 }} onClick={handleCreate} type="primary">
              Создать новость
            </Button>
            <Button onClick={handleLogout}>{user ? user.username : 'Войти'}</Button>
          </Col>
        </Row>
      </div>

      <div className={styles.contentWrapper}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Категория</div>
              <Select
                style={{ width: '100%' }}
                placeholder="Все категории"
                allowClear
                value={selectedCategory ?? undefined}
                onChange={(val) => {
                  setSelectedCategory(val);
                }}
              >
                {(categories ?? []).map((c: Category) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Сортировка</div>
              <Radio.Group
                onChange={(e) => setSort(e.target.value)}
                value={sort}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Radio value="createdAt:desc">По дате (сначала новые)</Radio>
                <Radio value="createdAt:asc">По дате (сначала старые)</Radio>
              </Radio.Group>
            </div>
          </Col>

          <Col xs={24} sm={24} md={18} lg={18}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : articles.length === 0 ? (
              <Empty description="Новостей не найдено" />
            ) : (
              <>
                {articles.map((a) => (
                  <NewsItem key={a.id} article={a} />
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <div>
                    Страница <strong>{page}</strong> из <strong>{Math.ceil(total / pageSize) || 1}</strong>, всего{' '}
                    <strong>{total}</strong>
                  </div>

                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onShowSizeChange={(_, size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                    onChange={(p) => setPage(p)}
                    showTotal={(t) => `Всего: ${t}`}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>

      <Modal open={isCreateOpen} onCancel={handleClose} onOk={onOk} title="Create article">
        <CreateArticleForm onClose={handleClose} onCreated={onCreated} categories={categories} />
      </Modal>

      {alert && (
        <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
          <AlertMessage />
        </div>
      )}
    </div>
  );
};
