import React, { useState } from "react";
import styles from "./CommentForm.module.css";

const CommentForm: React.FC = () => {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text })
      });

      if (!res.ok) throw new Error();

      setAuthor("");
      setText("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <h3>Оставить комментарий</h3>

      <input
        type="text"
        placeholder="Ваше имя (необязательно)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <textarea
        placeholder="Ваш комментарий"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <button type="submit" disabled={status === "loading"}>
        Отправить
      </button>

      {status === "success" && (
        <p className={styles.success}>Комментарий отправлен и ожидает модерации</p>
      )}

      {status === "error" && (
        <p className={styles.error}>Ошибка отправки комментария</p>
      )}
    </form>
  );
};

export default CommentForm;