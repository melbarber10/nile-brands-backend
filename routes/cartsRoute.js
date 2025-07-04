import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { addProductToCart, applyCoupon, clearCart, getLoggedInUserCart, removeProductFromCart, updateProductQuantity } from "../controllers/carts.js";
import { addProductToCartValidator, removeProductFromCartValidator, updateProductQuantityValidator } from "../utils/validation/cartsValidation.js";

const cartsRoute = Router();
cartsRoute.use(protectRoutes, checkActive, allowedTo("user"));

cartsRoute
  .route("/")
  .get(getLoggedInUserCart)
  .post(addProductToCartValidator, addProductToCart)
  .delete(clearCart);

cartsRoute.put('/applyCoupon', applyCoupon);

cartsRoute
  .route("/:itemId") // TODO: itemId is belong to object id
  .put(updateProductQuantityValidator, updateProductQuantity)
  .delete(removeProductFromCartValidator, removeProductFromCart);

export default cartsRoute;
