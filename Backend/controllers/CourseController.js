import Course from "../models/CourseModel.js";
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
