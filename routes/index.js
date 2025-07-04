import errorHandlerMiddleware from "../middlewares/errorHandler.js";
import notFoundMiddleware from "../middlewares/notFound.js";
import categoriesRoute from "./categoriesRoute.js";
import subcategoriesRoute from "./subcategoriesRoute.js";
import productsRoute from "./productsRoute.js";
import reviewsRoute from "./reviewsRoute.js";
import wishlistRoute from "./wishlistRoute.js";
import couponsRoute from "./couponsRoute.js";
import cartsRoute from "./cartsRoute.js";
import ordersRoute from "./ordersRoute.js";
import paymentRoute from "./paymentRoute.js";
import usersRoute from "./usersRoute.js";
import brandsRoute from "./brandsRoute.js";
import authRoute from "./authRoute.js";
import feedbackRoute from "./feedbackRoute.js";
import messageRoute from "./messageRoute.js";
import analyticsRoute from "./analyticsRoute.js";

const mountRoutes = (app) => {
  app.use('/api/v1/categories', categoriesRoute);
  app.use('/api/v1/subcategories', subcategoriesRoute);
  app.use('/api/v1/products', productsRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/coupons", couponsRoute);
  app.use("/api/v1/carts", cartsRoute);
  app.use("/api/v1/orders", ordersRoute);
  app.use("/api/v1/payments", paymentRoute);
  app.use('/api/v1/users', usersRoute);
  app.use('/api/v1/brands', brandsRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/feedback', feedbackRoute);
  app.use('/api/v1/messages', messageRoute);
  app.use('/api/v1/analytics', analyticsRoute);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware)
}

export default mountRoutes;