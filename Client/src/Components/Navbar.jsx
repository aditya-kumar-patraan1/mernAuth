import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
  const Navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <NavLink
        to="/"
        className="text-2xl font-semibold text-gray-800 hover:cursor-pointer"
      >
        MyLogo
      </NavLink>

      {/* Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/contact"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Contact
        </NavLink>
        <NavLink
          to="/about"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          About
        </NavLink>
        <NavLink
          to="/help"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Help
        </NavLink>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-700 hover:text-blue-600 transition hover:cursor-pointer"
          onClick={() => Navigate("/LoginPage")}
        >
          Login
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition hover:cursor-pointer"
          onClick={() => Navigate("/RegisterPage")}
        >
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
