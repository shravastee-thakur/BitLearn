import express from "express";

import {
  fetchLectures,
  getAllCourses,
  getMyCourses,
  getSingleCourse,
  getSingleLecture,
  getUserProgress,
  toggleLectureProgress,
} from "../controllers/CourseController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.get("/getSingleCourse/:courseId", getSingleCourse);
router.get("/getMyCourses", authenticate, getMyCourses);

router.get("/getAllLectures/:courseId", authenticate, fetchLectures);
router.get("/getSingleLecture/:lectureId", authenticate, getSingleLecture);

router.get("/getCourseProgress/:courseId", authenticate, getUserProgress);
router.post(
  "/toggleLectureProgress/:courseId/lecture/:lectureId",
  authenticate,
  toggleLectureProgress
);

export default router;
