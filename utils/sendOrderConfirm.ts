import axios from "axios";
import { ORDER } from "../interfaces/order";
import { ORDER_SERVICE_API } from "../libs/constants";

export default async function sendOrderConfirm(order: ORDER) {
  try {
    await axios.post(ORDER_SERVICE_API, order);
    return;
  } catch (err) {
    throw new Error("Failed to send confirmation order");
  }
}
