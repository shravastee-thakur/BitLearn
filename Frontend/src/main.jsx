import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import CourseProvider from "./context/CourseProvider.jsx";
import PaymentProvider from "./context/PaymentProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CourseProvider>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </CourseProvider>
  </AuthProvider>
);
