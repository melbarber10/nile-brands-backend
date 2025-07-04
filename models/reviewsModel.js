import { Schema, model } from "mongoose";
import productsModel from "./productsModel.js";


const reviewsSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
  },
  { timestamps: true }
); 

reviewsSchema.statics.calcRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(result)
  if (result.length > 0) {
    await productsModel.findByIdAndUpdate(productId, {
      ratingAverage: result[0].avgRating,
      ratingCount: result[0].ratingQuantity,
    })
  } else {
    await productsModel.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
  }
};


reviewsSchema.post("save", async function () {
  await this.constructor.calcRating(this.product);
});

async function updateProductRatings(document) {
  if (!document?.product) return;
  await document.constructor.calcRating(document.product);
}
reviewsSchema.post("findOneAndDelete", updateProductRatings);

reviewsSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name userImage" });
  next();
});

export default model("reviews", reviewsSchema);
