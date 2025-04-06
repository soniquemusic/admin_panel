import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaMusic } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminForm({ isLightMode }) {

    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/sonique/user/login');
      }
    }, [navigate]);

    const [formData, setFormData] = useState({
        songName: "",
        description: "",
        album: "None",
        author: "None",
        language: "None",
        songFile: null,
        imageFile: null,
    });

    const [isDraggingSong, setIsDraggingSong] = useState(false);
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);

    const songInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Authors and Albums concurrently
                const authorsResponse = axios.get('http://localhost:3000/sonique/author/get-authors');
                const albumsResponse = axios.get('http://localhost:3000/sonique/album/get-album');

                const [authorsRes, albumsRes] = await Promise.all([authorsResponse, albumsResponse]);

                // console.log('Authors Response:', authorsRes.data.authors[0].auName);
                // console.log('Albums Response:', albumsRes.data);

                setAuthors(authorsRes.data.authors || []);
                setAlbums(albumsRes.data.songs || []);
            } catch (error) {
                console.error('Error fetching authors or albums:', error);
                setAuthors([]);
                setAlbums([]);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            if (name === 'imageFile') {
                const file = files[0];
                if (file.size > MAX_IMAGE_SIZE) {
                    toast.error("Image size should not exceed 10MB.");
                    return; // Prevent further processing
                }
                setFormData({ ...formData, [name]: file });
                setImagePreview(URL.createObjectURL(file));
            } else if (name === 'songFile') {
                setFormData({ ...formData, [name]: files[0] });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSongUploadClick = () => {
        songInputRef.current.click();
    };

    const handleImageUploadClick = () => {
        imageInputRef.current.click();
    };

    const handleDragOver = (e, type) => {
        e.preventDefault();
        if (type === 'song') setIsDraggingSong(true);
        if (type === 'image') setIsDraggingImage(true);
    };

    const handleDragLeave = (e, type) => {
        e.preventDefault();
        if (type === 'song') setIsDraggingSong(false);
        if (type === 'image') setIsDraggingImage(false);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (type === 'song' && file.type.startsWith('audio/')) {
            setFormData({ ...formData, songFile: file });
        } else if (type === 'image' && file.type.startsWith('image/')) {
            if (file.size > MAX_IMAGE_SIZE) {
                toast.error("Image size should not exceed 10MB.");
                return; // Prevent further processing
            }
            setFormData({ ...formData, imageFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
        if (type === 'song') setIsDraggingSong(false);
        if (type === 'image') setIsDraggingImage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.songFile) {
            toast.error("Song file is required.");
            return;
        }
        if (!formData.imageFile) {
            toast.error("Image file is required.");
            return;
        }
        if (!formData.songName) {
            toast.error("Song name is required");
            return;
        }
        if (!formData.description) {
            toast.error("Song description is required");
            return;
        }
        if (formData.author === "None") {
            toast.error("Please select an author.");
            return;
        }
        if (formData.language === "None") {
            toast.error("Please select a language.");
            return;
        }
        if (formData.album === "None") {
            toast.error("Please select an album.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('sName', formData.songName);
        formDataToSend.append('sDescription', formData.description);
        formDataToSend.append('sAuthor', formData.author);
        formDataToSend.append('sAlbum', formData.album);
        formDataToSend.append('sLanguage', formData.language);
        formDataToSend.append('songFile', formData.songFile);
        formDataToSend.append('imageFile', formData.imageFile);

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/sonique/song/create-song', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Song created successfully!');
            setFormData({
                songName: "",
                description: "",
                album: "None",
                author: "",
                language: "",
                songFile: null,
                imageFile: null,
            });
            setImagePreview(null);
            setIsDraggingSong(false);
            setIsDraggingImage(false);
        } catch (error) {
            toast.error('Error submitting form. Please try again.');
            console.error('Error submitting form:', error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex justify-center items-center ${isLightMode ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-900 to-gray-800'} p-4`}>
            <div className={`p-8 ${isLightMode ? 'bg-white' : 'bg-gray-800/50'} backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-full border ${isLightMode ? 'border-gray-200' : 'border-gray-700/30'}`}>
                <h1 className={`text-3xl font-bold ${isLightMode ? 'text-gray-800' : 'text-white'} mb-6 text-center`}>Upload Your Song</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div
                        className={`flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-xl ${isLightMode ? 'bg-gray-100' : 'bg-gray-700/20'} cursor-pointer transition-all duration-300 ${isDraggingSong
                            ? 'border-blue-400 bg-blue-900/20 shadow-lg'
                            : 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/30 hover:shadow-lg'
                            }`}
                        onClick={handleSongUploadClick}
                        onDragOver={(e) => handleDragOver(e, 'song')}
                        onDragLeave={(e) => handleDragLeave(e, 'song')}
                        onDrop={(e) => handleDrop(e, 'song')}
                    >
                        <FaMusic size={40} className="text-blue-400 mb-4" />
                        <p className={`text-lg ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium`}>Choose Song File</p>
                        <span className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Click to browse or drag and drop</span>
                        <input
                            type="file"
                            name="songFile"
                            ref={songInputRef}
                            onChange={handleChange}
                            style={{ display: 'none' }}
                            accept="audio/*"
                        />
                        {formData.songFile && (
                            <p className={`mt-4 text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                                Selected: {formData.songFile.name}
                            </p>
                        )}
                    </div>
                    <div
                        className={`flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-xl ${isLightMode ? 'bg-gray-100' : 'bg-gray-700/20'} cursor-pointer transition-all duration-300 ${isDraggingImage
                            ? 'border-purple-400 bg-purple-900/20 shadow-lg'
                            : 'border-gray-600 hover:border-purple-400 hover:bg-gray-700/30 hover:shadow-lg'
                            }`}
                        onClick={handleImageUploadClick}
                        onDragOver={(e) => handleDragOver(e, 'image')}
                        onDragLeave={(e) => handleDragLeave(e, 'image')}
                        onDrop={(e) => handleDrop(e, 'image')}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        ) : (
                            <>
                                <FaImage size={40} className="text-purple-400 mb-4" />
                                <p className={`text-lg ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium`}>Choose Image File</p>
                                <span className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Click to browse or drag and drop</span>
                            </>
                        )}
                        <input
                            type="file"
                            name="imageFile"
                            ref={imageInputRef}
                            onChange={handleChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                        {formData.imageFile && (
                            <p className={`mt-4 text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                                Selected: {formData.imageFile.name}
                            </p>
                        )}
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium mb-2`}>Song Name</label>
                            <input
                                type="text"
                                name="songName"
                                value={formData.songName}
                                onChange={handleChange}
                                className={`w-full p-3 border ${isLightMode ? 'border-gray-300' : 'border-gray-600'} rounded-lg ${isLightMode ? 'bg-white' : 'bg-gray-700/30'} ${isLightMode ? 'text-gray-800' : 'text-white'} focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                            />
                        </div>
                        <div>
                            <label className={`block ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium mb-2`}>Song Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full p-3 border ${isLightMode ? 'border-gray-300' : 'border-gray-600'} rounded-lg ${isLightMode ? 'bg-white' : 'bg-gray-700/30'} ${isLightMode ? 'text-gray-800' : 'text-white'} focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium mb-2`}>Select Author</label>
                            <select
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={`w-full p-3 border ${isLightMode ? 'border-gray-300' : 'border-gray-600'} rounded-lg ${isLightMode ? 'bg-white' : 'bg-gray-700/30'} ${isLightMode ? 'text-gray-800' : 'text-white'} focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                            >
                                <option>None</option>
                                {authors.map((author) => (
                                    <option key={author._id} value={author.auName}>{author.auName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium mb-2`}>Select Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className={`w-full p-3 border ${isLightMode ? 'border-gray-300' : 'border-gray-600'} rounded-lg ${isLightMode ? 'bg-white' : 'bg-gray-700/30'} ${isLightMode ? 'text-gray-800' : 'text-white'} focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                            >
                                <option>None</option>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={`block ${isLightMode ? 'text-gray-800' : 'text-gray-200'} font-medium mb-2`}>Select Album</label>
                        <select
                            name="album"
                            value={formData.album}
                            onChange={handleChange}
                            className={`w-full p-3 border ${isLightMode ? 'border-gray-300' : 'border-gray-600'} rounded-lg ${isLightMode ? 'bg-white' : 'bg-gray-700/30'} ${isLightMode ? 'text-gray-800' : 'text-white'} focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all`}
                        >
                            <option>None</option>
                            {albums.map((album) => (
                                <option key={album._id} value={album.albumName}>{album.albumName}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full p-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
                    >
                        {loading ? "Submitting..." : "Add Song"}
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    );
}

export default AdminForm;
