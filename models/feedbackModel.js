import { Schema, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
); 

feedbackSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name userImage" });
  next();
});

export default model("feedback", feedbackSchema);
