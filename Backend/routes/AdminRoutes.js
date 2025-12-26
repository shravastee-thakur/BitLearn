import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { createCourse, deleteCourse } from "../controllers/AdminController.js";
import { allowRole } from "../middlewares/roleMiddleware.js";
import { securityMiddleware } from "../middlewares/securityMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/createCourse",
  securityMiddleware,
  authenticate,
  allowRole("admin"),
  upload.single("image"),
  createCourse
);
router.delete(
  "/deleteCourse/:courseId",
  securityMiddleware,
  authenticate,
  allowRole("admin"),
  deleteCourse
);

export default router;
