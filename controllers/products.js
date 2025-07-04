import asyncHandler from "express-async-handler";
import sharp from "sharp";
import productsModel from "../models/productsModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler.js";
import { uploadMultipleImages } from "../middlewares/uploadImage.js";


const uploadProductImages = uploadMultipleImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
const handleProductImage = asyncHandler(
  async (req, res, next) => {
    if (req.files) {
      if (req.files.coverImage) {
        const coverName = `product-${Date.now()}-Cover.jpeg`;
        await sharp(req.files.coverImage[0].buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${coverName}`);
        req.body.coverImage = coverName;
      }
      if (req.files.images) {
        req.body.images = [];
        await Promise.all(
          req.files.images.map(async (image, index) => {
            const imageName = `product-${Date.now()}N${index + 1}.jpeg`;
            await sharp(image.buffer)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(`uploads/products/${imageName}`);
            req.body.images.push(imageName);
          })
        );
      }
    }
    next();
  }
);
const getProducts = getAll(productsModel, "products");
const getProduct = getOne(productsModel, "reviews");
const createProduct = createOne(productsModel);
const updateProduct = updateOne(productsModel);
const deleteProduct = deleteOne(productsModel);

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  handleProductImage,
};
