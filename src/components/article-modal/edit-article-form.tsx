import React, { useEffect, useState } from 'react';
import type { Article, Category, CreateArticleDto } from '../../types/types';
import { editArticle } from '../../modules/api-axios';

interface Props {
  article: Article;
  onClose: () => void;
  onUpdated?: (article: Article) => void;
  categories?: Category[];
}

export const EditArticleForm: React.FC<Props> = ({ article, onClose, onUpdated, categories }) => {
  const [title, setTitle] = useState(article.title ?? '');
  const [categoryId, setCategoryId] = useState<number | ''>(article.category?.id ?? '');
  const [excerpt, setExcerpt] = useState(article.excerpt ?? '');
  const [content, setContent] = useState(article.content ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(article.title ?? '');
    setCategoryId(article.category?.id ?? '');
    setExcerpt(article.excerpt ?? '');
    setContent(article.content ?? '');
  }, [article]);

  const validate = (): string | null => {
    if (!title.trim()) return 'Title is required';
    if (!excerpt.trim()) return 'Excerpt is required';
    if (!content.trim()) return 'Content is required';
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    const payload: CreateArticleDto = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: categoryId === '' ? null : Number(categoryId),
    };

    setLoading(true);
    try {
      const updated = await editArticle(article.id, payload);
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <label>
        Title
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        Category (optional)
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
        >
          <option value="">— none —</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      <label>
        Excerpt
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Short excerpt"
          rows={3}
          style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        Content
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Full content"
          rows={8}
          style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditArticleForm;
