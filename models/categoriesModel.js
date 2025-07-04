import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true },
  categoryImage: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

categorySchema.virtual("products", {
  ref: "products",
  foreignField: "category",
  localField: "_id",
});

export default model("Category", categorySchema);