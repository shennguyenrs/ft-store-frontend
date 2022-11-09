import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../libs/connect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect mongodb
  await connect();
  const { method } = req;

  const sessionCookie = req.cookies.sessionCookie;

  if (!sessionCookie) {
    return res.status(401).json({
      message: "User not login",
    });
  }

  if (method === "DELETE") {
    return res
      .status(200)
      .setHeader("Set-Cookie", [
        `sessionCookie=; Path=/; Expires=${new Date(
          0
        )}; HttpOnly; secure=false`,
      ])
      .json({ message: "Logout success" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
