import { NextApiRequest, NextApiResponse } from "next";
import { CLEAN_USER } from "../../interfaces/user";
import { checkUser } from "../../libs/authTools";
import { uploadReviewImgs } from "../../libs/cmsTools";
import connect from "../../libs/connect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect mongodb
  await connect();
  const { method } = req;
  const sessionCookie = req.cookies.sessionCookie;

  // Validating user
  if (!sessionCookie) {
    return res.status(401).json({
      message: "User not login",
    });
  }

  const user: CLEAN_USER | null = await checkUser(sessionCookie);

  if (!user) {
    return res.status(401).json({ message: "Unauthorization" });
  }

  // Swith method
  if (method === "POST") {
    if (!req.body) {
      return res.status(404).json({ message: "Missing request body" });
    }

    const result = await uploadReviewImgs(req.body);

    if (!result) {
      return res.status(500).json({ message: "Failed to upload reviews" });
    }

    return res.status(200).json(result);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
