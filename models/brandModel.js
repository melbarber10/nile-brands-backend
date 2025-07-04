import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // unique name
    logo: { type: String },
    description: {
      type: String, required: true, trim: true, minlength: 10, maxlength: 1000,
    },
    taxID: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, unique: true, required: true, ref: "users" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

brandSchema.virtual("products", {
  ref: "products",
  foreignField: "brand",
  localField: "_id",
});

brandSchema.pre(/^find/, function (next) {
  this.populate({ path: "owner", select: "name" });
  next();
});

export default model("brands", brandSchema);
