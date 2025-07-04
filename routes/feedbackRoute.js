import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { createFeedback, deleteFeedback, getFeedback, getFeedbacks, updateFeedback } from "../controllers/feedback.js";
import { createFeedbackValidator, deleteFeedbackValidator, getFeedbackValidator, updateFeedbackValidator } from "../utils/validation/feedbackValidation.js";
import { setLoggedInUserIdAndOwnerId } from "../middlewares/setID.js";

const feedbackRoute = Router();

feedbackRoute
  .route("/")
  .get(getFeedbacks)
  .post(
    protectRoutes,
    checkActive,
    allowedTo('user', 'owner'),
    setLoggedInUserIdAndOwnerId,
    createFeedbackValidator, createFeedback);

feedbackRoute
  .route("/:id")
  .get(getFeedbackValidator, getFeedback)
  .put(
    protectRoutes,
    checkActive,
    allowedTo('user', 'owner'),
    setLoggedInUserIdAndOwnerId,
    updateFeedbackValidator, updateFeedback)
  .delete(
    protectRoutes,
    checkActive,
    allowedTo('user', 'owner'),
    deleteFeedbackValidator, deleteFeedback);

export default feedbackRoute;
