import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        age,
        photo,
        price
      )
    `)
    .order("title");

  if (error) {
    return res.status(500).json({ message: "Ошибка загрузки растений" });
  }

  return res.status(200).json(data);
}
