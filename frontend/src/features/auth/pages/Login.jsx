import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

function Login() {
  const { login , googleLogin} = useAuth();
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

  const handleGoogleLogin = async (idToken) => {
    setError("");
    try {
      await googleLogin(idToken);
      const redirectTo =
        location.state?.from ||
        sessionStorage.getItem("redirectAfterLogin") ||
        "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Google sign-in failed");
    }
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

        <GoogleSignInButton onCredential={handleGoogleLogin}/>

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