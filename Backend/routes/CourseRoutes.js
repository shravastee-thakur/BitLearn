import express from "express";

import {
  getAllCourses,
  getMyCourses,
  getSingleCourse,
} from "../controllers/CourseController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.get("/getSingleCourse/:courseId", getSingleCourse);
router.get("/getMyCourses", authenticate, getMyCourses);

export default router;
