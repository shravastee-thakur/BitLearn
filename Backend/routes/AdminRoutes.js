import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllUsers,
  totalStats,
} from "../controllers/AdminController.js";
import { allowRole } from "../middlewares/roleMiddleware.js";
import { securityMiddleware } from "../middlewares/securityMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

// Course
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

// User
router.get(
  "/getAllUsers",
  securityMiddleware,
  authenticate,
  allowRole("admin"),
  getAllUsers
);

//Lecture
router.post(
  "/addLecture",
  securityMiddleware,
  authenticate,
  allowRole("admin"),
  upload.single("video"),
  addLectures
);

router.delete(
  "/deleteLecture/:lectureId",
  securityMiddleware,
  authenticate,
  allowRole("admin"),
  deleteLecture
);

router.get("/getTotalStats", authenticate, allowRole("admin"), totalStats);

export default router;
