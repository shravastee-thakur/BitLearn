import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const CourseCard = ({ course, onDelete }) => {
  const navigate = useNavigate();
  const { role, accessToken, user, verified } = useContext(AuthContext);

  const handleStudyClick = () => navigate(`/course/study/${course._id}`);

  const handleGetStartedClick = () =>
    navigate(verified ? `/course/${course._id}` : "/login");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/admin/deleteCourse/${course._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        onDelete(course._id);
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.success("Failed to delete course", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // Determine button text and action
  // const showStudyButton =
  //   role === "admin" || user?.subscription?.includes(course._id);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[280px] hover:shadow-lg transition-shadow duration-300">
      <div className="relative pb-[60%] bg-gray-200">
        <img
          src={course.image.url}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Instructor: {course.createdBy}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Duration: {course.duration} hours
        </p>
        <p className="text-sm text-gray-800 font-medium mb-4">
          Price: ₹{course.price.toLocaleString()}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          {verified ? (
            <button
              onClick={handleStudyClick}
              className="px-4 py-2 bg-[#476EAE] text-white rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#476EAE] focus:ring-opacity-50"
            >
              Study
            </button>
          ) : (
            <button
              onClick={handleGetStartedClick}
              className="px-4 py-2 bg-[#476EAE] text-white rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#476EAE] focus:ring-opacity-50"
            >
              Get Started
            </button>
          )}

          {role === "admin" && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
