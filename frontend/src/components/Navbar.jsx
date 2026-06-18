import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  console.log(user);
  return (
    <>
      <nav>
        <h1>System Design Arena</h1>
        <ul>
          <li>
            <NavLink to="/problems">Problems</NavLink>
          </li>
          <li>
            <NavLink to="/community">Community</NavLink>
          </li>
          <li>
            <NavLink to="/mentor">Mentor</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">DashBoard</NavLink>
          </li>
          <li>
            <NavLink to="/LogIn">LogIn</NavLink>
          </li>
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
