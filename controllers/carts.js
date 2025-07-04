import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import cartsModel from "../models/cartsModel.js";
import apiErrors from "../utils/apiErrors.js";
import productsModel from "../models/productsModel.js";
import couponModel from "../models/couponModel.js";

// get Cart products
const getLoggedInUserCart = asyncHandler(
  async (req, res, next) => {
    const cart = await cartsModel.findOne({ user: req.user?._id });
    if (!cart) {
      throw new apiErrors("Cart not found", StatusCodes.NOT_FOUND);
    }
    res
      .status(StatusCodes.OK)
      .json({ length: cart.cartItems.length, data: cart });
  }
);
// add products to cart
const addProductToCart = asyncHandler(async (req, res, next) => {
  const product = await productsModel.findById(req.body.product);
  if (!product) {
    throw new apiErrors("Product Not found", StatusCodes.NOT_FOUND);
  }

  if (product.quantity <= 0) {
    throw new apiErrors("Product is out of stock", StatusCodes.BAD_REQUEST);
  }

  let cart = await cartsModel.findOne({ user: req.user?._id });

  if (!cart) {
    cart = await cartsModel.create({
      user: req.user?._id,
      cartItems: [{ product: req.body.product, price: product.price }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === req.body.product.toString()
    );

    if (productIndex > -1) {
      if (cart.cartItems[productIndex].quantity >= product.quantity) {
        throw new apiErrors("Product is out of stock", StatusCodes.BAD_REQUEST);
      }
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: req.body.product,
        price: product.price,
      });
    }
  }

  CalculateTotalPrice(cart);
  await cart.save();

  res.status(StatusCodes.OK).json({
    length: cart.cartItems.length,
    data: cart,
  });
});
// remove product from cart
const removeProductFromCart = asyncHandler(
  async (req, res, next) => {
    const cart = await cartsModel.findOneAndUpdate(
      { user: req.user?._id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true }
    );
    CalculateTotalPrice(cart);
    await cart.save();
    res
      .status(StatusCodes.OK)
      .json({ length: cart.cartItems.length, data: cart });
  }
);
// update product quantity
const updateProductQuantity = asyncHandler(async (req, res, next) => {
  const cart = await cartsModel.findOne({ user: req.user?._id });
  if (!cart) {
    throw new apiErrors("Cart not found", StatusCodes.NOT_FOUND);
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId.toString()
  );
  if (productIndex === -1) {
    throw new apiErrors("Product not found in cart", StatusCodes.NOT_FOUND);
  }

  const product = await productsModel.findById(cart.cartItems[productIndex].product);
  if (!product) {
    throw new apiErrors("Product not found", StatusCodes.NOT_FOUND);
  }

  if (req.body.quantity <= 0) {
    throw new apiErrors("Quantity must be at least 1", StatusCodes.BAD_REQUEST);
  }

  if (req.body.quantity > product.quantity) {
    throw new apiErrors(
      `Only ${product.quantity} items available in stock`,
      StatusCodes.BAD_REQUEST
    );
  }

  cart.cartItems[productIndex].quantity = req.body.quantity;

  CalculateTotalPrice(cart);

  await cart.save();

  res.status(StatusCodes.OK).json({
    length: cart.cartItems.length,
    data: cart,
  });
});
// apply Coupon
const applyCoupon = asyncHandler(async (req, res, next) => {
  // Find the coupon and check if it's valid
  const coupon = await couponModel.findOne({
    name: req.body.name,
    expireTime: { $gt: new Date() },
  });

  if (!coupon) {
    throw new apiErrors("Invalid or Expired Coupon", StatusCodes.BAD_REQUEST);
  }

  // Retrieve the user's cart and populate product → brand → owner
  const cart = await cartsModel.findOne({ user: req.user?._id }).populate({
    path: "cartItems.product",
    populate: {
      path: "brand", // Populating the brand field
      select: "owner", // Fetching only the owner field from brand
      populate: { path: "owner", select: "_id" }
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new apiErrors("Your cart is empty", StatusCodes.BAD_REQUEST);
  }

  const productOwners = new Set(
    cart.cartItems.map(item => item.product.brand.owner._id.toString()) // Extract only _id
  );

  // Ensure all products in the cart belong to the same owner
  if (productOwners.size > 1) {
    throw new apiErrors("All products must be from the same brand to apply this coupon", StatusCodes.BAD_REQUEST);
  }

  // Check if the coupon owner matches the product owner (brand owner)
  const cartOwner = [...productOwners][0]; // Extract the single owner from the Set

  if (cartOwner !== coupon.owner.toString()) {
    throw new apiErrors("This coupon is not valid for these products", StatusCodes.BAD_REQUEST);
  }

  // Apply discount
  const totalPrice = cart.totalPrice;
  const totalPriceAfterDiscount = (totalPrice - totalPrice * (coupon.discount / 100)).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(StatusCodes.OK).json({ length: cart.cartItems.length, data: cart });
});
// clear cart
const clearCart = asyncHandler(
  async (req, res, next) => {
    const cart = await cartsModel.findOneAndDelete({ user: req.user?._id });
    res.status(StatusCodes.NO_CONTENT).json();
  }
);
// calculate total cart price
const CalculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

export {
  getLoggedInUserCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  applyCoupon,
  clearCart,
}