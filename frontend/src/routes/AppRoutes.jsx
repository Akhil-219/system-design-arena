import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProblemsPage from "../features/problems/pages/ProblemsPage";
import MainLayout from "../layouts/MainLayout";
import CommunityPage from "../features/community/pages/CommunityPage";
import MentorPage from "../features/mentor/pages/MentorPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoutes from "./ProtectedRoutes";
import ProblemDetailsPage from "../features/problems/pages/ProblemDetailsPage";
import DesignCanvasPage from "../features/design/pages/DesignCanvasPage";
import ProblemCommunityPage from "../features/community/pages/ProblemCommunityPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SettingsPage from "../features/profile/pages/SettingsPage";
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <DashboardPage />
            </ProtectedRoutes>
          }
        />
        <Route
        path="/profile"
        element={
          <ProtectedRoutes>
            <ProfilePage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoutes>
            <SettingsPage />
          </ProtectedRoutes>
        }
      />
      </Route>
      <Route path="/problems/:slug" element={<ProblemDetailsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/design/:problemId"
        element={
          <ProtectedRoutes>
            <DesignCanvasPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/problems/:problemId/community"
        element={<ProblemCommunityPage />}
      />
    </Routes>
  );
}

export default AppRoutes;
