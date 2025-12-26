import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import CourseProvider from "./context/CourseProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CourseProvider>
      <App />
    </CourseProvider>
  </AuthProvider>
);
