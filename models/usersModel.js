import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 20 },
    userImage: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["owner", "admin", "user"],
      default: "user",
    },
    active: { type: Boolean, default: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "products" }],
    passwordChangedAt: { type: Date },
    resetCode: { type: String },
    resetCodeExpiresTime: { type: Date },
    resetCodeVerify: { type: Boolean },
  },
  { timestamps: true }
);

// Hash the password before saving to the database.
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

export default model("users", userSchema);
