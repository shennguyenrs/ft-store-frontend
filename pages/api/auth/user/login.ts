import sgMail, { MailDataRequired } from "@sendgrid/mail";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateAuthTokenCode } from "../../../../libs/authTools";
import connect from "../../../../libs/connect";
import {
  CACHE_TOKEN,
  SENDGRID_API_KEY,
  TOKEN_SECRET,
} from "../../../../libs/constants";
import userModel from "../../../../models/user";
import { loginMail } from "../../../../utils/generateMails";
import rateLimit from "../../../../utils/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds,
  uniqueTokenPerInterval: 500, // Max users per a second
});

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle request
    const { email } = req.body;
    const user = await userModel.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Create token and login code
    const { token, code } = generateAuthTokenCode(
      user._id,
      TOKEN_SECRET,
      "10m"
    );

    // Create magic email
    const message: MailDataRequired | undefined = loginMail(user.email, token);

    if (!message) {
      return res.status(500).json({ message: "Error to gennertate email" });
    }

    // Save the code to the database
    const postCode = await userModel
      .findByIdAndUpdate(user._id, {
        $set: {
          loginCode: code,
        },
      })
      .exec();

    // If post code successful, send the email
    if (postCode) {
      try {
        sgMail.setApiKey(SENDGRID_API_KEY);

        await sgMail.send(message);

        return res.status(200).json({ message: "Email sent" });
      } catch {
        return res.status(500).json({
          message: "Error sending email",
        });
      }
    } else {
      return res.status(500).json({
        message: "Error saving login code",
      });
    }
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to database
  await connect();
  const { method } = req;

  // Check rate limit
  try {
    await limiter.check(res, 10, CACHE_TOKEN);

    // Handle post request
    if (method === "POST") {
      if (!req.body) {
        return res.status(400).json({ message: "Missing request body" });
      }

      return getUser(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch {
    return res.status(429).json({ message: "Limit meets" });
  }
}
