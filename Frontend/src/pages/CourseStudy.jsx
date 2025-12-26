// CourseStudy.jsx
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";

const CourseStudy = ({ user }) => {
  const { id } = useParams(); // destructure for clarity
  const { fetchCourse, course, loading } = CourseData();
  const navigate = useNavigate();

  // Guard clause: redirect unauthorized users
  useEffect(() => {
    if (!user) return; // wait for user data if needed

    const isAuthorized =
      user.role === "admin" ||
      (user.subscription && user.subscription.includes(id));

    if (!isAuthorized) {
      navigate("/");
    }
  }, [user, id, navigate]);

  // Fetch course on mount or when ID changes
  useEffect(() => {
    if (id) fetchCourse(id);
  }, [id]);

  // Show loading state
  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse w-64 h-64 bg-gray-200 rounded-xl mx-auto mb-6"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Course Image */}
          <div className="relative pb-[56.25%] bg-gray-200">
            {" "}
            {/* 16:9 aspect ratio */}
            <img
              src={course.image?.url || "/placeholder-course.jpg"}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Course Info */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {course.title}
            </h1>

            <p className="text-gray-600 mb-4 text-lg">{course.description}</p>

            <div className="flex flex-wrap gap-4 mb-8 text-gray-700">
              <div className="flex items-center">
                <span className="font-medium">Instructor:</span>
                <span className="ml-2">{course.createdBy}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Duration:</span>
                <span className="ml-2">{course.duration} weeks</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Price:</span>
                <span className="ml-2">
                  ₹{course.price?.toLocaleString() || "Free"}
                </span>
              </div>
            </div>

            {/* Lectures Button */}
            <Link
              to={`/lectures/${course._id}`}
              className="block w-full sm:w-auto text-center px-6 py-3 bg-[#476EAE] text-white font-medium rounded-lg hover:bg-[#3a5a8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#476EAE] focus:ring-offset-2"
            >
              View Lectures
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStudy;
