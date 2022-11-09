import type { NextApiRequest, NextApiResponse } from "next";
import { uploadNewPerson } from "../../../../libs/cmsTools";
import connect from "../../../../libs/connect";
import { CACHE_TOKEN } from "../../../../libs/constants";
import userModel from "../../../../models/user";
import rateLimit from "../../../../utils/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds,
  uniqueTokenPerInterval: 500, // Max users per a second
});

async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the user already exists using email
    const obj = req.body;
    const user = await userModel.findOne({ email: obj.email }).exec();

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    } else {
      // Create the user on MongoDB
      const newUser = new userModel({
        username: obj.username,
        fullname: obj.fullname,
        email: obj.email,
        address: obj.address,
        zipcode: obj.zipcode,
        city: obj.city,
      });

      await newUser.save();

      // Create user on Strapi
      await uploadNewPerson({
        userId: newUser._id.toString(),
        username: newUser.username,
      });

      // TODO: Login after registered

      return res.status(201).json({
        message: "User created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect mongodb
  await connect();
  const { method } = req;

  try {
    await limiter.check(res, 10, CACHE_TOKEN);

    // Handle post request
    if (method === "POST") {
      if (!req.body) {
        return res.status(400).json({ message: "Missing request body" });
      }

      return registerUser(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch {
    return res.status(429).json({ message: "Limit meets" });
  }
}
