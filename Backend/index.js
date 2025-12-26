import dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "./utils/logger.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import connectdb from "./config/connectdb.js";
import passport from "./config/passport.js";

import userRoutes from "./routes/UserRoutes.js";
import courseRoutes from "./routes/CourseRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;
connectdb();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(passport.initialize());

// Routes
app.use("/api/v1/users", userRoutes);
// http://localhost:3000/api/v1/users/register

app.use("/api/v1/courses", courseRoutes);
// http://localhost:3000/api/v1/courses/getAllCourses

app.use("/api/v1/admin", adminRoutes);
// http://localhost:3000/api/v1/admin/createCourse




app.use((req, _, next) => {
  next({ statusCode: 404, message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Listerning on port: http://localhost:${PORT}`);
});
