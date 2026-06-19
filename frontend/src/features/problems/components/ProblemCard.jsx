import React from "react";
import { Link } from "react-router-dom";
function ProblemCard({ problem }) {
  return (
    <>
      <Link to={`/problems/${problem.slug}`} >
      <div>
        <h3>{problem.title}</h3>
        <p>
          {problem.description.length > 80
            ? problem.description.slice(0, 80) + "..."
            : problem.description}
        </p>
        <div>
          {problem.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      </Link>
    </>
  );
}

export default ProblemCard;
