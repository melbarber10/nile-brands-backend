import { Router } from "express";
import { confirmPayment, createPaymentIntent } from "../controllers/payment.js";
import createPaymentIntentValidator from "../utils/validation/paymentValidation.js";

const paymentRoute = Router();

paymentRoute.route("/").post(createPaymentIntentValidator, createPaymentIntent);
paymentRoute.route("/confirmPayment").post(confirmPayment);

export default paymentRoute;
