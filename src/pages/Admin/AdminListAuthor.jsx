"use client";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const AdminListAuthor = ({ isLightMode = false }) => {
  const [authors, setAuthors] = useState([]); // State to hold authors
  const [loading, setLoading] = useState(true); // Loading state
  const [cachedAuthors, setCachedAuthors] = useState(null); // Cache for authors

  // Function to fetch authors with caching
  const fetchAuthors = async () => {
    if (cachedAuthors) {
      setAuthors(cachedAuthors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/sonique/author/get-authors');
      const data = await response.json();

      if (response.ok) {
        setAuthors(data.authors);
        setCachedAuthors(data.authors); // Cache the authors for subsequent calls
      } else {
        console.error("Error fetching authors:", data.error);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (authorId, authorName) => {
    if (window.confirm(`Are you sure you want to delete ${authorName}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/sonique/author/delete-author/${authorId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setAuthors(authors.filter((author) => author._id !== authorId)); // Remove the deleted author from state
          alert(`${authorName} deleted successfully!`);
        } else {
          const data = await response.json();
          console.error("Error deleting author:", data.error);
          alert("Failed to delete author.");
        }
      } catch (error) {
        console.error("Error deleting author:", error);
        alert("An error occurred while deleting the author.");
      }
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [cachedAuthors]);

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
          Author List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div
              key={author._id} // Use the unique ID here
              className={`p-5 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400 flex flex-col justify-between ${isLightMode ? "bg-gray-50/80 border-gray-200/50" : "bg-gray-700/60 border-gray-500/30"}`}
            >
              <img
                src={author.file_url || "/placeholder.svg"}
                alt={author.name}
                className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
              />
              <div className="flex-grow">
                <h3 className={`text-xl font-semibold ${isLightMode ? "text-gray-800" : "text-white"}`}>
                  {author.auName}
                </h3>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => alert(`Edit ${author.name}`)} // Edit functionality remains the same
                  className="relative flex items-center gap-2 px-6 py-2 text-white text-sm font-medium rounded-full shadow-md bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-600 active:scale-95 active:bg-opacity-80"
                >
                  <FaEdit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(author._id, author.auName)} // Use the author's unique ID for deletion
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

export default AdminListAuthor;
