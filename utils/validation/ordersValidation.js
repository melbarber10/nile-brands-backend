import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

const createOrderValidator = [
  check("address").optional(),
  validatorMiddleware,
];
const orderValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

const updateStatusValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id"),
  check("status")
    .isString()
    .withMessage("Status must be a string")
    .isIn(["pending", "shipped", "delivered", "canceled"])
    .withMessage("Invalid status value. Allowed values: pending, shipped, delivered, canceled"),
  validatorMiddleware,
];

export {
  createOrderValidator,
  orderValidator,
  updateStatusValidator
}