import React, { useEffect, useState } from "react";
import styles from "./CommentList.module.css";

type Comment = {
  id: string;
  author: string;
  text: string;
  created_at: string;
};

const CommentList: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        // const res = await fetch("/api/comments");
        const res = await fetch("/api/admin/comments?approved=true");
        const data = await res.json();
        setComments(data);
      } catch {
        // можно логировать, но UI не ломаем
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Загрузка комментариев…</p>;
  }

  if (comments.length === 0) {
    return null; // если нет опубликованных — просто ничего не показываем
  }

  return (
    <section className={styles.wrapper}>
      <h3>Отзывы наших посетителей</h3>

      <ul className={styles.list}>
        {comments.map((comment) => (
          <li key={comment.id} className={styles.item}>
            <div className={styles.header}>
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.date}>
                {new Date(comment.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <p className={styles.text}>{comment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommentList;