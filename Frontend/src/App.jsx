import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VerifyLogin from "./pages/VerifyLogin";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
