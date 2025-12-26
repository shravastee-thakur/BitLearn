// // AdminPanel.jsx (updated)
// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { CourseContext } from "../context/CourseProvider";
// import CourseCard from "../components/CourseCard";
// import { AuthContext } from "../context/AuthProvider";

// const categories = [
//   "Web Development",
//   "App Development",
//   "Game Development",
//   "DevOps & Tools",
//   "Artificial Intelligence",
// ];

// const AdminPanel = ({ user }) => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     totalLectures: 0,
//     totalUsers: 0,
//   });
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState({ stats: true, users: true });

//   const { courseData, getAllCourses } = useContext(CourseContext);

//   const { accessToken } = useContext(AuthContext);

//   // Form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [createdBy, setCreatedBy] = useState("");
//   const [duration, setDuration] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [btnLoading, setBtnLoading] = useState(false);

//   // Fetch stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await axios.get("/api/stats", {
//           headers: { token: localStorage.getItem("token") },
//         });
//         setStats(data.stats || {});
//       } catch (err) {
//         toast.error("Failed to load stats");
//       } finally {
//         setLoading((prev) => ({ ...prev, stats: false }));
//       }
//     };
//     fetchStats();
//   }, []);

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const { data } = await axios.get("/api/users", {
//           headers: { token: localStorage.getItem("token") },
//         });
//         setUsers(data.users || []);
//       } catch (err) {
//         toast.error("Failed to load users");
//       } finally {
//         setLoading((prev) => ({ ...prev, users: false }));
//       }
//     };
//     if (activeTab === "users") fetchUsers();
//   }, [activeTab]);

//   const changeImageHandler = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setBtnLoading(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("price", price);
//     formData.append("createdBy", createdBy);
//     formData.append("duration", duration);
//     if (image) formData.append("image", image);

//     try {
//       await axios.post(
//         "http://localhost:3000/api/v1/admin/createCourse",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
//       toast.success("Course added successfully!");

//       // Reset form
//       setTitle("");
//       setDescription("");
//       setCategory("");
//       setPrice("");
//       setCreatedBy("");
//       setDuration("");
//       setImage(null);
//       setImagePreview("");

//       // 🔁 Refetch courses if function exists
//       if (getAllCourses) await getAllCourses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create course");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: "Total Courses",
//       value: stats.totalCourses,
//       color: "bg-blue-100 text-blue-800",
//     },
//     {
//       title: "Total Lectures",
//       value: stats.totalLectures,
//       color: "bg-green-100 text-green-800",
//     },
//     {
//       title: "Total Users",
//       value: stats.totalUsers,
//       color: "bg-purple-100 text-purple-800",
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-200 mb-8">
//         {["dashboard", "create-course", "users"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
//               activeTab === tab
//                 ? "text-[#476EAE] border-b-2 border-[#476EAE]"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             {tab === "create-course" ? "Create Course" : tab}
//           </button>
//         ))}
//       </div>

//       <div>
//         {activeTab === "dashboard" && (
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Dashboard Overview
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {loading.stats
//                 ? Array.from({ length: 3 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="bg-white rounded-xl p-5 shadow animate-pulse"
//                     >
//                       <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
//                       <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//                     </div>
//                   ))
//                 : statCards.map((card, i) => (
//                     <div key={i} className="bg-white rounded-xl p-5 shadow">
//                       <p className="text-gray-600 text-sm">{card.title}</p>
//                       <p className="text-2xl font-bold mt-1">
//                         {card.value || 0}
//                       </p>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         )}

//         {/* ✅ Create Course Tab — Now with course list below */}
//         {activeTab === "create-course" && (
//           <div className="space-y-8">
//             {/* Form */}
//             <div className="max-w-2xl mx-auto">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 Add New Course
//               </h2>
//               <div className="bg-white rounded-xl shadow-md p-6">
//                 <form onSubmit={submitHandler} className="space-y-5">
//                   {/* ... your existing form fields ... */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Title
//                     </label>
//                     <input
//                       type="text"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Description
//                     </label>
//                     <input
//                       type="text"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Price (₹)
//                     </label>
//                     <input
//                       type="number"
//                       min="0"
//                       value={price}
//                       onChange={(e) => setPrice(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Instructor
//                     </label>
//                     <input
//                       type="text"
//                       value={createdBy}
//                       onChange={(e) => setCreatedBy(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Category
//                     </label>
//                     <select
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Duration (hours)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={duration}
//                       onChange={(e) => setDuration(e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Thumbnail
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={changeImageHandler}
//                       required={!imagePreview}
//                       className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#476EAE] hover:file:bg-blue-100"
//                     />
//                     {imagePreview && (
//                       <div className="mt-3">
//                         <img
//                           src={imagePreview}
//                           alt="Preview"
//                           className="w-full h-32 object-cover rounded-lg border"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={btnLoading}
//                     className={`w-full py-2.5 rounded-lg font-medium text-white ${
//                       btnLoading
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-[#476EAE] hover:bg-[#3a5a8f] transition-colors"
//                     }`}
//                   >
//                     {btnLoading ? "Adding Course…" : "Add Course"}
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* ✅ Course List */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">
//                 All Courses
//               </h2>
//               {courseData && courseData.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                   {courseData.map((course) => (
//                     <CourseCard key={course._id || course.id} course={course} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
//                   No courses available. Add your first course!
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "users" && (
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
//             <div className="bg-white rounded-xl shadow overflow-hidden">
//               {loading.users ? (
//                 <div className="p-6 text-center text-gray-500">
//                   Loading users...
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="divide-y divide-gray-100">
//                   {users.map((user) => (
//                     <div
//                       key={user._id}
//                       className="p-4 flex items-center justify-between"
//                     >
//                       <div>
//                         <p className="font-medium text-gray-800">{user.name}</p>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                       <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
//                         {user.role}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-gray-500">
//                   No users found.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

// AdminPanel.jsx
import { useState, useEffect, useContext } from "react";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CourseContext } from "../context/CourseProvider";

const AdminPanel = () => {
  const { getAllCourses } = useContext(CourseContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [users] = useState([
    { id: "u1", name: "Admin", email: "admin@example.com", role: "admin" },
    { id: "u2", name: "User One", email: "user1@example.com", role: "user" },
  ]);

  // Form state
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
  const [categories, setCategories] = useState([
    "Web Development",
    "Data Science",
    "Design",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const navigate = useNavigate();

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
  };

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory("");
    }
  };

  // Handle course submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("createdBy", createdBy);
    formData.append("duration", duration);
    if (image) formData.append("image", image);

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
        toast.success("Course added successfully!");

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

      if (getAllCourses) await getAllCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
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
              {/* <StatCard
                title="Total Lectures"
                value={courses.reduce((sum, c) => sum + c.duration * 5, 0)}
              /> */}
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
                      deleteHandler={(id) =>
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
                  <InputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    as="textarea"
                    rows="3"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                        required
                      >
                        <option value="">Select or add category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category"
                        className="border border-gray-300 rounded-md px-2 py-2 text-sm w-32"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <InputField
                    label="Price (₹)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Instructor"
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Duration (weeks)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    required
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
                    className="w-full py-2 bg-[#476EAE] text-white rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors"
                  >
                    Create Course
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
                      <tr key={user.id}>
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

// Reusable Input Field
const InputField = ({
  label,
  name,
  value,
  onChange,
  as = "input",
  ...props
}) => {
  const InputComponent = as;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <InputComponent
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
        {...props}
      />
    </div>
  );
};

export default AdminPanel;
