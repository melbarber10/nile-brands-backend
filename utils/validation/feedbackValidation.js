import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import feedbackModel from "../../models/feedbackModel.js";

const createFeedbackValidator = [
  check("comment").notEmpty().withMessage("Comment is required"),
  check("rating").notEmpty().withMessage("Rating is required"),
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value) => {
        const feedback = await feedbackModel.findOne({user: value});
        if (feedback) {
          throw new Error("Feedback already exist");
        }
        return true;
      }),
  validatorMiddleware,
];
const getFeedbackValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateFeedbackValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value, { req }) => {
      const feedback = await feedbackModel.findById(value);
      if (!feedback) {
        throw new Error("Feedback not exist");
      }
      if (feedback.user._id.toString() !== req.user._id.toString()) {
        throw new Error("Unauthorized to update this feedback");
      }
      return true;
    }),
  validatorMiddleware,
];
const deleteFeedbackValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value, { req }) => {
        const feedback = await feedbackModel.findById(value);
        if (!feedback) {
          throw new Error("Feedback not exist");
        }
        if (feedback.user._id.toString() !== req.user._id.toString()) {
          throw new Error("Unauthorized to delete this feedback");
        }
      return true;
    }),
  validatorMiddleware,
];

export {
  createFeedbackValidator,
  getFeedbackValidator,
  updateFeedbackValidator,
  deleteFeedbackValidator,
}