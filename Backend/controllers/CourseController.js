import Course from "../models/CourseModel.js";
import Lecture from "../models/LectureModel.js";
import logger from "../utils/logger.js";

export const getAllCourses = async (_, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found" });
    }

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    logger.error(`Error in get all courses: ${error.message}`);
    next(error);
  }
};

export const getSingleCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, course });
  } catch (error) {
    logger.error(`Error in get single course: ${error.message}`);
    next(error);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    // returns every document whose ID matches one of the IDs in that array
    const courses = await Course.find({ _id: req.user.subscription }).select(
      "-createdBy"
    );
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found" });
    }

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    logger.error(`Error in get single course: ${error.message}`);
    next(error);
  }
};

export const fetchLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    logger.error(`Error in fetching lectures: ${error.message}`);
    next(error);
  }
};

export const getSingleLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    logger.error(`Error in fetching single lecture: ${error.message}`);
    next(error);
  }
};
