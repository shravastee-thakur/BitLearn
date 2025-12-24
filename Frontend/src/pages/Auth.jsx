import { useContext, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate("/verify-otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 font-medium text-center transition-colors ${
              activeTab === "login"
                ? "text-[#476EAE] border-b-2 border-[#0ca90c] bg-[#476EAE]/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 py-4 font-medium text-center transition-colors ${
              activeTab === "register"
                ? "text-[#476EAE] border-b-2 border-[#0ca90c] bg-[#476EAE]/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  onChange={handleChanges}
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#476EAE] focus:border-[#476EAE] outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={handleChanges}
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    value={formData.password}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#476EAE] focus:border-[#476EAE] outline-none transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#476EAE] text-white py-2.5 rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors"
              >
                Log In
              </button>

              <div className="mt-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <img
                    src="/google.svg"
                    alt="google logo"
                    className="w-6 h-6"
                  />
                  Continue with Google
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  onChange={handleChanges}
                  type="text"
                  id="register-name"
                  name="name"
                  value={formData.name}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#476EAE] focus:border-[#476EAE] outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  onChange={handleChanges}
                  type="email"
                  id="register-email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#476EAE] focus:border-[#476EAE] outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={handleChanges}
                    type={showRegisterPassword ? "text" : "password"}
                    id="register-password"
                    name="password"
                    value={formData.password}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#476EAE] focus:border-[#476EAE] outline-none transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    aria-label={
                      showRegisterPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showRegisterPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#476EAE] text-white py-2.5 rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                By registering, you agree to our{" "}
                <a href="#" className="text-[#476EAE] hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#476EAE] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
