import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const {register} = useAuth()
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email:"",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("")
    setSubmitting(true);
    try {
      await register(formData)
      navigate("/dashboard")
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="username" value={formData.username} onChange={handleChange} />
        <input name="email" value={formData.email} onChange={handleChange}/>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Registering in..." : "Register"}
        </button>
      </form>
    </>
  )
}

export default Register