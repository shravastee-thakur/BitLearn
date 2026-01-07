import { createContext } from "react";
import axios from "axios";

export const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const getAllCourses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/getAllCourses`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        return res.data.courses;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <CourseContext.Provider value={{ getAllCourses }}>
        {children}
      </CourseContext.Provider>
    </div>
  );
};

export default CourseProvider;
