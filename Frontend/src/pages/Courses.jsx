import { useContext } from "react";
import CourseCard from "../components/CourseCard";
import { CourseContext } from "../context/CourseProvider";

const Courses = () => {
  const { courses } = useContext(CourseContext);

  return (
    <div className="min-h-[60vh] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#8a4baf]">
          Available Courses
        </h2>

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg text-center mt-12">
            No Courses Yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default Courses;
