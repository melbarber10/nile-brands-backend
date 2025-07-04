import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import ordersModel from "../../models/ordersModel.js";

const createPaymentIntentValidator = [
  check("orderId")
    .isMongoId()
    .withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];

export default createPaymentIntentValidator;