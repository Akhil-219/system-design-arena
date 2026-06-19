import React, { useEffect, useState } from "react";
import { getProblemBySlug } from "../services/problemService";
import { useParams, useNavigate } from "react-router-dom";

function ProblemDetailsPage() {
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProblemDetails = async () => {
      setError("");
      try {
        const data = await getProblemBySlug(slug);
        console.log("API Response:", data);
        setProblem(data.problem);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDetails();
  }, [slug]);
  if (loading) {
    return <p>Loading, please wait...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (problem === null) {
    return <p>No problems found</p>;
  }
  return (
    <>
      <div>
        <button onClick={() => navigate("/problems")}>Go back</button>
        <h1>{problem.title}</h1>
        <div>
          <span onClick={() => setActiveTab("description")}>Description</span>

          <span onClick={() => setActiveTab("requirements")}>Requirements</span>

          <span onClick={() => setActiveTab("constraints")}>Constraints</span>
        </div>
        {activeTab === "description" && (
          <div>
            <p>{problem.description}</p>
          </div>
        )}

        {activeTab === "requirements" && (
          <ul>
            {problem.requirements?.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        )}

        {activeTab === "constraints" && (
          <ul>
            {problem.constraints?.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        )}

        <div>
          <h3>Difficulty</h3>
          <p>{problem.difficulty}</p>
        </div>
        <div>
          <h3>Tags</h3>
          <ul>
            {problem.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <button>Start Designing</button>
      </div>
    </>
  );
}

export default ProblemDetailsPage;
