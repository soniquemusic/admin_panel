import React, { useState } from "react";
import { FaBars, FaExpand, FaCompress, FaSun, FaMoon } from "react-icons/fa";

function AdminNavbar({ toggleSidebar, isLightMode, toggleTheme }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error("Error attempting to enable full-screen mode:", err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch((err) => {
                console.error("Error attempting to exit full-screen mode:", err);
            });
        }
    };

    const navbarStyles = {
        backgroundColor: isLightMode ? 'rgb(255, 255, 255)' : 'rgba(31, 41, 55, 0.5)',
        color: isLightMode ? 'black' : 'white',
    };

    return (
        <div className="sticky top-0 z-50 backdrop-blur-md p-4 shadow-lg flex justify-between items-center" style={navbarStyles}>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <div className="flex items-center gap-4">
                <button onClick={toggleFullscreen} className="hover:text-gray-300 transition-colors">
                    {isFullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
                </button>
                <button onClick={toggleTheme} className="hover:text-gray-300 transition-colors">
                    {isLightMode ? <FaMoon size={24} /> : <FaSun size={24} />}
                </button>
                <button onClick={toggleSidebar} className="md:hidden hover:text-gray-300 transition-colors">
                    <FaBars size={24} />
                </button>
            </div>
        </div>
    );
}

export default AdminNavbar;