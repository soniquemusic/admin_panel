import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminForm from './AdminForm';
import AdminListSong from './AdminListSong';
import AdminAlbum from './AdminAlbum';
import AdminListA from './AdminListA';
import AdminAuthor from './AdminAuthor';
import AdminListAuthor from './AdminListAuthor';
import PrivateRoute from './PrivateRoute';
import ErrorPage from './ErrorPage';

function AdminHome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleTheme = () => {
        setIsLightMode(!isLightMode);
    };

    return (
        <>
            <div className={`min-h-screen ${isLightMode ? 'bg-gray-100' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-gradient-x'}`}>
                <div className="flex flex-col md:flex-row h-[100vh]">
                    <AdminSidebar isOpen={isSidebarOpen} isLightMode={isLightMode} />
                    <div className="flex-1 overflow-y-auto">
                        <AdminNavbar toggleSidebar={toggleSidebar} isLightMode={isLightMode} toggleTheme={toggleTheme} />

                        <Routes>
                            <Route path="/" element={<PrivateRoute element={<AdminForm isLightMode={isLightMode} />} />} />
                            <Route path="/list/song" element={<PrivateRoute element={<AdminListSong isLightMode={isLightMode} />} />} />
                            <Route path="/add/album" element={<PrivateRoute element={<AdminAlbum isLightMode={isLightMode} />} />} />
                            <Route path="/list/album" element={<PrivateRoute element={<AdminListA isLightMode={isLightMode} />} />} />
                            <Route path="/add/author" element={<PrivateRoute element={<AdminAuthor isLightMode={isLightMode} />} />} />
                            <Route path="/list/author" element={<PrivateRoute element={<AdminListAuthor isLightMode={isLightMode} />} />} />

                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminHome;