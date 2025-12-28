import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const MyAccount = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { name, accessToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/v1/users/deleteUser",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
        navigate("/");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeleteEnabled = confirmationText === "DELETE";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {/* User Name */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Hello, {name}</h1>
        </div>

        {/* My Courses Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/my-courses")}
            className="w-full py-3 px-4 bg-[#476EAE] text-white font-medium rounded-lg shadow-sm hover:bg-[#3a5a8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#476EAE] focus:ring-offset-2"
          >
            My Courses
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="text-center pt-4 border-t border-gray-200">
          <button
            onClick={handleDeleteClick}
            className="text-red-600 font-medium hover:text-red-800 transition-colors"
          >
            Delete My Account
          </button>

          {showDeleteConfirmation && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 animate-fade-in">
              <p className="text-sm text-red-700 mb-3">
                ⚠️ This action cannot be undone. To confirm, please type
                <span className="font-mono font-bold bg-red-100 px-1.5 py-0.5 rounded">
                  DELETE
                </span>
                below.
              </p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type 'DELETE'"
                className="w-full p-2 mb-3 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
                disabled={isDeleting}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={!isDeleteEnabled || isDeleting}
                  className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                    isDeleteEnabled && !isDeleting
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-300 text-white cursor-not-allowed"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Confirm Deletion"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
