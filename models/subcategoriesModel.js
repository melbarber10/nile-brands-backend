import { Schema, model } from "mongoose";

const subcategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, required: true, ref: "Category" }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

subcategorySchema.virtual("products", {
  ref: "products",
  foreignField: "subcategory",
  localField: "_id",
});

subcategorySchema.pre(/^find/, function (next) { 
  this.populate({ path: "category", select: "name" });
  next();
});

export default model("subCategory", subcategorySchema);