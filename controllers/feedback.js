import feedbackModel from "../models/feedbackModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler.js";

const createFeedback = createOne(feedbackModel);
const getFeedbacks = getAll(feedbackModel, "feedback");
const getFeedback = getOne(feedbackModel);
const updateFeedback = updateOne(feedbackModel);
const deleteFeedback = deleteOne(feedbackModel);

export {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
}