import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { addProductToWishList, getLoggedinUserWishlist, removeProductFromWishList } from "../controllers/wishlist.js";

const wishlistRoute = Router();
wishlistRoute.use(protectRoutes, checkActive, allowedTo('user'));

wishlistRoute
  .route("/")
  .get(getLoggedinUserWishlist)
  .post(addProductToWishList)

wishlistRoute
  .route("/:product")
  .delete(removeProductFromWishList);


export default wishlistRoute;
