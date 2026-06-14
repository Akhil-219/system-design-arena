import { Problem } from "../models/problems.model.js";
import { ApiError } from "../utils/ApiError.js";
const getProblems = async (params) => {
  //we will get the parameters , we have to desturcturise them
  // tag-> add the tag filter, difficulty->filter, search->filer
  // after adding those, per page 10 problems we have to display
  const { search } = params;
  const tags = params.tags?.toLowerCase();
  const difficulty = params.difficulty?.toLowerCase();
  const query = {};
  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }
  if (tags) {
    query.tags = tags;
  }
  if (difficulty) {
    query.difficulty = difficulty;
  }
  const page = Number(params.page) || 1;
  const limit = Math.min(Number(params.limit) || 10, 50);
  const [problems, total] = await Promise.all([
    Problem.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ title: 1 }),
    Problem.countDocuments(query),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    problems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const getProblemsBySlug = async (params) => {
  // same we will get the param then we have to find the problem based on that param
  const { slug } = params;
  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }
  const requestedSlug = slug.toLowerCase();

  const problem = await Problem.findOne({ slug: requestedSlug });
  if (!problems) {
    throw new ApiError(404, "Problem not found");
  }
  return {
    problem,
  };
};

export { getProblems, getProblemsBySlug };
