import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VerifyLogin from "./pages/VerifyLogin";
import Courses from "./pages/Courses";
import AdminPanel from "./pages/AdminPanel";
import Lectures from "./pages/Lectures";
import MyAccount from "./pages/MyAccount";
import MyCourses from "./pages/MyCourses";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";
import { AuthContext } from "./context/AuthProvider";
import { useContext } from "react";
import NotFoundPage from "./pages/NotFoundPage";

const ProtectedAdminRoute = ({ children }) => {
  const { role } = useContext(AuthContext);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyLogin />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/lectures/:courseId" element={<Lectures />} />

          <Route path="/my-profile" element={<MyAccount />} />
          <Route path="/my-courses" element={<MyCourses />} />

          <Route
            path="/admin-panel"
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/payment-success/:courseId"
            element={<PaymentSuccess />}
          />
          <Route path="/payment-failure" element={<PaymentFailure />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
