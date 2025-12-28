import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize("admin-auth", "", {
    path: "/",
    maxAge: -1,
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}
