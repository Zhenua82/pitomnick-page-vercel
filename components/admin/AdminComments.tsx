import React, { useEffect, useState } from "react";
import styles from "./AdminComments.module.css";

type Comment = {
  id: string;
  author: string;
  text: string;
  approved: boolean;
  created_at: string;
};

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/admin/comments");
        const data = await res.json();

        if (!cancelled) {
          setComments(data);
        }
      } catch (e) {
        // лог при необходимости
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleApprove = async (id: string, approved: boolean) => {
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved })
    });

    setLoading(true);
    const res = await fetch("/api/admin/comments");
    setComments(await res.json());
    setLoading(false);
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Удалить комментарий?")) return;

    await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });

    setLoading(true);
    const res = await fetch("/api/admin/comments");
    setComments(await res.json());
    setLoading(false);
  };

  if (loading) {
    return <p className={styles.loading}>Загрузка…</p>;
  }

  if (comments.length === 0) {
    return <p className={styles.empty}>Комментариев нет</p>;
  }

  return (
    <div className={styles.list}>
      {comments.map((comment) => (
        <div key={comment.id} className={`${styles.item} ${comment.approved ? styles.approved : ""}`}>
          <div className={styles.header}>
            <strong>{comment.author}</strong>
            {comment.approved && (
              <span className={styles.badge}>Опубликован</span>
            )}
            <span>
              {new Date(comment.created_at).toLocaleString("ru-RU")}
            </span>
          </div>

          <p className={styles.text}>{comment.text}</p>

          <div className={styles.actions}>
            <button
              onClick={() => toggleApprove(comment.id, !comment.approved)}
            >
              {comment.approved
                ? "Снять с публикации"
                : "Опубликовать"}
            </button>

            <button
              className={styles.delete}
              onClick={() => deleteComment(comment.id)}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminComments;
