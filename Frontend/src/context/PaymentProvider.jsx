import { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const { accessToken, fetchCurrentUser } = useContext(AuthContext);

  const stripePayment = async (courseId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/stripePayment`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const checkoutUrl = res.data.url;
        window.location.href = checkoutUrl;

        await fetchCurrentUser();
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to pay", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return false;
    }
  };

  const verifyPayment = async (sessionId, courseId, token) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/verifyPayment`,
        { sessionId, courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to pay", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return false;
    }
  };

  return (
    <>
      <PaymentContext.Provider value={{ stripePayment, verifyPayment }}>
        {children}
      </PaymentContext.Provider>
    </>
  );
};

export default PaymentProvider;
