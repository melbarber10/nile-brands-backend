import { Router } from "express";
import {
  createProduct,
  deleteProduct, getProduct,
  getProducts, handleProductImage, updateProduct,
  uploadProductImages
} from "../controllers/products.js";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidation.js";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { filterBrandProducts } from "../middlewares/filterData.js";
import { setBrandId } from "../middlewares/setID.js";
import reviewsRoute from "./reviewsRoute.js";

const productsRoute = Router({ mergeParams: true });
productsRoute.use("/:productId/reviews", reviewsRoute);

productsRoute
  .route("/")
  .get(filterBrandProducts, getProducts)
  .post(
    protectRoutes,
    checkActive,
    allowedTo("owner"),
    uploadProductImages,
    handleProductImage,
    setBrandId,
    createProductValidator,
    createProduct);

productsRoute
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protectRoutes,
    checkActive,
    allowedTo("owner"),
    uploadProductImages,
    handleProductImage,
    setBrandId,
    updateProductValidator,
    updateProduct)
  .delete(
    protectRoutes,
    checkActive,
    allowedTo("owner", "admin"),
    deleteProductValidator,
    deleteProduct);

export default productsRoute;