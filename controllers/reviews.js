import reviewsModel from "../models/reviewsModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler.js";

const createReview = createOne(reviewsModel);
const getReviews = getAll(reviewsModel, "reviews");
const getReview = getOne(reviewsModel);
const updateReview = updateOne(reviewsModel);
const deleteReview = deleteOne(reviewsModel);

export {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
}