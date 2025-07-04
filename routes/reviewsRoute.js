import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview
} from "../controllers/reviews.js";
import { filterReviews } from "../middlewares/filterData.js";
import { setProductAndUserId } from "../middlewares/setID.js";
import { createReviewValidator, deleteReviewValidator, getReviewValidator, updateReviewValidator } from "../utils/validation/reviewsValidation.js";

const reviewsRoute = Router({ mergeParams: true });

reviewsRoute
  .route("/")
  .get(filterReviews, getReviews)
  .post(
    protectRoutes,
    checkActive,
    allowedTo("user"),
    setProductAndUserId,
    createReviewValidator,
    createReview
  );

reviewsRoute
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    protectRoutes,
    checkActive,
    allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    protectRoutes,
    checkActive,
    allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

export default reviewsRoute;
