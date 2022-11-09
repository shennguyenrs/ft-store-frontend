import type { NextApiRequest, NextApiResponse } from "next";
import { CLEAN_USER } from "../../../../interfaces/user";
import { checkUser } from "../../../../libs/authTools";
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

  const user: CLEAN_USER | null = await checkUser(sessionCookie);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (method === "GET") {
    return res.status(200).json({ user: user });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
