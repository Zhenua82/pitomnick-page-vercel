// pages/api/admin/plants/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.cookies["admin-auth"] !== "true") {
    return res.status(401).end();
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, slug, opisanie, podrobnoe_opisanie1, podrobnoe_opisanie2 } =
      req.body;

    const { error } = await supabaseServer
      .from("plants")
      .update({
        title,
        slug,
        opisanie,
        podrobnoe_opisanie1,
        podrobnoe_opisanie2,
      })
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.end();
  }

  if (req.method === "DELETE") {
    await supabaseServer.from("plant_variants").delete().eq("plant_id", id);
    await supabaseServer.from("plants").delete().eq("id", id);

    return res.end();
  }

  res.status(405).end();
}
