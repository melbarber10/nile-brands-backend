import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const addProductToCartValidator = [
  check("product")
    .notEmpty()
    .withMessage("Product is Required")
    .isMongoId()
    .withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const removeProductFromCartValidator = [
  check("itemId").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateProductQuantityValidator = [
  check("itemId").isMongoId().withMessage("Invalid Mongo Id"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .toInt()
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Invalid quantity");
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  addProductToCartValidator,
  removeProductFromCartValidator,
  updateProductQuantityValidator,
}