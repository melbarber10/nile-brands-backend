import { check } from "express-validator";
import brandModel from "../../models/brandModel.js";
import productsModel from "../../models/productsModel.js";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import usersModel from "../../models/usersModel.js";

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage("Name must contain only letters, spaces and numbers"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description length must be between 10 and 1000"),
  check("taxID")
    .notEmpty()
    .withMessage("Tax ID Number is required")
    .custom((value) => {
      if (!/^\d{9}$/.test(value)) {
        throw new Error('Tax ID must be exactly 9 digits long and contain only numbers.');
      }
      return true;
    })
    .custom(async (value) => {
      const existingTaxId = await brandModel.findOne({ taxID: value });
      if (existingTaxId) {
        throw new Error('Tax ID already exists.');
      }
      return true;
    }),
  check("owner")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
      const user = await usersModel.findById(value);
      if (!user) {
        throw new Error("User not found");
      }
      return true;
    })
    .custom(async (value) => {
      const existingOwnerId = await brandModel.findOne({ owner: value });
      if (existingOwnerId) {
        throw new Error("Owner is already exist");
      }
      return true;
    }),
  validatorMiddleware,
];
const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .matches(/^[A-Za-z0-9\s]+$/)
    .withMessage("Name must contain only letters, spaces and numbers"),
  check("description")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description length must be between 10 and 1000"),
  validatorMiddleware,
];
const deleteBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
      const products = await productsModel.find({ brand: value });
      if (products.length > 0) {
        // * bulkWrite more performance
        const bulkOption = products.map((product) => ({
          deleteOne: { filter: { _id: product._id } },
        }));
        await productsModel.bulkWrite(bulkOption);
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
