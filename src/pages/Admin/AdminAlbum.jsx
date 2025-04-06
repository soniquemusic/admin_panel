import React, { useState, useRef, useCallback } from "react";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import toast from 'react-hot-toast';

function AdminAlbum({ isLightMode = false }) {
  const [albumName, setAlbumName] = useState("");
  const [albumImage, setAlbumImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleImageUploadClick = () => {
    imageInputRef.current.click();
  };

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image size should not exceed 10MB.");
        return;
      }
      setAlbumImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAlbumImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName) {
      toast.error("Album name is required");
      return;
    }

    if (!albumImage) {
      toast.error("Image file is required.");
      return;
    }

    const formData = new FormData();
    formData.append("albumName", albumName);
    formData.append("albumImage", albumImage);

    setLoading(true);

    try {
      const response = await axios.post("https://sonique-server.onrender.com/sonique/album/create-album", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Adding timeout to prevent the request from hanging too long
        timeout: 10000,  // 10 seconds timeout
      });

      if (response.status === 201) {
        toast.success("Album submitted successfully!"); // Success message with toast
        setAlbumName("");
        setAlbumImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error submitting album:", error);
      // Handle error and display message to user
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center p-4 ${isLightMode ? "bg-gradient-to-br from-gray-100 to-gray-200" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}
    >
      <div
        className={`p-8 rounded-xl shadow-2xl w-full max-w-full border ${isLightMode ? "bg-white/90 backdrop-blur-lg border-gray-200/50" : "bg-gray-800/50 backdrop-blur-lg border-gray-700/30"}`}
      >
        <h2 className={`text-2xl font-bold text-center mb-6 ${isLightMode ? "text-gray-800" : "text-white"}`}>Add The Album</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block font-medium mb-2 ${isLightMode ? "text-gray-700" : "text-gray-200"}`}>Album Name</label>
            <input
              type="text"
              value={albumName}
              onChange={handleAlbumNameChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${isLightMode ? "border-gray-300 bg-gray-50 text-gray-800 focus:border-blue-400 focus:ring-blue-400/50" : "border-gray-600 bg-gray-700/30 text-white focus:border-blue-400 focus:ring-blue-400/50"}`}
            />
          </div>

          <div className="mb-6">
            <label className={`block font-medium mb-2 ${isLightMode ? "text-gray-700" : "text-gray-200"}`}>Album Image</label>
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-xl cursor-pointer transition-all duration-300 ${isLightMode ? "border-gray-300 hover:border-purple-400 hover:bg-gray-100 hover:shadow-lg" : "border-gray-600 hover:border-purple-400 hover:bg-gray-700/30 hover:shadow-lg"}`}
              onClick={handleImageUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-60 object-cover rounded-lg" />
              ) : (
                <>
                  <FaImage size={40} className="text-purple-400 mb-4" />
                  <p className={`text-lg font-medium ${isLightMode ? "text-gray-700" : "text-gray-200"}`}>Upload Album Image</p>
                  <span className={`text-sm mt-1 ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                    Click to browse or drag and drop
                  </span>
                </>
              )}

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
                name="file"
              />

              {albumImage && (
                <p className={`mt-4 text-sm ${isLightMode ? "text-gray-600" : "text-gray-300"}`}>
                  Selected: {albumImage.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full p-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
          >
            {loading ? "Submitting..." : "Add Album"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAlbum;
