import { useContext, useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";

const MyCourses = () => {
  const [mycourse, setMyCourse] = useState([]);
  const { name, accessToken } = useContext(AuthContext);

  const handleMyCourses = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/courses/getMyCourses",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        setMyCourse(res.data.courses);
      }
    } catch (error) {
      console.log("My Courses error", error);
    }
  };

  useEffect(() => {
    handleMyCourses();
  }, [accessToken]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          My Enrolled Courses
        </h2>

        {mycourse && mycourse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {mycourse.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-xl text-gray-600">No courses enrolled yet</p>
            <p className="text-gray-500 mt-2">
              Browse available courses and start your learning journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
