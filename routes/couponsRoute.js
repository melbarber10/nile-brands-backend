import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { createCouponValidator, deleteCouponValidator, getCouponValidator, sendCouponValidator, updateCouponValidator } from "../utils/validation/couponValidation.js";
import { createCoupon, deleteCoupon, getCoupon, getCoupons, sendCoupon, updateCoupon } from "../controllers/coupon.js";
import { setLoggedInOwnerId } from "../middlewares/setID.js";

const couponsRoute = Router();

couponsRoute.use(protectRoutes, checkActive, allowedTo("owner"));
couponsRoute.route("/sendCoupon").post(sendCouponValidator, sendCoupon);

// couponsRoute.use();
couponsRoute.route("/")
  .get(getCoupons)
  .post(setLoggedInOwnerId, createCouponValidator, createCoupon);

couponsRoute.route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(setLoggedInOwnerId, updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default couponsRoute;
