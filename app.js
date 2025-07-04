import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
import startServer from "./utils/startServer.js";
import mountRoutes from "./routes/index.js";
import { app } from "./config/socket.js";

dotenv.config();

// limit the size of the body to 10kb
app.use(express.json({ limit: "10kb" }));
// cors is used to allow cross-origin requests
app.use(cors({
  origin: [
    'http://localhost:4200',     // Angular development
    '*'                         // Allow all origins (for Flutter mobile)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// compression is used to compress the response body
app.use(compression());
// mongoSanitize is used to sanitize the request body
app.use(mongoSanitize());
// hpp is used to prevent parameter pollution
app.use(hpp({ whitelist: ['price', 'category', 'subcategory', 'ratingAverage', 'sold'] }));
// helmet is used to secure the headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
// express.static is used to serve static files
app.use(express.static("uploads"))




mountRoutes(app);
startServer(app);