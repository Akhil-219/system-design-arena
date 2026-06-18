import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Problems from "../pages/Problems";
import MainLayout from "../layouts/MainLayout";
import Community from "../pages/Community";
import Mentor from "../pages/Mentor";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/community" element={<Community/>}/>
        <Route path="/mentor" element={<Mentor/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;