import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import categoriesModel from "../../models/categoriesModel.js";
import subcategoriesModel from "../../models/subcategoriesModel.js";

const createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage("Name must contain only letters, numbers and spaces"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description length must be between 10 and 1000"),
  check("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array of strings"),
  check("sizes.*")
    .optional()
    .isString()
    .withMessage("Each size must be a string"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings"),
  check("colors.*")
    .optional()
    .isString()
    .withMessage("Each color must be a string"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .toFloat()
    .custom((value) => {
      if (value < 1 || value > 1000000) {
        throw new Error("Price must be between 1 and 1000000");
      }
      return true;
    }),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number")
    .toInt()
    .custom((value) => {
      if (value < 0) {
        throw new Error("Quantity must be a positive number");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    // * Check if category exist
    .custom(async (value) => {
      const category = await categoriesModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  check("subcategory")
    .notEmpty()
    .withMessage("Subcategory is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    // * Check if subcategory exist and belongs to the selected category
    .custom(async (value, { req }) => {
      const subcategory =
        await subcategoriesModel.findById(value);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      if (
        subcategory.category._id.toString() !== req.body.category.toString()
      ) {
        throw new Error("Subcategory must belong to the selected category");
      }
      return true;
    }),
  validatorMiddleware,
];
const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateProductValidator = [
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage("Name must contain only letters, numbers and spaces"),
  check("description")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description length must be between 10 and 1000"),
  check("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array of strings"),
  check("sizes.*")
    .optional()
    .isString()
    .withMessage("Each size must be a string"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings"),
  check("colors.*")
    .optional()
    .isString()
    .withMessage("Each color must be a string"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .toFloat()
    .custom((value) => {
      if (value < 1 || value > 1000000) {
        throw new Error("Price must be between 1 and 1000000");
      }
      return true;
    }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .toFloat()
    .custom((value) => {
      if (value < 1 || value > 1000000) {
        throw new Error("Price must be between 1 and 1000000");
      }
      return true;
    }),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number")
    .toInt()
    .custom((value) => {
      if (value < 0) {
        throw new Error("Quantity must be a positive number");
      }
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    // * Check if category exist
    .custom(async (value) => {
      const category = await categoriesModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    // * Check if subcategory exist and belongs to the selected category
    .custom(async (value, { req }) => {
      const subcategory =
        await subcategoriesModel.findById(value);
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      if (
        subcategory.category._id.toString() !== req.body.category.toString()
      ) {
        throw new Error("Subcategory must belong to the selected category");
      }
      return true;
    }),
  validatorMiddleware,
];
const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

export {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
}