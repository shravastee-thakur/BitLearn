import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, user, deleteHandler }) => {
  const navigate = useNavigate();

  const handleStudyClick = () => navigate(`/course/study/${course._id}`);
  const handleDeleteClick = () => deleteHandler(course._id);

  // Determine button text and action
  // const showStudyButton =
  //   isAuth &&
  //   (user?.role === "admin" || user?.subscription?.includes(course._id));

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
          Duration: {course.duration} weeks
        </p>
        <p className="text-sm text-gray-800 font-medium mb-4">
          Price: ₹{course.price.toLocaleString()}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          {/* {showStudyButton ? (
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
          )} */}

          {/* {user?.role === "admin" && (
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
