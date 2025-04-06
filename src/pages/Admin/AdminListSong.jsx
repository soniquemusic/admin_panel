"use client";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";

// AdminListSong component
const AdminListSong = ({ isLightMode = false }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cachedSongs, setCachedSongs] = useState(null); // Cache for songs

  // Fetch songs from the server API with caching
  const fetchSongs = async () => {
    if (cachedSongs) {
      setSongs(cachedSongs);  // No need to fetch if cached data exists
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/sonique/song/get-song');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setSongs(data.songs);
      setCachedSongs(data.songs); // Cache the songs
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch songs only once when the component mounts
  useEffect(() => {
    if (!cachedSongs) {
      fetchSongs(); // Only fetch if there are no cached songs
    } else {
      setLoading(false); // No need to fetch if cached data is present
    }
  }, [cachedSongs]); // The effect depends on the cachedSongs state

  const handleEdit = (songTitle) => {
    alert(`Edit ${songTitle}`);
  };

  const handleDelete = async (songId, songTitle) => {
    if (window.confirm(`Are you sure you want to delete "${songTitle}"?`)) {
      try {
        const response = await fetch(`http://localhost:3000/sonique/song/delete-song/${songId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSongs(songs.filter((song) => song._id !== songId)); // Remove the deleted song from state
          alert(`${songTitle} deleted successfully!`);
        } else {
          const data = await response.json();
          console.error("Error deleting song:", data.error);
          alert("Failed to delete song.");
        }
      } catch (error) {
        console.error("Error deleting song:", error);
        alert("An error occurred while deleting the song.");
      }
    }
  };

  // Loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
          Song List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {songs.map((song, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400 flex flex-col justify-between ${isLightMode ? "bg-gray-50/80 border-gray-200/50" : "bg-gray-700/60 border-gray-500/30"}`}
            >
              <img
                src={song.file_url || "/placeholder.svg"}
                alt={song.title}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
              />
              <div className="flex-grow">
                <h3 className={`text-xl font-semibold ${isLightMode ? "text-gray-800" : "text-white"}`}>
                  {song.sName}
                </h3>
                <p className={`text-sm mb-3 leading-relaxed ${isLightMode ? "text-gray-600" : "text-gray-300"}`}>
                  {song.sDescription}
                </p>
                <p className={`text-xs md:text-sm italic ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                  Album: {song.sAlbum}
                </p>
                <p className={`text-xs md:text-sm italic ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                  Author: {song.sAuthor}
                </p>
                <p className={`text-xs md:text-sm italic ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                  Language: {song.sLanguage}
                </p>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => handleEdit(song.title)}
                  className="relative flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-full shadow-md 
                                    bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 
                                    hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-600 
                                    active:scale-95 active:bg-opacity-80"
                >
                  <FaEdit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(song._id, song.sName)}
                  className="relative flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-full shadow-md 
                                    bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300 
                                    hover:scale-105 hover:shadow-xl hover:from-red-600 hover:to-pink-600 
                                    active:scale-95 active:bg-opacity-80"
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

export default AdminListSong;
