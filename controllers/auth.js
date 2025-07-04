import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import usersModel from "../models/usersModel.js";
import { createResetToken, createToken } from "../utils/createToken.js";
import apiErrors from "../utils/apiErrors.js";
import sendMail from "../utils/sendMail.js";
import client from "../config/googleClient.js";

const signup = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.create(req.body);
    const token = createToken(user._id);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User registered successfully", token, data: user });
  }
);
const login = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new apiErrors("Invalid credentials", StatusCodes.UNAUTHORIZED)
    }
    const token = createToken(user._id);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Login successful", token });
  }
);
const googleAuth = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new apiErrors("Google ID Token is required", StatusCodes.BAD_REQUEST);
  }
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload;
  let user = await usersModel.findOne({ email });
  if (!user) {
    const randomPassword = crypto.randomBytes(10).toString("hex");
    user = new usersModel({
      email,
      name: name || "Google User",
      userImage: picture,
      password: randomPassword, 
      role: "user",
    });
    await user.save(); 
  }
  const token = createToken(user._id);
  res.status(StatusCodes.OK).json({
    message: "Google Sign-In successful",
    token,
    data: user,
  });
});
const protectRoutes = asyncHandler(
  async (req, res, next) => {
    // 1- check if token exists
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      throw new apiErrors(
        "Please login first to access application",
        StatusCodes.UNAUTHORIZED
      )
    }
    // 2- check if token not expired
    const decodedToken = Jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user exists
    const currentUser = await usersModel.findById(decodedToken._id);
    if (!currentUser) {
      throw new apiErrors("User doesn't exist", StatusCodes.UNAUTHORIZED);
    }
    // 4- check if password changed
    if (currentUser.passwordChangedAt instanceof Date) {
      const changedPasswordTime = Math.floor(
        currentUser.passwordChangedAt.getTime() / 1000
      );
      if (changedPasswordTime > decodedToken.iat) {
        throw new apiErrors(
          "Password has been changed. Please login again",
          StatusCodes.UNAUTHORIZED
        );
      }
    }
    req.user = currentUser;
    next();
  }
);
const forgetPassword = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findOne({ email: req.body.email });
    if (!user) {
      throw new apiErrors("User doesn't exist", StatusCodes.NOT_FOUND);
    }
    const resetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.resetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    user.resetCodeExpiresTime = Date.now() + 10 * 60 * 1000;
    user.resetCodeVerify = false;
    const message = `Your reset code is ${resetCode}`;
    const subject = `Reset Password`;
    const html = `
        <div style="background-color:#F6F5F5;padding:2%;margin:2%">
        <h1>${subject}</h1><p>${message}</p></div>`;
    try {
      await user.save({ validateModifiedOnly: true });
      await sendMail({ email: user.email, subject, message, html });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw new apiErrors(
          "Failed to send reset password email",
          StatusCodes.BAD_REQUEST
        )
    }
    const resetToken = createResetToken(user._id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Reset password email sent successfully", resetToken });
  }
);
const verifyResetCode = asyncHandler(
  async (req, res, next) => {
    let resetToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      resetToken = req.headers.authorization.split(" ")[1];
    } else {
      throw new apiErrors("Get your Reset Code first", StatusCodes.BAD_REQUEST)
    }
    const decodedToken = Jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
    const hashResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");
    const user = await usersModel.findOne({
      _id: decodedToken._id,
      resetCode: hashResetCode,
      resetCodeExpiresTime: { $gt: Date.now() },
    });
    if (!user) {
      throw new apiErrors("Invalid reset code", StatusCodes.BAD_REQUEST);
    }
    user.resetCodeVerify = true;
    await user.save({ validateModifiedOnly: true });
    res
      .status(StatusCodes.OK)
      .json({ message: "Reset Code verified successfully" });
  }
);
const resetPassword = asyncHandler(
  async (req, res, next) => {
    let resetToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      resetToken = req.headers.authorization.split(" ")[1];
    } else {
      throw new apiErrors(
          "You don't have permission to access this",
          StatusCodes.BAD_REQUEST
        )
    }
    const decodedToken = Jwt.verify(
      resetToken,
      process.env.JWT_SECRET_KEY
    );
    const user = await usersModel.findOne({
      _id: decodedToken._id,
      resetCodeVerify: true,
    });
    if (!user) {
      throw new apiErrors("Verify your Reset Code first", StatusCodes.BAD_REQUEST)
    }
    user.password = req.body.password;
    user.resetCode = undefined;
    user.resetCodeExpiresTime = undefined;
    user.resetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();
    await user.save({ validateModifiedOnly: true });
    res
      .status(StatusCodes.OK)
      .json({ message: "Your password has been updated" });
  }
);
const allowedTo = (...roles) =>
  asyncHandler(
    async (req, res, next) => {
      if (!roles.includes(req.user?.role ?? "")) {
        throw new apiErrors(
            "You don't have permission to access this route",
            StatusCodes.FORBIDDEN
          )
      }
      next();
    }
  );
const checkActive = asyncHandler(
  async (req, res, next) => {
    if (!req.user?.active) {
      throw new apiErrors("Your account is not activated", StatusCodes.FORBIDDEN)
    }
    next();
  }
);

export {
  signup,
  login,
  protectRoutes,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  allowedTo,
  checkActive,
  googleAuth
};