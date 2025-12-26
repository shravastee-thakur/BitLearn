import { useState, createContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refreshTokenHandler = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/v1/users/refreshHandler",
          {},
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          setName(res.data.user.name);
          setVerified(res.data.user.verified);
          setUserId(res.data.user.id);
          setRole(res.data.user.role);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
        } else {
          console.error("Error during refresh token check:", error);
        }
      }
    };

    refreshTokenHandler();
  }, []);

  const login = async (formData) => {
    const { email, password } = formData;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/loginStepOne",
        { email, password },
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

        setUserId(res.data.userId);
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const verifyLoginOtp = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/verifyOtp",
        { userId, otp },
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

        setUser(res.data.user);
        setVerified(res.data.user.verified);
        setName(res.data.user.name);
        setAccessToken(res.data.accessToken);
        setRole(res.data.user.verified);
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to login", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setVerified(false);
        setName(null);
        setAccessToken(null);
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
      toast.error("Failed to logout", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          login,
          verifyLoginOtp,
          verified,
          name,
          logout,
          accessToken,
          role,
          user,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
