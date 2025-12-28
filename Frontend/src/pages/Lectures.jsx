// Lectures.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DoneIcon from "@mui/icons-material/Done";

const Lectures = ({ user }) => {
  const { accessToken, role } = useContext(AuthContext);
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Authorization guard
  // useEffect(() => {
  //   if (!user) return;
  //   const isAuthorized =
  //     user.role === "admin" ||
  //     (user.subscription && user.subscription.includes(courseId));
  //   if (!isAuthorized) navigate("/");
  // }, [user, courseId, navigate]);

  // State
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  // Progress state
  const [progressData, setProgressData] = useState({
    completed: 0,
    completedLec: 0,
    lectLength: 0,
    progress: [],
  });

  // Fetch lectures
  const fetchLectures = async () => {
    if (!accessToken) return null;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/courses/getAllLectures/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        setLectures(res.data.lectures);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
      setLoading(false);
    }
  };

  // Fetch single lecture
  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/courses/getSingleLecture/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setCurrentLecture(res.data.lecture);
      }
    } catch (error) {
      console.error("Failed to fetch lecture:", error);
      toast.error("Failed to load lecture");
    } finally {
      setLecLoading(false);
    }
  };

  // Fetch progress
  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/courses/getCourseProgress/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.success) {
        const { completedLec, lectLength, completedLecturesIds } =
          res.data.progressData;
        setProgressData({
          completedLec: completedLec,
          lectLength: lectLength,
          progress: completedLecturesIds,
        });
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  // Mark lecture as complete
  const addProgress = async (lectureId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/courses/toggleLectureProgress/${courseId}/lecture/${lectureId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const { completedLec, lectLength, completedLecturesIds } =
          res.data.progressData;
        setProgressData({
          completedLec,
          lectLength,
          progress: completedLecturesIds,
        });
        toast.success("Progress updated");
      }
      fetchProgress();
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  // Handle video upload preview
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Submit new lecture
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", title);
    formData.append("description", description);
    if (video) formData.append("video", video);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/admin/addLecture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
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

        setTitle("");
        setDescription("");
        setVideo(null);
        setVideoPreview("");
        setShowForm(false);
      }

      fetchLectures();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add lecture", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setBtnLoading(false);
    }
  };

  // Delete lecture
  const deleteHandler = async (id) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/admin/deleteLecture/${id}`,
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
        fetchLectures();
        if (currentLecture?._id === id) {
          setCurrentLecture(null);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete lecture", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (courseId && accessToken) {
      fetchLectures();
      fetchProgress();
    }
  }, [courseId, accessToken]);

  // Check if lecture is completed
  const isLectureCompleted = (lectureId) => {
    return progressData.progress.includes(lectureId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse w-16 h-16 rounded-full bg-gray-300 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
          <p className="text-sm font-medium">
            {progressData.completedLec} of {progressData.lectLength} lectures
            completed
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left: Video Player */}
        <div className="lg:w-2/3">
          {lecLoading ? (
            <div className="bg-white rounded-xl shadow h-80 flex items-center justify-center">
              <p>Loading lecture...</p>
            </div>
          ) : currentLecture?.video ? (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <video
                src={currentLecture.video.url}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                autoPlay
                onEnded={() => addProgress(currentLecture._id)}
                className="w-full aspect-video"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentLecture.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  {currentLecture.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow h-80 flex items-center justify-center">
              <p className="text-gray-500">Please select a lecture to begin</p>
            </div>
          )}
        </div>

        {/* Right: Lecture List & Form */}
        <div className="lg:w-1/3 space-y-4">
          {/* Add Lecture Button (Admin only) */}
          {role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full py-2 px-4 bg-[#476EAE] text-white rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors"
            >
              {showForm ? "Cancel" : "Add New Lecture"}
            </button>
          )}

          {/* Add Lecture Form */}
          {showForm && role === "admin" && (
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Add Lecture
              </h3>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#476EAE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={changeVideoHandler}
                    required={!videoPreview}
                    className="w-full text-sm text-gray-500"
                  />
                  {videoPreview && (
                    <div className="mt-2">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={btnLoading}
                  className={`w-full py-2 rounded-lg font-medium text-white ${
                    btnLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#476EAE] hover:bg-[#3a5a8f]"
                  }`}
                >
                  {btnLoading ? "Adding..." : "Add Lecture"}
                </button>
              </form>
            </div>
          )}

          {/* Lecture List */}
          <div className="bg-white rounded-xl shadow">
            <h3 className="px-4 py-3 font-semibold text-gray-800 border-b">
              Course Lectures
            </h3>
            <div className="divide-y">
              {lectures.length > 0 ? (
                lectures.map((lecture, index) => (
                  <div key={lecture._id} className="p-3 hover:bg-gray-50 flex">
                    <div
                      className={`flex mr-2 items-center justify-between cursor-pointer p-2 rounded-lg w-11/12 ${
                        currentLecture?._id === lecture._id
                          ? "bg-[#476EAE] text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span onClick={() => fetchLecture(lecture._id)}>
                          {index + 1}. {lecture.title}
                        </span>
                        {isLectureCompleted(lecture._id) && (
                          <DoneIcon className="text-green-500 text-xl flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {role === "admin" && (
                        <DeleteForeverOutlinedIcon
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents triggering fetchLecture
                            deleteHandler(lecture._id);
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                          fontSize="small"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-center">No lectures yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
