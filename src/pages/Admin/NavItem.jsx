import React from 'react';
import { NavLink } from 'react-router-dom';

function NavItem({ icon, text, to, isLightMode }) {
    const navItemStyles = {
        backgroundColor: isLightMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(55, 65, 81, 0.9)',
        color: isLightMode ? 'black' : 'white',
    };

    return (
        <NavLink
            to={to || '/'}
            className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition duration-200 ease-in-out 
                ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
            }
            style={({ isActive }) => isActive ? navItemStyles : {}}
        >
            {icon}
            <span>{text}</span>
        </NavLink>
    );
}

export default NavItem;