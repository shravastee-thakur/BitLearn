const ComingCourses = () => {
  const courses = [
    {
      title: "Web Development Ultimate Course",
      image: "/Webdev.png",
      tag: "COMING SOON",
      color: "bg-blue-500",
    },
    {
      title: "MERN Stack Ultimate Course",
      image: "/MERN.png",
      tag: "COMING SOON",
      color: "bg-green-500",
    },
    {
      title: "Python Ultimate Course",
      image: "/Python.png",
      tag: "COMING SOON",
      color: "bg-yellow-500",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Upcoming Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-end p-6">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${course.color} mb-2`}
                >
                  {course.tag}
                </span>
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
              </div>

              {/* Hover Overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <button className="bg-yellow-300 text-black px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors">
                  Notify Me
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {/* <div className="mt-10 text-center">
          <p className="text-gray-600">
            Want early access?{" "}
            <a href="#" className="text-[#2f7003] font-medium hover:underline">
              Join our waitlist
            </a>
          </p>
        </div> */}
      </div>
    </section>
  );
};

export default ComingCourses;
