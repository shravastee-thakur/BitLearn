import Course from "../models/CourseModel.js";
import Lecture from "../models/LectureModel.js";
import Progress from "../models/ProgressModel.js";
import User from "../models/UserModel.js";
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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const courses = await Course.find({
      _id: { $in: user.subscription },
    }).select("-createdBy");

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

export const getUserProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const progress = await Progress.findOne({ course: courseId, user: userId });

    const lectLength = course.lectures.length;
    const completedLec = progress ? progress.completedLectures.length : 0;

    return res.status(200).json({
      success: true,
      progressData: {
        completedLec,
        lectLength,
        completedLecturesIds: progress ? progress.completedLectures : [],
      },
    });
  } catch (error) {
    logger.error(`Error in get course progress: ${error.message}`);
    next(error);
  }
};

export const toggleLectureProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId, lectureId } = req.params;

    let progress = await Progress.findOne({ course: courseId, user: userId });
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLectures: [],
      });
    }

    const isAlreadyCompleted = progress.completedLectures.includes(lectureId);

    if (isAlreadyCompleted) {
      progress.completedLectures = progress.completedLectures.filter(
        (id) => id.toString() !== lectureId
      );
    } else {
      progress.completedLectures.push(lectureId);
    }

    await progress.save();

    const course = await Course.findById(courseId);

    res.status(201).json({
      success: true,
      progressData: {
        completedLec: progress.completedLectures.length,
        lectLength: course.lectures.length,
        completedLecturesIds: progress.completedLectures,
      },
    });
  } catch (error) {
    logger.error(`Error in toggle lecture progress: ${error.message}`);
    next(error);
  }
};
