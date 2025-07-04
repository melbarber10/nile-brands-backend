import { check } from "express-validator";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import usersModel from "../../models/usersModel.js";

const createUserValidator = [
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
const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50"),
  check("active").optional().isBoolean().withMessage("Invalid Active value"),
  validatorMiddleware,
];
const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const changeUserPasswordValidator = [
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
const updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 and 50"),
  validatorMiddleware,
];
const changeLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("current password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("current password length must between 6 and 20 char")
    .custom(async (value, { req }) => {
      const user = await usersModel.findById(req.user._id);
      const isCorrectPassword = await bcrypt.compare(
        value,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Invalid password");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must between 6 and 20 char")
    .custom(async (value, { req }) => {
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

export {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator, 
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserPasswordValidator
};