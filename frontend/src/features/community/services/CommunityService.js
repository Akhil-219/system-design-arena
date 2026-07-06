import axiosInstance from "../../../api/axios.js";

// Publish a specific version to the community.
export const publishDesign = async (designId, versionId) => {
  const response = await axiosInstance.post(
    `/designs/${designId}/versions/${versionId}/publish`
  );
  return response.data.data.version;
};

// General community page (navbar) — browses published designs across all
// problems. Mounted at /api/v1/community in app.js.

// Problem-scoped community tab — browses published designs for one
// specific problem. Mounted at /api/v1/problems/:problemId/community in
// problem.routes.js. Same backend controller/service as above, different
// mount point, so it needs its own call.
export const getProblemCommunityDesigns = async (problemId) => {
  const response = await axiosInstance.get(`/problems/${problemId}/community`);
  return response.data.data.designs;
};

// Fetches a single published design. Works from either context since both
// mounts expose /:designId — pass problemId when you have it (keeps the
// URL scoped/consistent), omit it to hit the general path.
const getCommunityDesigns = async ({ problemId }) => {
  const query = {
    isPosted: true,
  };
  if (problemId) {
    query.problemId = problemId;
  }
  const designs = await Design.find(query)
    .populate("ownerId", "username profilePicture")
    .populate("problemId", "title difficulty slug tags"); // was: "title difficulty"
  return { designs };
};
 
const getCommunityDesignById = async ({ problemId, designId }) => {
  const query = {
    isPosted: true,
    _id: designId,
  };
  if (problemId) {
    query.problemId = problemId;
  }
  const design = await Design.findOne(query)
    .populate("ownerId")
    .populate("problemId") // already unrestricted here, includes slug/tags
    .populate("postedVersion");
  if (!design) {
    throw new ApiError(404, "Design not found");
  }
  return { design };
};