import { useContext, useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { CourseContext } from "../context/CourseProvider";

const Courses = () => {
  const { getAllCourses } = useContext(CourseContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-[60vh] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#8a4baf]">
          Available Courses
        </h2>

        {courses && courses.length > 0 ? (
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl justify-items-center">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No Courses Yet!</p>
            <p className="text-gray-500 mt-2">
              Check back soon for new learning opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
