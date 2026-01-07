const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image: "/Avatar4.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image: "/Avatar3.jpg",
    },
    {
      id: 3,
      name: "Alex Johnson",
      position: "Learner",
      message:
        "The structure of each course is intuitive, and the support from the community is incredible. Highly recommend!",
      image: "/Avatar1.jpg",
    },
    {
      id: 4,
      name: "Priya Mehta",
      position: "Student",
      message:
        "As a working professional, I needed flexible learning. This platform made upskilling seamless and engaging.",
      image: "/Avatar2.jpg",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold text-center text-black mb-12">
          What Our Students Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-sky-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full"
            >
              {/* Quote Icon */}
              <div className="text-[#0f4aa8] text-4xl mb-4 opacity-60">“</div>

              {/* Message */}
              <p className="text-gray-700 mb-6 flex-grow text-sm md:text-base">
                {testimonial.message}
              </p>

              {/* Avatar & Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#476EAE] mr-4"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-[#476EAE]">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
