import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import usersModel from "../models/usersModel.js";
import { check } from "express-validator";
import productsModel from "../models/productsModel.js";
import apiErrors from "../utils/apiErrors.js";

const addProductToWishList = asyncHandler(
  async (req, res, next) => {
    const { product } = req.body;
    const checkProduct = await productsModel.findById(product);
    if (!checkProduct) {
      throw new apiErrors("Product not found", StatusCodes.NOT_FOUND);
    }
    const user = await usersModel.findByIdAndUpdate(
      req.user?._id,
      {
        $addToSet: { wishlist: product },
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ data: user?.wishlist });
  }
);
const removeProductFromWishList = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: { wishlist: req.params.product },
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ data: user?.wishlist });
  }
);
const getLoggedinUserWishlist = asyncHandler(
  async (req, res, next) => {
    const user = await usersModel.findById(req.user?._id).populate('wishlist');
    res.status(StatusCodes.OK).json({ length: user?.wishlist.length, data: user?.wishlist });
  }
);

export { addProductToWishList, removeProductFromWishList, getLoggedinUserWishlist };