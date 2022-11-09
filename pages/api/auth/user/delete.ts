import type { NextApiRequest, NextApiResponse } from "next";
import { CLEAN_USER } from "../../../../interfaces/user";
import { checkUser } from "../../../../libs/authTools";
import {
  deletePerson,
  deleteReview,
  getUserIdAndReviews,
} from "../../../../libs/cmsTools";
import connect from "../../../../libs/connect";
import userModel from "../../../../models/user";

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

  if (method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    //Find user id and reviews on Strapi
    const { suId, rawReviews } = await getUserIdAndReviews(user.id);

    if (suId) {
      // Delete user reviews
      if (rawReviews.length) {
        for (let i = 0; i < rawReviews.length; i += 1) {
          const id = rawReviews[i].id;
          await deleteReview(id);
        }
      }

      // Delete person on Strapi
      await deletePerson(user.id, suId);
    }

    // Delete on MongoDB
    await userModel.findByIdAndDelete(user.id).exec();

    return res.status(200).json({ message: "User deleted" });
  } catch (e) {
    return res.status(500).json({ message: "Database error" });
  }
}
