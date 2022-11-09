import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CLEAN_USER } from "../../../interfaces/user";
import { checkUser } from "../../../libs/authTools";
import { deleteOldAva, uploadAvatar } from "../../../libs/cmsTools";
import connect from "../../../libs/connect";
import { CMS_API, CMS_HEADER, USER_API_SLUG } from "../../../libs/constants";
import { personById } from "../../../libs/queries";
import userModel from "../../../models/user";

async function findStrapiId(res: NextApiResponse, id: string) {
  try {
    const { data } = await axios.get(
      `${CMS_API}/people?${personById(id)}`,
      CMS_HEADER
    );

    return res.status(200).json(data.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server fail" });
  }
}

async function uploadUserAva(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const { body, query } = req;
    const sId = query.slug[2];

    // Delete user old avatars
    await deleteOldAva(userId);

    // Upload avatar
    const fileStr = body.file;
    const result = await uploadAvatar(fileStr, userId, sId);

    if (!result) {
      return res.status(500).json({ message: "Failed to upload user avatar" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Failed to upload user avatar" });
  }
}

async function updateUserField(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const newItems = req.body;
    const result = await userModel.findByIdAndUpdate(id, newItems).exec();

    if (result) {
      return res.status(200).json({ message: "Update success" });
    }

    return res.status(401).json({ message: "Update fail" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user fields" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect mongodb
  await connect();
  const { method, query } = req;
  const sessionCookie = req.cookies.sessionCookie;
  const { slug } = query;
  const id = slug[0];

  // Validating user
  if (!sessionCookie) {
    return res.status(401).json({
      message: "User not login",
    });
  }

  const user: CLEAN_USER | null = await checkUser(sessionCookie);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.id !== id) {
    return res.status(401).json({ message: "Unauthorization" });
  }

  // Switch method
  if (method === "GET") {
    return findStrapiId(res, id);
  }

  if (slug.length >= 2) {
    // Handle data in Mongodb
    if (slug[1] === USER_API_SLUG.fields) {
      if (method === "PUT") {
        return updateUserField(req, res, id);
      }
    }

    // Handle data in Strapi
    if (slug[1] === USER_API_SLUG.ava) {
      if (method === "POST") {
        return uploadUserAva(req, res, id);
      }
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
