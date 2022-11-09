import { Schema, model, models } from "mongoose";
import { ORDER } from "../interfaces/order";

const OrderSchema = new Schema<ORDER>({
  list: {
    type: [
      {
        product: {
          productId: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          imageIds: {
            type: String,
          },
          price: {
            type: Number,
            required: true,
          },
        },
        amount: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  orderUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderDate: {
    type: Number,
    required: true,
    default: () => Date.now(),
  },
  deliveryInfo: {
    type: {
      fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    required: true,
    _id: false,
  },
  deliveryEstimate: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
});

export default models.order || model<ORDER>("order", OrderSchema);
