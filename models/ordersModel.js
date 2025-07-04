import { Schema, model } from "mongoose";

const ordersSchema = new Schema(
  {
    cartItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    status: {
      type: String,
      required: true,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    paidAt: { type: Date },
    isPaid: { type: Boolean, default: false },
    address: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

ordersSchema.pre(/^find/, function (next) {
  this.populate({ path: "cartItems.product", select: "name cover brand" });
  this.populate({ path: "user", select: "name userImage email" });
  next();
});

export default model("orders", ordersSchema);