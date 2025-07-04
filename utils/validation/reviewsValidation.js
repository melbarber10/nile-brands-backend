import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import reviewsModel from "../../models/reviewsModel.js";

const createReviewValidator = [
  check("comment").notEmpty().withMessage("Comment is required"),
  check("rating").notEmpty().withMessage("Rating is required"),
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id"),
  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value, { req }) => {
      const review = await reviewsModel.findOne({ user: req.user._id, product: value });
      if (review) {
        throw new Error("Review already exist");
      }
      return true;
    }),
  validatorMiddleware,
];
const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Mongo Id"),
  validatorMiddleware,
];
const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value, { req }) => {
      const review = await reviewsModel.findById(value);
      if (!review) {
        throw new Error("Review not exist");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("Unauthorized to update this review");
      }
      return true;
    }),
  validatorMiddleware,
];
const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Mongo Id")
    .custom(async (value, { req }) => {
      if (req.user.role === "user") {
        const review = await reviewsModel.findById(value);
        if (!review) {
          throw new Error("Review not exist");
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("Unauthorized to delete this review");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

export {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
}