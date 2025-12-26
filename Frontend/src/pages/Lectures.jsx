// Lectures.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { server } from "../../main";

const Lectures = ({ user }) => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // Authorization guard
  useEffect(() => {
    if (!user) return;
    const isAuthorized =
      user.role === "admin" ||
      (user.subscription && user.subscription.includes(courseId));
    if (!isAuthorized) navigate("/");
  }, [user, courseId, navigate]);

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
    try {
      const { data } = await axios.get(`${server}/api/lectures/${courseId}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures || []);
      setLoading(false);
      // Auto-select first lecture if none is selected
      if (data.lectures?.length > 0 && !currentLecture) {
        fetchLecture(data.lectures[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
      setLoading(false);
      toast.error("Failed to load lectures");
    }
  };

  // Fetch single lecture
  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setCurrentLecture(data.lecture);
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
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${courseId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setProgressData({
        completed: data.courseProgressPercentage || 0,
        completedLec: data.completedLectures?.length || 0,
        lectLength: data.allLectures || 0,
        progress: data.progress || [],
      });
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  // Mark lecture as complete
  const addProgress = async (lectureId) => {
    try {
      await axios.post(
        `${server}/api/user/progress?course=${courseId}&lectureId=${lectureId}`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );
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
    formData.append("title", title);
    formData.append("description", description);
    if (video) formData.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${courseId}`,
        formData,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      toast.success(data.message);
      fetchLectures();
      // Reset form
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPreview("");
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setBtnLoading(false);
    }
  };

  // Delete lecture
  const deleteHandler = async (id) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchLectures();
      if (currentLecture?._id === id) {
        setCurrentLecture(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (courseId) {
      fetchLectures();
      fetchProgress();
    }
  }, [courseId]);

  // Check if lecture is completed
  const isLectureCompleted = (lectureId) => {
    return progressData.progress.some((p) =>
      p.completedLectures?.includes(lectureId)
    );
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
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
          <p className="text-sm font-medium">
            {progressData.completedLec} of {progressData.lectLength} lectures
            completed
          </p>
          <div className="mt-2 w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{ width: `${progressData.completed}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1">{progressData.completed}% complete</p>
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
                src={`${server}/${currentLecture.video}`}
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
          {user?.role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full py-2 px-4 bg-[#476EAE] text-white rounded-lg font-medium hover:bg-[#3a5a8f] transition-colors"
            >
              {showForm ? "Cancel" : "Add New Lecture"}
            </button>
          )}

          {/* Add Lecture Form */}
          {showForm && user?.role === "admin" && (
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
                  <div key={lecture._id} className="p-3 hover:bg-gray-50">
                    <div
                      onClick={() => fetchLecture(lecture._id)}
                      className={`flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                        currentLecture?._id === lecture._id
                          ? "bg-[#476EAE] text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <span>
                        {index + 1}. {lecture.title}
                      </span>
                      {isLectureCompleted(lecture._id) && (
                        <TiTick className="text-green-500 text-xl" />
                      )}
                    </div>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => deleteHandler(lecture._id)}
                        className="mt-2 w-full py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
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
