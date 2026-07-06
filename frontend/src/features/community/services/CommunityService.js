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
export const getCommunityDesigns = async () => {
  const response = await axiosInstance.get(`/community`);
  return response.data.data.designs;
};
 
export const getCommunityDesignById = async (designId, problemId) => {
  const url = problemId
    ? `/problems/${problemId}/community/${designId}`
    : `/community/${designId}`;
  const response = await axiosInstance.get(url);
  return response.data.data.design;
};