import express from "express";

import {
  fetchLectures,
  getAllCourses,
  getMyCourses,
  getSingleCourse,
  getSingleLecture,
} from "../controllers/CourseController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.get("/getSingleCourse/:courseId", getSingleCourse);
router.get("/getMyCourses", authenticate, getMyCourses);

router.get("/getAllLectures/:courseId", fetchLectures);
router.get("/getSingleLecture/:lectureId", getSingleLecture);

export default router;
