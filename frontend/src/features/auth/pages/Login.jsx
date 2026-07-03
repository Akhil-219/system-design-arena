import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(formData);
      const redirectTo =
        location.state?.from ||
        sessionStorage.getItem("redirectAfterLogin") ||
        "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: point this at the backend OAuth route once it exists,
    // e.g. window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Log in</h1>
        <p className="text-sm text-gray-400 mb-8">
          Welcome back to System Design Arena.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="login"
            placeholder="Email or username"
            value={formData.login}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
          />

          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-800 flex-1" />
          <span className="font-mono text-[11px] text-gray-600 uppercase tracking-wide">
            or
          </span>
          <div className="h-px bg-gray-800 flex-1" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled
          title="Coming soon"
          className="w-full flex items-center justify-center gap-2.5 px-6 py-2.5 border border-gray-800 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
          <span className="font-mono text-[10px] text-gray-700 ml-1">soon</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <a href="/register" className="text-white hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;