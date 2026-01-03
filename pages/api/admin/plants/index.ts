// pages/api/admin/plants/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.cookies["admin-auth"] !== "true") {
    return res.status(401).end();
  }

  // Получить все растения
  if (req.method === "GET") {
    const { data, error } = await supabaseServer
      .from("plants")
      .select(`
        id,
        slug,
        title,
        opisanie,
        podrobnoe_opisanie1,
        podrobnoe_opisanie2,
        plant_variants (
          id,
          age,
          photo,
          price
        )
      `)
      .order("title");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  }

  // Добавить новое растение
  if (req.method === "POST") {
    const { slug, title } = req.body;

    const { error } = await supabaseServer
      .from("plants")
      .insert({
        slug,
        title,
        opisanie: "",
        podrobnoe_opisanie1: "",
        podrobnoe_opisanie2: "",
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).end();
  }

  res.status(405).end();
}
