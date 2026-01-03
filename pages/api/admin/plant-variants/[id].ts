import { supabaseServer } from "@/lib/supabaseServer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies["admin-auth"] !== "true") {
    return res.status(401).end();
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const { age, photo, price } = req.body;

    await supabaseServer
      .from("plant_variants")
      .update({ age, photo, price })
      .eq("id", id);

    return res.end();
  }

  if (req.method === "DELETE") {
    await supabaseServer.from("plant_variants").delete().eq("id", id);
    return res.end();
  }

  res.status(405).end();
}
