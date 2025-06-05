import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json({ limit: "5mb" }));
app.use(helmet());
app.use(cors({
  // origin: "http://localhost:xxxx",
  // credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
  logger.info(`Customer service running on port: http://localhost:${port}`)
  await connectDB();
});

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at", promise, "reason", reason);
});
