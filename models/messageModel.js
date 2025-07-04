import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default model("messages", messageSchema);
