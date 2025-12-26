import { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { verified, name, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#476EAE] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 flex justify-between items-center">
          {/* Logo */}
          {/* <div className="text-2xl font-bold text-[#FFEF5F]">BitLearn</div> */}
          <div>
            <Link to={"/"} className="flex items-center">
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

              <span className="ml-2 text-xl font-bold text-white">
                BitLearn
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <p className="hover:text-gray-200 transition-colors cursor-pointer">
              Courses
            </p>
            <p className="hover:text-gray-200 transition-colors cursor-pointer">
              <Link to={"/admin-panel"}>Admin</Link>
            </p>

            {verified ? (
              <>
                <p className="hover:text-gray-200 transition-colors cursor-pointer">
                  Welcome, <span className="font-bold">{name}</span>
                </p>
                <p
                  onClick={handleLogout}
                  className="hover:text-gray-200 transition-colors cursor-pointer"
                >
                  Logout
                </p>
              </>
            ) : (
              <p className="hover:text-gray-200 transition-colors cursor-pointer">
                <Link to={"/login"}>Login</Link>
              </p>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={closeMenu}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Sliding Menu */}
          <div
            className="absolute top-0 right-0 h-full w-1/2 bg-[#476EAE] text-white flex flex-col p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end text-white mb-8 focus:outline-none"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <ClearIcon />
            </button>

            <nav className="flex flex-col space-y-6 mt-4">
              <a
                href="#"
                className="text-xl hover:text-gray-200 transition-colors"
                onClick={closeMenu}
              >
                Welcome
              </a>
              <a
                href="#"
                className="text-xl hover:text-gray-200 transition-colors"
                onClick={closeMenu}
              >
                Courses
              </a>
              <a
                href="#"
                className="text-xl hover:text-gray-200 transition-colors"
                onClick={closeMenu}
              >
                Admin
              </a>
              <a
                href="#"
                className="text-xl hover:text-gray-200 transition-colors"
                onClick={closeMenu}
              >
                Login
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
