import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  handleBrandLogo,
  updateBrand,
  uploadBrandLogo
} from "../controllers/brand.js";
import productsRoute from "./productsRoute.js";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { createBrandValidator, deleteBrandValidator, updateBrandValidator } from "../utils/validation/brandValidation.js";
import { setLoggedInOwnerId } from "../middlewares/setID.js";

const brandsRoute = Router();

brandsRoute.use("/:brandId/products", productsRoute);

brandsRoute
  .route("/")
  .get(getBrands)
  .post(
    protectRoutes,
    checkActive,
    allowedTo("owner"),
    uploadBrandLogo,
    handleBrandLogo,
    setLoggedInOwnerId,
    createBrandValidator,
    createBrand
  );

brandsRoute
  .route("/:id")
  .get(getBrand)
  .put(
    protectRoutes,
    checkActive,
    allowedTo("owner"),
    uploadBrandLogo,
    handleBrandLogo,
    setLoggedInOwnerId,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    protectRoutes,
    checkActive,
    allowedTo("owner", "admin"),
    deleteBrandValidator,
    deleteBrand
  );

export default brandsRoute;