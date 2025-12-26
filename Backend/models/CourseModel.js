import mongoose from "mongoose";
import Lecture from "./LectureModel.js";
import { v2 as cloudinary } from "cloudinary";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  { timestamps: true }
);
courseSchema.index({ createdAt: -1 });
courseSchema.index({ category: 1 });

courseSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    try {
      const courseId = this._id;

      const courseLectures = await Lecture.find({ courseId: courseId });

      const cloudinaryDeletions = [];
      // Delete the course image from Cloudinary if it exists
      if (this.image?.public_id) {
        cloudinaryDeletions.push(
          cloudinary.uploader.destroy(this.image.public_id)
        );
      }

      // Delete videos from lectures if they exist
      courseLectures.forEach((lecture) => {
        if (lecture.video?.public_id) {
          cloudinaryDeletions.push(
            cloudinary.uploader.destroy(lecture.video.public_id)
          );
        }
      });

      await Promise.all(cloudinaryDeletions);
      await Lecture.deleteMany({ courseId: courseId });
    } catch (error) {
      console.log(error);
    }
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
