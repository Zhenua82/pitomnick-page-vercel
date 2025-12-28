import type { NextApiRequest } from "next";

export function checkAdminAuth(req: NextApiRequest) {
  return req.cookies["admin-auth"] === "true";
}
