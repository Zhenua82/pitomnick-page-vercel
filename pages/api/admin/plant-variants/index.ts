// POST — добавить вариант
import { supabaseServer } from "@/lib/supabaseServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies["admin-auth"] !== "true") {
    return res.status(401).end();
  }

  if (req.method === "POST") {
    const { plant_id, age, photo, price } = req.body;

    const { error } = await supabaseServer
      .from("plant_variants")
      .insert({ plant_id, age, photo, price });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).end();
  }

  res.status(405).end();
}
