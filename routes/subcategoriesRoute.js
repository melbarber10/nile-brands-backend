import { Router } from "express";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory
} from "../controllers/subcategories.js";
import {
  createSubcategoryValidator,
  deleteSubcategoryValidator,
  getSubcategoryValidator,
  updateSubcategoryValidator
} from "../utils/validation/subcategoriesValidation.js";
import { filterSubcategories } from "../middlewares/filterData.js";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { setCategoryId } from "../middlewares/setID.js";

const subcategoriesRoute = Router({ mergeParams: true });

subcategoriesRoute
  .route("/")
  .get(filterSubcategories, getSubcategories)
  .post(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    setCategoryId,
    createSubcategoryValidator,
    createSubcategory);

subcategoriesRoute
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategory)
  .put(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    updateSubcategoryValidator,
    updateSubcategory)
  .delete(
    protectRoutes,
    checkActive,
    allowedTo("admin"),
    deleteSubcategoryValidator,
    deleteSubcategory);

export default subcategoriesRoute;