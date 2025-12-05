import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../store';
import type { Article, Category } from '../../types/types';
import { deleteArticle, getArticle, getCategories, getRole } from '../../modules/api-axios';
import { getCookie } from '../../modules/cookies';
import type { User } from '../../types/user.type';
import { Modal } from 'antd';
import EditArticleForm from '../../components/article-modal/edit-article-form';

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const userCookie = getCookie('User');
  const { id: userId } = userCookie ? (JSON.parse(userCookie) as User) : { id: null };

  const handleUpdate = () => {
    setCreateOpen(true);
  };

  const handleClose = () => {
    setCreateOpen(false);
  };

  const updateArticle = async () => {
    try {
      const article: Article = await getArticle(Number(id));
      if (!article) {
        setError('Article not found');
        setArticle(null);
      } else {
        setArticle(article);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const onUpdated = (article: Article) => {
    setCreateOpen(false);
    dispatch(showAlert({ type: 'success', message: `Новость с id ${article.id} изменена` }));
    updateArticle();
  };

  const onOk = () => {
    dispatch(showAlert({ type: 'error', message: 'Изменения не сохранены' }));
    setCreateOpen(false);
  };

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchArticle = async () => {
      try {
        const article: Article = await getArticle(Number(id));
        if (!mounted) return;
        if (!article) {
          setError('Article not found');
          setArticle(null);
        } else {
          setArticle(article);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load article');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchRole = async () => {
      if (!userId) return;
      try {
        const role = await getRole(userId);
        if (!mounted) return;
        setUserRole(role ?? null);
      } catch (err) {
        console.warn('Failed to fetch user role', err);
      }
    };

    fetchArticle();
    fetchRole();

    return () => {
      mounted = false;
    };
  }, [id, userId]);

  const canEditOrDelete = (() => {
    if (!article) return false;
    const authorId = article.author?.id;
    const isAuthor = userId && authorId && Number(userId) === Number(authorId);
    const isEditor = userRole === 'Editor';
    return Boolean(isAuthor || isEditor);
  })();

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Удалить эту новость? Это действие необратимо.')) return;
    try {
      await deleteArticle(Number(id));
      navigate('/');
    } catch (e) {
      console.error(e);
      dispatch(showAlert({ type: 'warning', message: 'Не удалось удалить статью' }));
    }
  };

  const handleEdit = () => {
    if (!article) return;
    handleUpdate();
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!article) return <div>Новость не найдена</div>;

  const published = article.createdAt ?? article.createdAt ?? null;
  const formattedDate = published ? new Date(published).toLocaleString() : '—';

  return (
    <article style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ padding: '6px 10px' }}>
          ← Назад
        </button>
      </div>

      <h1 style={{ marginBottom: 8 }}>{article.title}</h1>

      <div style={{ color: '#666', marginBottom: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span>Дата: {formattedDate}</span>
        <span>Категория: {article.category?.name ?? '—'}</span>
        <span>Автор: {article.author?.username ?? '—'}</span>
        <span>Чтение: {article.readingTime ?? '—'} мин</span>
        <span>Просмотры: {article.views ?? 0}</span>
      </div>

      {article.excerpt && <p style={{ fontStyle: 'italic', color: '#333' }}>{article.excerpt}</p>}

      <div style={{ marginTop: 16, lineHeight: 1.6 }}>
        {typeof article.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <pre>{JSON.stringify(article.content)}</pre>
        )}
      </div>

      {canEditOrDelete && (
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button onClick={handleEdit} style={{ padding: '8px 12px' }}>
            Изменить
          </button>
          <button onClick={handleDelete} style={{ padding: '8px 12px', background: '#c00', color: '#fff' }}>
            Удалить
          </button>
        </div>
      )}

      <Modal open={isCreateOpen} onCancel={handleClose} onOk={onOk} title="Create article">
        <EditArticleForm onClose={handleClose} onUpdated={onUpdated} categories={categories} article={article} />
      </Modal>
    </article>
  );
};

export default ArticleDetail;
