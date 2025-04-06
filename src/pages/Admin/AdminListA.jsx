"use client";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const AdminListA = ({ isLightMode = false }) => {
  const [albums, setAlbums] = useState([]); // State to hold album data
  const [loading, setLoading] = useState(true); // Loading state
  const [cachedAlbums, setCachedAlbums] = useState(null); // Cache for album data

  // Function to fetch album data with caching mechanism
  const fetchAlbums = async () => {
    // Check if the albums are already cached
    if (cachedAlbums) {
      setAlbums(cachedAlbums);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/sonique/album/get-album');
      const data = await response.json();

      if (response.ok) {
        setAlbums(data.songs); // Assuming the API returns the albums in the `songs` field
        setCachedAlbums(data.songs); // Cache the albums for subsequent requests
      } else {
        console.error("Error fetching albums:", data.error);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch albums when the component mounts
  useEffect(() => {
    fetchAlbums();
  }, [cachedAlbums]); // Re-fetch albums only if the cache is empty

  const handleEdit = (albumName) => {
    alert(`Edit ${albumName}`);
  };

  const handleDelete = async (albumId, albumName) => {
    if (window.confirm(`Are you sure you want to delete ${albumName}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/sonique/album/delete-album/${albumId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          // Remove the deleted album from the state
          setAlbums(albums.filter(album => album._id !== albumId));
          alert(`${albumName} deleted successfully.`);
        } else {
          console.error('Error deleting album:', data.error);
        }
      } catch (error) {
        console.error('Error deleting album:', error);
      }
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Simple loading spinner */}
        <div className="w-16 h-16 border-4 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center p-5 ${isLightMode ? "bg-gradient-to-br from-gray-100 to-gray-200" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}
    >
      <div
        className={`p-8 rounded-xl shadow-2xl w-full max-w-full border ${isLightMode ? "bg-white/90 backdrop-blur-lg border-gray-200/50" : "bg-gray-800/70 backdrop-blur-lg border-gray-700/40"}`}
      >
        <h2 className={`text-3xl font-bold mb-6 text-center tracking-wide ${isLightMode ? "text-gray-800" : "text-white"}`}>
          Album List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {albums.map((album, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400 flex flex-col justify-between ${isLightMode ? "bg-gray-50/80 border-gray-200/50" : "bg-gray-700/60 border-gray-500/30"}`}
            >
              <img
                src={album.file_url || "/placeholder.svg"}
                alt={album.albumName}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
              />
              <div className="flex-grow">
                <h3 className={`text-xl font-semibold ${isLightMode ? "text-gray-800" : "text-white"}`}>
                  {album.albumName}
                </h3>
                <p className={`text-sm mb-3 leading-relaxed ${isLightMode ? "text-gray-600" : "text-gray-300"}`}>
                  {album.description}
                </p>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => handleEdit(album.albumName)}
                  className="relative flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-full shadow-md bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-600 active:scale-95 active:bg-opacity-80"
                >
                  <FaEdit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(album._id, album.albumName)} // Pass album ID here
                  className="relative flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-full shadow-md bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-red-600 hover:to-pink-600 active:scale-95 active:bg-opacity-80"
                >
                  <FaTrashAlt size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminListA;
