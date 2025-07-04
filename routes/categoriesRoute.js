import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  handleCategoryImage,
  updateCategory,
  uploadCategoryImage
} from "../controllers/categories.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator
} from "../utils/validation/categoriesValidation.js";
import subcategoriesRoute from "./subcategoriesRoute.js";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";

const categoriesRoute = Router();

categoriesRoute.use("/:categoryId/subcategories", subcategoriesRoute);

categoriesRoute
  .route("/")
  .get(getCategories)
  .post(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    uploadCategoryImage,
    handleCategoryImage,
    createCategoryValidator,
    createCategory
  );

categoriesRoute
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    uploadCategoryImage,
    handleCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

export default categoriesRoute;