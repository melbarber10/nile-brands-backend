import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import apiErrors from "../utils/apiErrors.js";
import { createOne, deleteOne, getAll, getOne } from "./refactorHandler.js";
import { uploadSingleImage } from "../middlewares/uploadImage.js";
import usersModel from "../models/usersModel.js";
import { createToken } from "../utils/createToken.js";

const uploadUserImage = uploadSingleImage("userImage");
const handleUserImage = asyncHandler(
  async (req, res, next) => {
    if (req.file) {
      const imageName = `user-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/users/${imageName}`);
      req.body.userImage = imageName;
    }
    next();
  }
);

const createUser = createOne(usersModel);
const getUsers = getAll(usersModel, "users");
const getUser = getOne(usersModel);
const updateUser = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        userImage: req.body.userImage,
        active: req.body.active,
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw new apiErrors("User not found", StatusCodes.NOT_FOUND)
    }
    res
      .status(StatusCodes.OK)
      .json({ data: user, message: "User updated successfully" });
  }
);
const deleteUser = deleteOne(usersModel);
const changeUserPassword = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAt: new Date(),
      },
      { new: true }
    );
    if (!user) {
      throw new apiErrors("User not found", StatusCodes.NOT_FOUND);
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "user password changed successfully", data: user });
  }
);
const updateLoggedUser = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findByIdAndUpdate(
      req.user?._id,
      {
        name: req.body.name,
        userImage: req.body.userImage,
      },
      {
        new: true,
      }
    );
    res
      .status(StatusCodes.OK)
      .json({ data: user, message: "User updated successfully" });
  }
);
const changeLoggedUserPassword = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findByIdAndUpdate(
      req.user?._id,
      {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAt: new Date(),
      },
      { new: true }
    );
    const token = createToken(user?._id);
    res
      .status(StatusCodes.OK)
      .json({ message: "user password changed successfully", token });
  }
);

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  handleUserImage,
  changeUserPassword,
  updateLoggedUser,
  changeLoggedUserPassword
}