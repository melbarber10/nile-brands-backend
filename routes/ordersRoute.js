import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { filterUserOrders } from "../middlewares/filterData.js";
import { createOrder, getOwnerOrders, getUserOrders, isOrderPaid, trackOrder, updateOrderStatus } from "../controllers/orders.js";
import { createOrderValidator, orderValidator, updateStatusValidator } from "../utils/validation/ordersValidation.js";

const ordersRoute = Router();
ordersRoute.use(protectRoutes, checkActive);

ordersRoute
  .route("/")
  .get(allowedTo("user"), filterUserOrders, getUserOrders)
  .post(allowedTo("user"), createOrderValidator, createOrder);

ordersRoute.route("/trackOrder/:id").get(orderValidator, trackOrder);

ordersRoute.use(allowedTo("owner"))
ordersRoute.route("/myOrders").get(getOwnerOrders);
ordersRoute.route("/:id/paid").put(orderValidator, isOrderPaid);
ordersRoute.route("/:id/updateStatus").put(updateStatusValidator, updateOrderStatus);

export default ordersRoute;
