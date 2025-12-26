import { useState, useEffect, useContext } from "react";
import CourseCard from "../components/CourseCard";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CourseContext } from "../context/CourseProvider";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";

const AdminPanel = () => {
  const { accessToken } = useContext(AuthContext);

  const { getAllCourses } = useContext(CourseContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    createdBy: "",
    duration: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/admin/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [accessToken]);

  useEffect(() => {
    const loadCourses = async () => {
      const courseData = await getAllCourses();
      setCourses(courseData);
    };
    loadCourses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log(formData);
  };

  // Handle course submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("createdBy", formData.createdBy);
    data.append("duration", formData.duration);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/admin/createCourse",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        setFormData({
          title: "",
          description: "",
          category: "",
          price: "",
          createdBy: "",
          duration: "",
          image: null,
        });
        setImagePreview(null);
      }

      const freshCourses = await getAllCourses();
      setCourses(freshCourses);
    } catch (error) {
      toast.success("Failed to create course", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#476EAE] mb-6">
          Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {["dashboard", "courses", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium rounded-lg whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#476EAE] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Courses" value={courses.length} />
              <StatCard
                title="Total Lecture Duration"
                value={courses.reduce((sum, c) => sum + c.duration, 0)}
              />
              <StatCard title="Total Users" value={users.length} />
            </div>
          )}

          {activeTab === "courses" && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Course List */}
              <div className="lg:w-2/3">
                <h2 className="text-xl font-semibold mb-4">All Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      user={{ role: "admin" }}
                      onDelete={(id) =>
                        setCourses(courses.filter((c) => c._id !== id))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Right: Add Course Form */}
              <div className="lg:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    as="textarea"
                    rows="3"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                    />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor
                  </label>
                  <input
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <input
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#476EAE] file:text-white hover:file:bg-[#3a5a8f]"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={btnLoading}
                    className={`w-full py-2.5 rounded-lg font-medium text-white ${
                      btnLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#476EAE] hover:bg-[#3a5a8f] transition-colors"
                    }`}
                  >
                    {btnLoading ? "Adding Course…" : "Add Course"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {user.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-bold text-[#476EAE] mt-1">{value}</p>
  </div>
);

export default AdminPanel;
