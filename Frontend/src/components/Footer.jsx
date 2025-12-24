import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1c355d] text-gray-300 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Logo */}
        <div>
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-yellow-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-white">BitLearn</span>
          </div>
          <p className="mt-4 text-sm">
            Smart. Simple. Secure learning experiences.
          </p>
        </div>

        {/* Column 2: Company */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            {["About us", "Careers", "Contact us", "Blog"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-[#2f7003] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            {[
              "Discover BitLearn",
              "Get the app",
              "Teach on BitLearn",
              "Plans and Pricing",
              "Help and Support",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-[#2f7003] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            {[
              "Accessibility statement",
              "Privacy policy",
              "Sitemap",
              "Terms",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-[#2f7003] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-4 text-center text-white text-sm">
        <p>Copyright © 2025 Shravastee Thakur</p>
      </div>
    </footer>
  );
};

export default Footer;
