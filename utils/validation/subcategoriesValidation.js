import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import categoriesModel from "../../models/categoriesModel.js";
import subcategoriesModel from "../../models/subcategoriesModel.js";

const createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .custom(async (value) => {
      const existingSubcategoryName = await subcategoriesModel.findOne({ name: value });
      if (existingSubcategoryName) {
        throw new Error("Subcategory is already exist");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
      const category = await categoriesModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  validatorMiddleware,
];

const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

const updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .custom(async (value) => {
      const existingSubcategoryName = await subcategoriesModel.findOne({ name: value });
      if (existingSubcategoryName) {
        throw new Error("Subcategory is already exist");
      }
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
      const category = await categoriesModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  validatorMiddleware,
];

const deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

export {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
};
