import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/problems", label: "Problems" },
  { to: "/community", label: "Community" },
  { to: "/mentor", label: "Mentor" },
  { to: "/dashboard", label: "Dashboard" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive ? "text-white" : "text-gray-400 hover:text-white"
    }`;

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate("/");
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-[#0a0a0a] text-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg tracking-tight">
          System Design Arena
        </NavLink>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                {user.name || user.username || "Account"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 border border-gray-700 rounded-md text-sm hover:border-gray-500 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-1.5 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;