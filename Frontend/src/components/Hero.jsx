import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-[#476EAE] pt-8 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
        {/* Left Side - Text Content */}
        <div className="lg:w-1/2 text-white space-y-6 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left">
            BitLearn
          </h1>
          <p className="text-xl px-8 md:text-2xl md:px-0 font-medium text-center lg:text-left">
            Transforming Education, One Click Away
          </p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 mt-4">
            Explore courses
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/Herogirl.png"
            alt="Student with laptop"
            className="h-[300px] md:h-[400px] w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
