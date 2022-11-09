import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateAuthTokenCode } from "../../../../libs/authTools";
import connect from "../../../../libs/connect";
import { COOKIE_SECRET, TOKEN_SECRET } from "../../../../libs/constants";
import userModel from "../../../../models/user";

const checkLoginedUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const linkToken = req.query?.token;

  // Check if token exists
  if (!linkToken) {
    return res.status(401).json({
      message: "Invalid link",
    });
  }

  let decoded;

  // Check if token is valid
  try {
    decoded = jwt.verify(linkToken as string, TOKEN_SECRET) as {
      id: string;
      code: string;
    };
  } catch (err) {
    return res.status(401).json({
      message: "Link can not verify",
    });
  }

  // Check if id and code is in decoded
  if (!decoded.hasOwnProperty("id") || !decoded.hasOwnProperty("code")) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  const decodedId = decoded.id;
  const decodedCode = decoded.code;

  const user = await userModel.findById(decodedId).exec();

  // Check if user exists
  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  // Check if loginCode is valid
  if (user.loginCode !== decodedCode) {
    return res.status(401).json({
      message: "Invaild login code",
    });
  }

  // Genereate session token
  const { token, code } = generateAuthTokenCode(decodedId, COOKIE_SECRET, "7d");

  // Update user sessionCodes
  try {
    const updateSessionCode = await userModel
      .findByIdAndUpdate(decodedId, {
        $addToSet: {
          sessionCodes: {
            code: code,
            created: new Date().valueOf(),
          },
        },
      })
      .exec();

    if (updateSessionCode) {
      return res
        .status(200)
        .setHeader("Cache-Control", "no-cache")
        .setHeader("Pragma", "no-cache")
        .setHeader("Set-Cookie", [
          `sessionCookie=${token}; HttpOnly; Path=/; Max-Age=${
            60 * 60 * 24 * 7
          }; secure=${
            process.env.NODE_ENV === "production" ? true : false
          }; SameSite=Strict`,
        ])
        .redirect("/");
    }
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update user session code",
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await connect();

  if (method === "GET") {
    return checkLoginedUser(req, res);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
