import { Schema, model, models } from "mongoose";
import { USER } from "../interfaces/user";

const UserSchema = new Schema<USER>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullname: String,
  address: String,
  zipcode: String,
  city: String,
  avatar: String,
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  favoriteProducts: [
    {
      productId: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      imageIds: String,
      _id: false,
    },
  ],
  cart: [
    {
      product: {
        productId: {
          type: String,
          required: true,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        imageIds: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
  sessionCodes: [
    {
      code: {
        type: String,
        required: true,
      },
      created: {
        type: Date,
        required: true,
      },
      _id: false,
    },
  ],
  loginCode: String,
});

// Next Js will create models everything it re-render
// export the model like this will fix OverwriteModelError
export default models.user || model<USER>("user", UserSchema);
