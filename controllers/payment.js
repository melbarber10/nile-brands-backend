import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import apiErrors from "../utils/apiErrors.js";
import ordersModel from "../models/ordersModel.js";
import stripe from "../config/stripe.js";

const createPaymentIntent = asyncHandler(
  async (req, res, next) => {
    const { orderId } = req.body;
    const order = await ordersModel.findById(orderId);
    if (!order) {
      throw new apiErrors("Order not found", StatusCodes.NOT_FOUND);
    }
    if (order.isPaid) {
      throw new apiErrors("Order is already paid", StatusCodes.BAD_REQUEST);
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { orderId },
    });
    res
      .status(StatusCodes.OK).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
  }
);

const confirmPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const orderId = paymentIntent.metadata.orderId;
  const order = await ordersModel.findById(orderId);

  if (!order) {
    throw new apiErrors("Order not found", StatusCodes.NOT_FOUND);
  }

  if (paymentIntent.status === "succeeded") {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "shipped";
    await order.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment confirmed and order updated",
    });
  }

  if (paymentIntent.status === "canceled") {
    order.status = "canceled";
    await order.save();
  }

  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: `Payment status: ${paymentIntent.status}`,
  });
});


export { createPaymentIntent, confirmPayment };