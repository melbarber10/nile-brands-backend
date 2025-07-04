import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    colors: [{ type: String, trim: true }], 
    sizes: [{ type: String, trim: true }], 
    price: { type: Number, required: true, min: 1, max: 1000000 },
    priceAfterDiscount: { type: Number, min: 1, max: 1000000 },
    quantity: { type: Number, default: 0, min: 0, max: 1000 },
    sold: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    coverImage: { type: String },
    images: [String],
    brand: { type: Schema.Types.ObjectId, required: true, ref: "brands" },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "subCategory",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productsSchema.virtual("reviews", {
  ref: "reviews",
  foreignField: "product",
  localField: "_id",
});

productsSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  this.populate({ path: "subcategory", select: "name" });
  this.populate({ path: "brand", select: "name" });
  next();
});

export default model("products", productsSchema);
