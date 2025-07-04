import asyncHandler from 'express-async-handler';
import { uploadSingleImage } from '../middlewares/uploadImage.js';
import categoriesModel from '../models/categoriesModel.js';
import { getAll, getOne, createOne, updateOne, deleteOne } from './refactorHandler.js';
import sharp from 'sharp';

const uploadCategoryImage = uploadSingleImage("categoryImage");
const handleCategoryImage = asyncHandler(
  async (req, res, next) => {
    if (req.file) {
      const imageName = `category-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${imageName}`)
      req.body.categoryImage = imageName;
    }
    next();
  }
)

const getCategories = getAll(categoriesModel, "Category");
const getCategory = getOne(categoriesModel, "products");
const createCategory = createOne(categoriesModel);
const updateCategory = updateOne(categoriesModel);
const deleteCategory = deleteOne(categoriesModel);

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  handleCategoryImage
};