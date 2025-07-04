import { Schema, model } from "mongoose";

const couponsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    expireTime: { type: Date, required: true, index: { expires: 0 } }, // TTL (Time-To-Live) Index,
    discount: { type: Number, required: true, min: 1, max: 100 },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  },
  { timestamps: true }
);

export default model("coupons", couponsSchema);
