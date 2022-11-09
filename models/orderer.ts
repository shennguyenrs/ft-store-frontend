import { Schema, model, models } from "mongoose";
import { ORDERERS_PRODUCT } from "../interfaces/order";

const OrderersSchema = new Schema<ORDERERS_PRODUCT>({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  orderers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default models.orderer ||
  model<ORDERERS_PRODUCT>("orderer", OrderersSchema);
