import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Please wait loading</p>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoutes;
