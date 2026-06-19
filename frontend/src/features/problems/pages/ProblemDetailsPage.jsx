import React, { useEffect, useState } from "react";
import { getProblemBySlug } from "../services/problemService";
import { useParams, useNavigate } from "react-router-dom";

function ProblemDetailsPage() {
  const [problem, setProblem] = useState(null);
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button className="mb-6" onClick={() => navigate("/problems")}>
          Go back
        </button>
        <h1 className="text-3xl font-semibold mb-8">{problem.title}</h1>
        <div className="flex gap-8 mb-6 border-b pb-3">
          <button
            className="font-medium"
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

          <button
            className="font-medium"
            onClick={() => setActiveTab("requirements")}
          >
            Requirements
          </button>

          <button
            className="font-medium"
            onClick={() => setActiveTab("constraints")}
          >
            Constraints
          </button>
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
            {problem.tags?.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <button
          className="px-6 py-2"
          onClick={() => navigate(`/design/${problem._id}`)}
        >
          Start Designing
        </button>
      </div>
    </>
  );
}

export default ProblemDetailsPage;
