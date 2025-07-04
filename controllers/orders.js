import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import cartsModel from "../models/cartsModel.js";
import ordersModel from "../models/ordersModel.js";
import apiErrors from "../utils/apiErrors.js";
import { getAll } from "./refactorHandler.js";
import productsModel from "../models/productsModel.js";

const getUserOrders = getAll(ordersModel, "orders");
const trackOrder = asyncHandler(async (req, res, next) => {
  const order = await ordersModel.findById(req.params.id)
  if (!order) {
    throw new apiErrors("Order not found", StatusCodes.NOT_FOUND);
  }
  if (order.user?._id.toString() !== req.user?._id.toString()) {
    throw new apiErrors("You are not authorized to view this order", StatusCodes.FORBIDDEN);
  }
  res.status(StatusCodes.OK).json({ status: order.status });
});
const getOwnerOrders = asyncHandler(async (req, res, next) => {
  const orders = await ordersModel.find().populate({
    path: "cartItems.product",
    populate: {
      path: "brand",
      select: "owner",
      populate: { path: "owner", select: "_id" },
    },
  });
  const ownerId = req.user?._id.toString();
  const filteredOrders = orders
    .filter(order =>
      order.cartItems.some(item => item.product.brand.owner?._id.toString() === ownerId)
    )
    .map(order => ({
      ...order.toObject(),
      cartItems: order.cartItems.filter(item => item.product.brand.owner?._id.toString() === ownerId)
    }));

  res.status(StatusCodes.OK).json({ length: filteredOrders.length, data: filteredOrders });
})
const createOrder = asyncHandler(async (req, res, next) => {
  const cart = await cartsModel.findOne({ user: req.user?._id }).populate({
    path: "cartItems.product",
    populate: { path: "brand", select: "_id name" },
  });
  if (!cart) {
    throw new apiErrors("User cart not found", StatusCodes.NOT_FOUND);
  }
  const brandIds = new Set(cart.cartItems.map(item => item.product.brand?._id.toString()));
  if (brandIds.size > 1) {
    throw new apiErrors("All items in the cart must belong to the same brand", StatusCodes.BAD_REQUEST);
  }
  const totalOrderPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const order = await ordersModel.create({
    user: req.user?._id,
    cartItems: cart.cartItems,
    totalPrice: totalOrderPrice,
    address: req.body.address,
  });
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productsModel.bulkWrite(bulkOptions);
    await cartsModel.findByIdAndDelete(cart._id);
  }

  res.status(StatusCodes.CREATED).json({ data: order });
});
const isOrderPaid = asyncHandler(
  async (req, res, next) => {
  const order = await ordersModel.findByIdAndUpdate(req.params.id, {
    isPaid: true,
    paidAt: Date.now()
  }, { new: true })
    if (!order) {
      throw new apiErrors("order not found", StatusCodes.NOT_FOUND);
    };
  res.status(StatusCodes.OK).json({ data: order })
});
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await ordersModel.findById(req.params.id).populate({
    path: "cartItems.product",
    populate: {
      path: "brand",
      select: "owner",
      populate: { path: "owner", select: "_id" },
    },
  });
  if (!order) {
    throw new apiErrors("Order not found", StatusCodes.NOT_FOUND);
  }
  const productOwners = new Set(order.cartItems.map(item => item.product.brand.owner?._id.toString()));
  const ownerId = req.user?._id.toString();
  if (productOwners.size > 1 || !productOwners.has(ownerId)) {
    throw new apiErrors("You are not authorized to update this order status", StatusCodes.FORBIDDEN);
  }
  order.status = req.body.status;
  await order.save();

  res.status(StatusCodes.OK).json({ data: order });
});

export {
  getUserOrders,
  getOwnerOrders,
  updateOrderStatus,
  createOrder,
  isOrderPaid,
  trackOrder
}