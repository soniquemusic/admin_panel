import React, { useState } from "react";
import { FaBars, FaExpand, FaCompress, FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ toggleSidebar, isLightMode, toggleTheme }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/sonique/user/login");
        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div>
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
                    <button onClick={() => setShowLogoutModal(true)} className="hover:text-gray-300 transition-colors">
                        <FaSignOutAlt size={24} />
                    </button>
                </div>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div
                        className="rounded-lg shadow-lg w-96 p-6 transition-all transform scale-95 hover:scale-100"
                        style={{ backgroundColor: '#182131' }}
                    >
                        <h3 className="text-xl font-semibold text-white mb-6">Confirm Logout</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to log out? Your session will be ended.
                        </p>
                        <div className="flex justify-between gap-4">
                            {/* Cancel Button */}
                            <button
                                onClick={handleCancelLogout}
                                className="px-5 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminNavbar;
