import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import subCategoriesModel from "../../models/subcategoriesModel.js";
import categoriesModel from "../../models/categoriesModel.js";


const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is Required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .custom(async (value) => {
      const existingCategoryName = await categoriesModel.findOne({ name: value });
      if (existingCategoryName) {
        throw new Error("Category is already exist");
      }
      return true;
    }),
  validatorMiddleware,
];
const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("name")
    .notEmpty()
    .withMessage("Category Name is Required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .custom(async (value) => {
      const existingCategoryName = await categoriesModel.findOne({ name: value });
      if (existingCategoryName) {
        throw new Error("Category is already exist");
      }
      return true;
    }),
  validatorMiddleware,
];
const deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
      const subcategories = await subCategoriesModel.find({ category: value });
      if (subcategories.length > 0) {
        // * bulkWrite more performance
        const bulkOption = subcategories.map((subcategory) => ({
          deleteOne: { filter: { _id: subcategory._id } },
        }));
        await subCategoriesModel.bulkWrite(bulkOption);
      }
      return true;
    }),

  validatorMiddleware,
];

export {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
