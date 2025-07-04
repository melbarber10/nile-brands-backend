import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler.js";
import couponModel from "../models/couponModel.js";
import usersModel from "../models/usersModel.js";
import apiErrors from "../utils/apiErrors.js";
import sendMail from "../utils/sendMail.js";

const createCoupon = createOne(couponModel);
const getCoupons = getAll(couponModel, "coupons");
const getCoupon = getOne(couponModel);
const updateCoupon = updateOne(couponModel);
const deleteCoupon = deleteOne(couponModel);
const sendCoupon = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findOne({ email: req.body.email });
    if (!user) {
      throw new apiErrors("User doesn't exist", StatusCodes.NOT_FOUND);
    }
    // Fetch the latest valid coupon
    const coupon = await couponModel
      .findOne({ expireTime: { $gt: new Date() } }) // Only non-expired coupons
      .sort({ createdAt: -1 }); // Get the latest one
    if (!coupon) {
      throw new apiErrors("No active coupon found", StatusCodes.NOT_FOUND)
    }
    const message = `Your exclusive discount code is ${coupon.name}`;
    const subject = `🎉 Your Exclusive Discount Coupon!`;
    const html = `
        <div style="background-color:#F6F5F5;padding:2%;margin:2%">
        <h2>Congratulations! 🎉</h2>
        <p>Use the following coupon to get <strong>${coupon.discount}% off</strong> on your next purchase:</p>
        <h3 style="color:blue;"> ${coupon.name}</h3>
        <p>Hurry up! Offer expires on ${coupon.expireTime}.</p></div>`;
    try {
      await sendMail({ email: user.email, subject, message, html });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new apiErrors("Failed to send email", StatusCodes.BAD_REQUEST)
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Coupon email sent successfully!" });
  }
);

export { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon, sendCoupon };