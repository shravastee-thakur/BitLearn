import { uploadImageToCloudinary } from "../config/cloudinary.js";
import Course from "../models/CourseModel.js";
import Lecture from "../models/LectureModel.js";
import User from "../models/UserModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";

export const createCourse = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const sanitizeBody = sanitize(req.body);
    const { title, description, category, createdBy, duration, price } =
      sanitizeBody;

    const uploadImage = await uploadImageToCloudinary(req.file.buffer);

    const course = await Course.create({
      title,
      description,
      image: {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      },
      category,
      createdBy,
      duration,
      price,
    });

    return res
      .status(200)
      .json({ success: true, message: "Course created successfully", course });
  } catch (error) {
    logger.error(`Error in create course: ${error.message}`);
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    await course.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    logger.error(`Error in delete course: ${error.message}`);
    next(error);
  }
};

export const getAllUsers = async (_, res, next) => {
  try {
    const users = await User.find()
      .select("name email subscription")
      .populate("subscription", "title");
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found in database" });
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    logger.error(`Error in get all users: ${error.message}`);
    next(error);
  }
};

export const addLectures = async (req, res, next) => {
  let uploadVideo;
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File not found" });
    }

    const sanitizeBody = sanitize(req.body);
    const { courseId, title, description } = sanitizeBody;
    if (!courseId || !title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({
        message: "Course not found",
      });

    uploadVideo = await uploadImageToCloudinary(req.file.buffer);

    const lecture = await Lecture.create({
      title,
      description,
      video: {
        url: uploadVideo.secure_url,
        public_id: uploadVideo.public_id,
      },
      courseId,
    });

    course.lectures.push(lecture._id);
    await course.save();

    return res
      .status(200)
      .json({ success: true, message: "Lecture added successfully", lecture });
  } catch (error) {
    if (uploadVideo?.public_id) {
      await cloudinary.uploader.destroy(uploadVideo.public_id);
    }

    logger.error(`Error in add lecture: ${error.message}`);
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    if (req.file) {
      if (lecture.video?.public_id) {
        await cloudinary.uploader.destroy(lecture.video.public_id);
      }
    }

    await Course.findByIdAndUpdate(lecture.courseId, {
      $pull: { lectures: lectureId },
    });

    await lecture.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted and course syllabus updated",
    });
  } catch (error) {
    logger.error(`Error in delete lecture: ${error.message}`);
    next(error);
  }
};

export const totalStats = async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalUsers = await User.countDocuments();

    const stats = {
      totalCourses,
      totalLectures,
      totalUsers,
    };

    return res.json({ success: true, stats });
  } catch (error) {
    logger.error(`Error in getting total stats`);
    next(error);
  }
};
