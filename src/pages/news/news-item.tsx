import React from 'react';
import { Card, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { type Article } from '../../types/types';

type Props = {
  article: Article;
};

export const NewsItem: React.FC<Props> = ({ article }) => {
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—';
  return (
    <Card hoverable style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>
            <Link to={`${article.id}`}>{article.title}</Link>
          </h3>
          <div style={{ color: '#888', marginTop: 6 }}>
            <span style={{ marginRight: 12 }}>{date}</span>
            {article.category && <Tag color="blue">{article.category.name}</Tag>}
          </div>
          <p style={{ marginTop: 12 }}>{article.excerpt ?? article.content?.slice(0, 150) ?? ''}...</p>
        </div>
      </div>
    </Card>
  );
};
