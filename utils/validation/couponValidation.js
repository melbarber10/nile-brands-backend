import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import couponModel from "../../models/couponModel.js";

const createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon Name is Required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .custom(async (value) => {
      const coupon = await couponModel.findOne({ name: value });
      if (coupon) {
        throw new Error("Coupon is already exist");
      }
      return true;
    }),
  check("expireTime")
    .notEmpty()
    .withMessage("Coupon Expire Time is Required")
    .isDate()
    .withMessage("Invalid Date"),
  check("discount")
    .notEmpty()
    .withMessage("Discount Required")
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value) => {
      if (value < 0 || value >= 100) {
        throw new Error("Invalid Discount Value");
      }
      return true;
    }),
  validatorMiddleware,
];
const getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50")
    .custom(async (value) => {
      const coupon = await couponModel.findOne({ name: value });
      if (coupon) {
        throw new Error("Coupon is already exist");
      }
      return true;
    }),
  check("expireTime").optional().isDate().withMessage("Invalid Date"),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value) => {
      if (value < 0 || value >= 100) {
        throw new Error("Invalid Discount Value");
      }
      return true;
    }),
  validatorMiddleware,
];
const deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const sendCouponValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email"),
  validatorMiddleware,
];

export {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  sendCouponValidator,
};
