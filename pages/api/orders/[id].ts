import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../libs/connect";
import orderModel from "../../../models/order";
import ordererModel from "../../../models/orderer";
import userModel from "../../../models/user";
import sendOrderConfirm from "../../../utils/sendOrderConfirm";

async function postOrder(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  if (!req.body) {
    return res.status(404).json({ message: "Missing new order detail" });
  }

  try {
    const order = new orderModel(req.body);
    const saved = await order.save();

    if (order.orderUser) {
      // Update user id to orderer
      for (let i = 0; i < order.list.length; i += 1) {
        const { product } = order.list[i];

        await ordererModel.findOneAndUpdate(
          { productId: product.productId },
          {
            $push: {
              orderers: userId,
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      }

      // Update order id to user
      await userModel
        .findByIdAndUpdate(userId, {
          $push: {
            orders: saved._id,
          },
        })
        .exec();
    }

    // Send order confirmation
    await sendOrderConfirm(saved);

    return res.status(201).json({ orderId: saved._id.toString() });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to save order in database" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect mongodb
  await connect();
  const { method } = req;
  const id = req.query.id as string;

  if (method === "POST") {
    return postOrder(req, res, id);
  }

  return res.status(405).json({ message: "This method not allowed" });
}
