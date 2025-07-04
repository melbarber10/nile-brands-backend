import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import { StatusCodes } from 'http-status-codes';
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler.js";
import brandModel from "../models/brandModel.js";
import { uploadSingleImage } from "../middlewares/uploadImage.js";
import apiErrors from '../utils/apiErrors.js';

const uploadBrandLogo = uploadSingleImage("logo");
const handleBrandLogo = asyncHandler(
  async (req, res, next) => {
    if (req.file) {
      const imageName = `brand-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${imageName}`)
      req.body.logo = imageName;
    }
    next();
  }
)
const createBrand = createOne(brandModel);
const getBrands = getAll(brandModel, "brands");
const getBrand = getOne(brandModel, "products");
const updateBrand = asyncHandler(
  async (req, res, next) => {
    const brand = await brandModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        logo: req.body.logo,
        description: req.body.description,
      },
      {
        new: true,
      }
    );
    if (!brand) {
      throw new apiErrors("Brand not found", StatusCodes.NOT_FOUND)
    }
    res
      .status(StatusCodes.OK)
      .json({ data: brand, message: "Brand updated successfully" });
  }
);
const deleteBrand = deleteOne(brandModel);

export {
  createBrand, 
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  handleBrandLogo
}
