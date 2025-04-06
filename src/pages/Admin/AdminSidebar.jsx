import React from 'react';
import { FaImage, FaList, FaMusic } from 'react-icons/fa';
import NavItem from './NavItem';
import logo from '/ligh_logo.png';

function AdminSidebar({ isOpen, isLightMode }) {
    const sidebarStyles = {
        backgroundColor: isLightMode ? 'rgb(255, 255, 255)' : 'rgba(31, 41, 55, 0.9)',
        color: isLightMode ? 'black' : 'white',
    };

    const navItemStyles = {
        color: isLightMode ? 'black' : 'white',
    };

    return (
        <div
            className={`w-64 bg-gradient-to-b p-4 z-10 pt-18 md:pt-4 space-y-4 fixed h-full md:relative transform 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out shadow-xl`}
            style={sidebarStyles}
        >
            <img src={logo} alt="Logo" className="w-40" />
            <nav className="space-y-2">
            <NavItem icon={<FaMusic />} text="Add Song" to="/" isLightMode={isLightMode} style={navItemStyles} />
                <NavItem icon={<FaList />} text="List Song" to="/list/song" isLightMode={isLightMode} style={navItemStyles} />
                <NavItem icon={<FaImage />} text="Add Album" to="/add/album" isLightMode={isLightMode} style={navItemStyles} />
                <NavItem icon={<FaList />} text="List Album" to="/list/album" isLightMode={isLightMode} style={navItemStyles} />
                <NavItem icon={<FaImage />} text="Add Author" to="/add/author" isLightMode={isLightMode} style={navItemStyles} />
                <NavItem icon={<FaImage />} text="List Author" to="/list/author" isLightMode={isLightMode} style={navItemStyles} />
            </nav>
        </div>
    );
}

export default AdminSidebar;
