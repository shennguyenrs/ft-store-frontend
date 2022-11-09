import jwt from "jsonwebtoken";
import crypto from "crypto-random-string";
import userModel from "../models/user";
import { CLEAN_USER } from "../interfaces/user";
import { COOKIE_SECRET } from "./constants";

export function generateAuthTokenCode(
  id: string,
  serect: string,
  expiresIn: string
): { token: string; code: string } {
  const code = crypto({ length: 16 });
  const token = jwt.sign({ id, code }, serect, { expiresIn });

  return { token, code };
}

export async function checkUser(sessionCookie: string) {
  let decoded;

  try {
    decoded = jwt.verify(sessionCookie, COOKIE_SECRET) as {
      id: string;
      code: string;
    };
  } catch (err) {
    return null;
  }

  if (!decoded.hasOwnProperty("id") || !decoded.hasOwnProperty("code")) {
    return null;
  }

  const decodedId = decoded.id;
  const decodedCode = decoded.code;
  let user = null;

  try {
    user = await userModel.findById(decodedId).exec();
  } catch (err) {
    return null;
  }

  if (!user) {
    return null;
  }

  // Check decodedCode in sessionCodes array
  const result = user.sessionCodes.find(
    (i: { code: string; created: number }) => i.code === decodedCode
  );

  if (result) {
    const cleanUser: CLEAN_USER = {
      id: user._id.toString(),
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      zipcode: user.zipcode,
      city: user.city,
      avatar: user.avatar,
      orders: user.orders,
      favoriteProducts: user.favoriteProducts,
      cart: user.cart,
    };

    return cleanUser;
  }

  return null;
}

export async function validateUser(cookies: string, userId: string) {
  if (!cookies) {
    return {
      code: 401,
      message: "User not login",
    };
  }

  const user: CLEAN_USER | null = await checkUser(cookies);

  if (!user) {
    return {
      code: 401,
      message: "User not found",
    };
  }

  if (user.id !== userId) {
    return {
      code: 401,
      message: "Unauthorization",
    };
  }

  return null;
}
