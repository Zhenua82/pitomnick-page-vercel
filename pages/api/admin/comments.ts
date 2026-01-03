import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

import { checkAdminAuth } from "@/lib/checkAdminAuth";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ==================================================
  // GET — получить комментарии
  // ==================================================
  if (req.method === "GET") {
    const { approved } = req.query;

    const query = supabaseServer
      .from("comments")
      .select("id, author, text, approved, created_at")
      .order("created_at", { ascending: false });

    // ?approved=true / false
    if (approved === "true") {
      query.eq("approved", true);
    }
    if (approved === "false") {
      query.eq("approved", false);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: "Ошибка загрузки комментариев" });
    }

    return res.status(200).json(data);
  }

  // ==================================================
  // POST — создать комментарий (пользователь)
  // ==================================================
  if (req.method === "POST") {
    
    const { author, text } = req.body;
    if (!text || text.trim().length < 3) {
      return res.status(400).json({ message: "Комментарий слишком короткий" });
    }

    const { error } = await supabaseServer.from("comments").insert({
      author: author?.trim() || "Аноним",
      text: text.trim(),
      approved: false
    });

    if (error) {
      return res.status(500).json({ message: "Ошибка сохранения комментария" });
    }

    return res
      .status(200)
      .json({ message: "Комментарий отправлен на модерацию" });
  }

  // ==================================================
  // PATCH — изменить статус публикации (админ)
  // ==================================================
  if (req.method === "PATCH") {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { id, approved } = req.body;

    if (!id || typeof approved !== "boolean") {
      return res.status(400).json({ message: "Некорректные данные" });
    }

    const { error } = await supabaseServer
      .from("comments")
      .update({ approved })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Ошибка обновления комментария" });
    }

    return res.status(200).json({ message: "Статус обновлён" });
  }

  // ==================================================
  // DELETE — удалить комментарий (админ)
  // ==================================================
  if (req.method === "DELETE") {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Не указан id" });
    }

    const { error } = await supabaseServer
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Ошибка удаления" });
    }

    return res.status(200).json({ message: "Комментарий удалён" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
