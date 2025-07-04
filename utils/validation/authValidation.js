import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import usersModel from "../../models/usersModel.js";

const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name is Required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50"),
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value) => {
      const user = await usersModel.findOne({ email: value });
      if (user) {
        throw new Error(`email is already exist`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must between 6 and 20 char")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("passwords doesn't match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("confirm password length must between 6 and 20 char"),
  validatorMiddleware,
];
const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must be between 6 & 20 char"),
  validatorMiddleware,
];
const sendMailValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email"),
  validatorMiddleware,
];
const updatePasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must between 6 and 20 char")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("passwords doesn't match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("confirm password length must between 6 and 20 char"),
  validatorMiddleware,
];


export { signupValidator, loginValidator, sendMailValidator, updatePasswordValidator };
