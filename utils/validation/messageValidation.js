import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import usersModel from "../../models/usersModel.js";

const getMessagesValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (value) => {
      const userExists = await usersModel.exists({ _id: value });
      if (!userExists) {
        throw new Error("User not found");
      }
      return true;
    }),
  validatorMiddleware,
];

const sendMessageValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User ID")
    .custom(async (value) => {
      const userExists = await usersModel.exists({ _id: value });
      if (!userExists) {
        throw new Error("User not found");
      }
      return true;
    }),
  check("text")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Text cannot be empty if provided")
    .isLength({ max: 500 })
    .withMessage("Text cannot exceed 500 characters"),
  check("text")
    .custom((value, { req }) => {
      if (!value && !req.file) {
        throw new Error("Message must contain either text or an image");
      }
      return true;
    }),
  validatorMiddleware,
];

export { getMessagesValidator, sendMessageValidator };
