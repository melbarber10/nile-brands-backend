import { Schema, model } from "mongoose";

const cartsSchema = new Schema(
  {
    cartItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    totalPriceAfterDiscount: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

cartsSchema.pre(/^find/, function (next) {
  this.populate({ path: "cartItems.product", select: "name coverImage" });
  next();
});

export default model("carts", cartsSchema);
