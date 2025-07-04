import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { getDashboardStats, getProductPerformance, getSalesTrends } from "../controllers/analytics.js";

const analyticsRoute = Router();

analyticsRoute.use(protectRoutes, checkActive, allowedTo("owner"));

analyticsRoute.get("/dashboard", getDashboardStats);
analyticsRoute.get("/trends", getSalesTrends);
analyticsRoute.get("/products", getProductPerformance);

export default analyticsRoute; 