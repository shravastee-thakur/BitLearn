import { uploadImageToCloudinary } from "../config/cloudinary.js";
import Course from "../models/CourseModel.js";
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
