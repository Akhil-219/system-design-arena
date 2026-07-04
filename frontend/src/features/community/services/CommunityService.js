import axiosInstance from "../../../api/axios.js";

// Publish a specific version to the community. Full path per the routing
// fix: /designs/:designId/versions/:versionId/publish
export const publishDesign = async (designId, versionId) => {
  const response = await axiosInstance.post(
    `/designs/${designId}/versions/${versionId}/publish`
  );
  return response.data.data.version;
};
